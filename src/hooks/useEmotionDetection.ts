
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { detectEmotion, saveToHistory } from '@/utils/emotionModelUtils';

export const useEmotionDetection = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const { toast } = useToast();

  const handleDetectEmotion = async () => {
    if (!text.trim()) return;
    
    setIsDetecting(true);
    try {
      const detectionResult = await detectEmotion(text);
      setResult(detectionResult);
      saveToHistory(text, detectionResult);
    } catch (error) {
      console.error("Emotion detection error:", error);
      toast({
        title: "Emotion Detection Error",
        description: "Could not analyze emotions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    text,
    setText,
    result,
    isDetecting,
    handleDetectEmotion
  };
};
