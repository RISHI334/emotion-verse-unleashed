
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import EmotionInput from './EmotionInput';
import EmotionResultCard from './EmotionResultCard';
import { Card, CardContent } from './ui/card';
import { 
  loadEmotionClassifier, 
  detectEmotion as detectEmotionUtil,
  saveToHistory
} from '@/utils/emotionModelUtils';

const EmotionDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classifier, setClassifier] = useState<any>(null);
  const { toast } = useToast();

  const loadClassifier = useCallback(async () => {
    setIsLoading(true);
    try {
      const model = await loadEmotionClassifier();
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

  const handleDetectEmotion = async () => {
    if (!text.trim() || !classifier) return;
    setIsLoading(true);
    
    try {
      const result = await detectEmotionUtil(text);
      setResult(result);
      saveToHistory(text, result);
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      {/* Model status display card */}
      <Card className="border-primary/20 bg-card/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${classifier ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <p>
              {classifier ? 'Model loaded and ready' : 'Model loading...'}
            </p>
          </div>
        </CardContent>
      </Card>

      <EmotionInput 
        text={text}
        setText={setText}
        onDetect={handleDetectEmotion}
        isLoading={isLoading}
        isClassifierReady={!!classifier}
      />
      {result && <EmotionResultCard result={result} text={text} />}
    </div>
  );
};

export default EmotionDetector;
