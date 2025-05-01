import React, { useState, useEffect, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { useToast } from '@/hooks/use-toast';
import EmotionInput from './EmotionInput';
import EmotionResultCard from './EmotionResultCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload } from 'lucide-react';

const EmotionDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classifier, setClassifier] = useState<any>(null);
  const [dataset, setDataset] = useState<any[]>([]);
  const [isDatasetLoaded, setIsDatasetLoaded] = useState(false);
  const { toast } = useToast();

  // Map Ekman's 6 basic emotions to match our model
  const emotionMapping: Record<string, string> = {
    anger: 'anger',
    disgust: 'disgust',
    fear: 'fear',
    joy: 'joy',
    sadness: 'sadness',
    surprise: 'surprise',
    neutral: 'neutral'
  };

  const loadClassifier = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using a more reliable model from HuggingFace
      const model = await pipeline(
        'text-classification',
        'SamLowe/roberta-base-go_emotions'
        // Removing the quantized property as it's not supported
      );
      setClassifier(model);
      toast({
        title: "Model Loaded",
        description: "Emotion detection model is ready.",
      });
    } catch (error) {
      console.error("Error loading model:", error);
      toast({
        title: "Model Loading Error",
        description: "Could not load emotion detection model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadClassifier();
  }, [loadClassifier]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const parsedData = parseCSV(csvData);
        setDataset(parsedData);
        setIsDatasetLoaded(true);
        toast({
          title: "Dataset Loaded",
          description: `Successfully loaded ${parsedData.length} entries from CSV.`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Dataset Error",
          description: "Could not parse the CSV file. Please check the format.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "File Error",
        description: "Could not read the file.",
        variant: "destructive"
      });
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const parseCSV = (csvData: string) => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Find text and emotion column indexes
    const textIndex = headers.findIndex(h => 
      h.toLowerCase().includes('text') || h.toLowerCase().includes('content') || h.toLowerCase().includes('statement'));
    const emotionIndex = headers.findIndex(h => 
      h.toLowerCase().includes('emotion') || h.toLowerCase().includes('sentiment') || h.toLowerCase().includes('feeling'));
    
    if (textIndex === -1 || emotionIndex === -1) {
      throw new Error("Could not identify text or emotion columns in CSV");
    }

    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const currentLine = lines[i].split(',').map(value => value.trim());
      if (currentLine.length >= Math.max(textIndex, emotionIndex) + 1) {
        result.push({
          text: currentLine[textIndex],
          emotion: currentLine[emotionIndex].toLowerCase()
        });
      }
    }
    return result;
  };

  const detectEmotion = async () => {
    if (!text.trim() || !classifier) return;
    setIsLoading(true);
    
    try {
      // If we have dataset loaded, use it as a reference
      if (isDatasetLoaded && dataset.length > 0) {
        // Simple cosine similarity approach for demonstration
        const matchedEntry = findMostSimilarText(text);
        if (matchedEntry) {
          const mappedEmotion = emotionMapping[matchedEntry.emotion] || matchedEntry.emotion;
          
          // Create a result similar to the model output structure
          const result = {
            prediction: mappedEmotion,
            confidence: 0.85, // Using a high confidence for the match
            probabilities: Object.keys(emotionMapping).map(emotion => ({
              emotion: emotion,
              probability: emotion === mappedEmotion ? 0.85 : 0.15 / (Object.keys(emotionMapping).length - 1)
            })).sort((a, b) => b.probability - a.probability)
          };
          
          setResult(result);
          saveToHistory(result);
          return;
        }
      }
      
      // Fallback to the model if no match found or no dataset loaded
      const results = await classifier(text);
      
      // Format the results
      const normalizedResults = results.map((r: any) => ({
        emotion: r.label.toLowerCase(),
        probability: r.score
      })).sort((a: any, b: any) => b.probability - a.probability);

      const topEmotion = normalizedResults[0];

      const result = {
        prediction: topEmotion.emotion,
        confidence: topEmotion.probability,
        probabilities: normalizedResults
      };
      
      setResult(result);
      saveToHistory(result);
      
    } catch (error) {
      console.error("Emotion detection error:", error);
      toast({
        title: "Emotion Detection Error",
        description: "Could not analyze emotions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const findMostSimilarText = (inputText: string) => {
    // Very simple approach - just for demonstration purposes
    // In a real implementation, you'd want to use proper text similarity algorithms
    const normalizedInput = inputText.toLowerCase();
    
    let bestMatch = null;
    let highestSimilarity = -1;
    
    dataset.forEach(entry => {
      const normalizedEntry = entry.text.toLowerCase();
      
      // Simple word overlap similarity
      const inputWords = normalizedInput.split(' ');
      const entryWords = normalizedEntry.split(' ');
      const commonWords = inputWords.filter(word => entryWords.includes(word)).length;
      const similarity = commonWords / Math.max(inputWords.length, entryWords.length);
      
      if (similarity > highestSimilarity && similarity > 0.3) { // 0.3 threshold
        highestSimilarity = similarity;
        bestMatch = entry;
      }
    });
    
    return bestMatch;
  };

  const saveToHistory = (result: any) => {
    const history = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
    history.push({
      id: Date.now(),
      text,
      result: result,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('emotionHistory', JSON.stringify(history.slice(-20)));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      {/* CSV Upload Card */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Dataset Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Upload your Ekman emotions CSV file to improve detection accuracy
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('csvUpload')?.click()}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isDatasetLoaded ? 'Reload Dataset' : 'Upload Ekman Dataset'}
                </Button>
              </div>
              {isDatasetLoaded && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {dataset.length} emotion samples loaded
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EmotionInput 
        text={text}
        setText={setText}
        onDetect={detectEmotion}
        isLoading={isLoading}
        isClassifierReady={!!classifier}
      />
      {result && <EmotionResultCard result={result} text={text} />}
    </div>
  );
};

export default EmotionDetector;
