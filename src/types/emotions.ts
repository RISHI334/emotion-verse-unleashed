
export interface EmotionHistoryItem {
  id: number;
  text: string;
  result: {
    prediction: string;
    confidence: number;
    probabilities: Array<{
      emotion: string;
      probability: number;
    }>;
  };
  timestamp: string;
}
