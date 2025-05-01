
import React from 'react';
import { Card, CardContent } from './ui/card';

interface EmotionModelStatusProps {
  isClassifierReady: boolean;
}

const EmotionModelStatus = ({ isClassifierReady }: EmotionModelStatusProps) => {
  return (
    <Card className="border-primary/20 bg-card/50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 text-sm">
          <div className={`h-2 w-2 rounded-full ${isClassifierReady ? 'bg-green-500' : 'bg-amber-500'}`}></div>
          <p>
            {isClassifierReady ? 'Model loaded and ready' : 'Model loading...'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionModelStatus;
