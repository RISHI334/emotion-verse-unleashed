
import React, { useState, useEffect, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { useToast } from '@/hooks/use-toast';
import EmotionInput from './EmotionInput';
import EmotionResultCard from './EmotionResultCard';

const EmotionDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classifier, setClassifier] = useState<any>(null);
  const { toast } = useToast();

  const loadClassifier = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using the official go_emotions model for web
      const model = await pipeline(
        'text-classification',
        'Xenova/go_emotions',
        { 
          quantized: true
        }
      );
      setClassifier(model);
      toast({
        title: "Model Loaded",
        description: "Go Emotions detection model is ready.",
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

  const detectEmotion = async () => {
    if (!text.trim() || !classifier) return;

    setIsLoading(true);
    
    try {
      const results = await classifier(text);
      
      // Format the results - go_emotions has 28 emotion categories
      const normalizedResults = results.map((r: any) => ({
        emotion: r.label.toLowerCase(),
        probability: r.score
      })).sort((a: any, b: any) => b.probability - a.probability);

      // Get the top emotion
      const topEmotion = normalizedResults[0];

      setResult({
        prediction: topEmotion.emotion,
        confidence: topEmotion.probability,
        probabilities: normalizedResults
      });

      // Save to history
      const history = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
      history.push({
        id: Date.now(),
        text,
        result: {
          prediction: topEmotion.emotion,
          confidence: topEmotion.probability,
          probabilities: normalizedResults
        },
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('emotionHistory', JSON.stringify(history.slice(-20)));
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
