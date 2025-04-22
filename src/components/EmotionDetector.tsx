import React, { useState, useEffect, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, AlertTriangle, Heart, Send, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const emotionData = {
  joy: { icon: <Smile className="h-6 w-6" />, color: 'bg-emotion-joy', emoji: '😂' },
  sadness: { icon: <Frown className="h-6 w-6" />, color: 'bg-emotion-sadness', emoji: '😔' },
  anger: { icon: <AlertTriangle className="h-6 w-6" />, color: 'bg-emotion-anger', emoji: '😠' },
  fear: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-fear', emoji: '😨' },
  surprise: { icon: <Heart className="h-6 w-6" />, color: 'bg-emotion-surprise', emoji: '😮' },
  disgust: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-disgust', emoji: '🤮' },
  neutral: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-neutral', emoji: '😐' }
};

const EmotionDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classifier, setClassifier] = useState<any>(null);
  const { toast } = useToast();

  const loadClassifier = useCallback(async () => {
    setIsLoading(true);
    try {
      const model = await pipeline(
        'text-classification', 
        'j-hartmann/emotion-english-distilroberta-base',
        { device: 'cpu' }
      );
      setClassifier(model);
      toast({
        title: "Model Loaded",
        description: "Emotion classification model is ready to use.",
      });
    } catch (error) {
      console.error("Error loading model:", error);
      toast({
        title: "Model Loading Error",
        description: "Could not load emotion classification model.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadClassifier();
  }, [loadClassifier]);

  const detectEmotion = async () => {
    if (!text.trim() || !classifier) return;

    setIsLoading(true);
    
    try {
      const results = await classifier(text, { topk: 5 });
      
      const normalizedResults = results.map((r: any) => ({
        emotion: r.label,
        probability: r.score
      })).sort((a: any, b: any) => b.probability - a.probability);

      setResult({
        prediction: normalizedResults[0].emotion,
        confidence: normalizedResults[0].probability,
        probabilities: normalizedResults
      });

      const history = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
      history.push({
        id: Date.now(),
        text,
        result: {
          prediction: normalizedResults[0].emotion,
          confidence: normalizedResults[0].probability,
          probabilities: normalizedResults
        },
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('emotionHistory', JSON.stringify(history.slice(-20)));

    } catch (error) {
      console.error("Emotion detection error:", error);
      toast({
        title: "Emotion Detection Error",
        description: "Could not detect emotions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      <Card className="emotion-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">How are you feeling?</CardTitle>
          <CardDescription>
            Enter your text below and we'll analyze the emotions in your message.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts, feelings, or a message you've received..."
            className="emotion-input min-h-[150px] text-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading || !classifier}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={detectEmotion} 
            disabled={isLoading || !text.trim() || !classifier}
            className="px-6 py-5 text-lg ml-auto"
          >
            {isLoading ? 'Analyzing...' : 'Detect Emotions'}
            {!isLoading && <Send className="ml-2 h-5 w-5" />}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card className={`emotion-card border-2 ${emotionData[result.prediction as keyof typeof emotionData].color}/30`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center">
                Detected Emotion: 
                <Badge className={`ml-3 text-white ${emotionData[result.prediction as keyof typeof emotionData].color}`}>
                  <span className="mr-1">{result.prediction}</span>
                  <span className="text-xl">{emotionData[result.prediction as keyof typeof emotionData].emoji}</span>
                </Badge>
              </CardTitle>
              <div className="text-4xl">
                {emotionData[result.prediction as keyof typeof emotionData].emoji}
              </div>
            </div>
            <CardDescription>
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {result.probabilities.map((item: any) => (
                <div key={item.emotion} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <div className="flex items-center">
                      {emotionData[item.emotion as keyof typeof emotionData].icon}
                      <span className="ml-2 capitalize">{item.emotion}</span>
                    </div>
                    <span>{(item.probability * 100).toFixed(2)}%</span>
                  </div>
                  <Progress 
                    value={item.probability * 100} 
                    className={`h-2 ${emotionData[item.emotion as keyof typeof emotionData].color}/70`} 
                  />
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Text Analysis:</h4>
              <div className="bg-secondary p-3 rounded-lg text-sm italic">
                "{text}"
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionDetector;
