
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loadEmotionClassifier } from '@/utils/emotionModelUtils';

export const useEmotionClassifier = () => {
  const [classifier, setClassifier] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  return { classifier, isLoading };
};
