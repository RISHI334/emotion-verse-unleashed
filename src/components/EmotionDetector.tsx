
import React from 'react';
import EmotionInput from './EmotionInput';
import EmotionResultCard from './EmotionResultCard';
import EmotionModelStatus from './EmotionModelStatus';
import { useEmotionClassifier } from '@/hooks/useEmotionClassifier';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';

const EmotionDetector = () => {
  const { classifier, isLoading: isLoadingClassifier } = useEmotionClassifier();
  const { 
    text, 
    setText, 
    result, 
    isDetecting, 
    handleDetectEmotion 
  } = useEmotionDetection();

  const isLoading = isLoadingClassifier || isDetecting;
  const isClassifierReady = !!classifier;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      <EmotionModelStatus isClassifierReady={isClassifierReady} />
      
      <EmotionInput 
        text={text}
        setText={setText}
        onDetect={handleDetectEmotion}
        isLoading={isLoading}
        isClassifierReady={isClassifierReady}
      />

      {result && <EmotionResultCard result={result} text={text} />}
    </div>
  );
};

export default EmotionDetector;
