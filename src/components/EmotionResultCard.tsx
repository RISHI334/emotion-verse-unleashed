
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Smile, Frown, Meh, AlertTriangle, Heart } from 'lucide-react';

type EmotionResult = {
  prediction: string;
  confidence: number;
  probabilities: Array<{
    emotion: string;
    probability: number;
  }>;
};

interface EmotionResultCardProps {
  result: EmotionResult;
  text: string;
}

const emotionData = {
  joy: { icon: <Smile className="h-6 w-6" />, color: 'bg-emotion-joy', emoji: '😂' },
  sadness: { icon: <Frown className="h-6 w-6" />, color: 'bg-emotion-sadness', emoji: '😔' },
  anger: { icon: <AlertTriangle className="h-6 w-6" />, color: 'bg-emotion-anger', emoji: '😠' },
  fear: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-fear', emoji: '😨' },
  surprise: { icon: <Heart className="h-6 w-6" />, color: 'bg-emotion-surprise', emoji: '😮' },
  disgust: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-disgust', emoji: '🤮' },
  neutral: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-neutral', emoji: '😐' }
};

const EmotionResultCard = ({ result, text }: EmotionResultCardProps) => {
  return (
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
          {result.probabilities.map((item) => (
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
  );
};

export default EmotionResultCard;
