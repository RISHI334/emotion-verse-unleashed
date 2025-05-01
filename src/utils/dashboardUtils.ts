
import { EmotionHistoryItem } from "@/types/emotions";

// Emotion colors matching our theme
export const EMOTION_COLORS = {
  joy: '#FFD166',
  sadness: '#73A5C6',
  anger: '#FF5C5C',
  fear: '#A06CD5',
  surprise: '#66D7D1',
  disgust: '#7CAA2D',
  neutral: '#8D8D8D'
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const loadEmotionHistory = (): EmotionHistoryItem[] => {
  return JSON.parse(localStorage.getItem('emotionHistory') || '[]');
};

export const clearEmotionHistory = () => {
  localStorage.removeItem('emotionHistory');
};

export const processEmotionData = (data: EmotionHistoryItem[]) => {
  // Count emotions for pie chart
  const counts: Record<string, number> = {};
  data.forEach(item => {
    const emotion = item.result.prediction;
    counts[emotion] = (counts[emotion] || 0) + 1;
  });
  
  const emotionCountsData = Object.keys(counts).map(emotion => ({
    name: emotion,
    value: counts[emotion]
  }));

  // Create timeline data for trend chart (last 7 entries)
  const trendData = data.slice(-7).map((item, index) => {
    const entry: Record<string, any> = {
      name: `Entry ${index + 1}`,
    };
    
    item.result.probabilities.forEach(prob => {
      entry[prob.emotion] = prob.probability * 100;
    });
    
    return entry;
  });

  return {
    emotionCountsData,
    trendData
  };
};
