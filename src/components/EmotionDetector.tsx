
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, AlertTriangle, Heart, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

// Emotion data with icons, colors, and emoji
const emotionData = {
  joy: { icon: <Smile className="h-6 w-6" />, color: 'bg-emotion-joy', emoji: '😂' },
  sadness: { icon: <Frown className="h-6 w-6" />, color: 'bg-emotion-sadness', emoji: '😔' },
  anger: { icon: <AlertTriangle className="h-6 w-6" />, color: 'bg-emotion-anger', emoji: '😠' },
  fear: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-fear', emoji: '😨' },
  surprise: { icon: <Heart className="h-6 w-6" />, color: 'bg-emotion-surprise', emoji: '😮' },
  disgust: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-disgust', emoji: '🤮' },
  neutral: { icon: <Meh className="h-6 w-6" />, color: 'bg-emotion-neutral', emoji: '😐' }
};

// Mock emotions API response
const mockEmotionDetection = (text: string) => {
  if (!text.trim()) return null;
  
  // Simple mock algorithm to detect emotions
  const emotions = [
    { emotion: 'joy', probability: Math.random() * 0.3 },
    { emotion: 'sadness', probability: Math.random() * 0.2 },
    { emotion: 'anger', probability: Math.random() * 0.15 },
    { emotion: 'fear', probability: Math.random() * 0.1 },
    { emotion: 'surprise', probability: Math.random() * 0.1 },
    { emotion: 'disgust', probability: Math.random() * 0.05 },
    { emotion: 'neutral', probability: Math.random() * 0.1 }
  ];

  // Boost the emotion based on keywords
  const keywords = {
    joy: ['happy', 'great', 'excellent', 'love', 'wonderful', 'amazing'],
    sadness: ['sad', 'unhappy', 'depressed', 'miserable', 'unfortunate'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'irritated'],
    fear: ['afraid', 'scared', 'terrified', 'nervous', 'anxious'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished'],
    disgust: ['disgusting', 'gross', 'nasty', 'revolting'],
    neutral: ['okay', 'fine', 'neutral', 'average']
  };

  for (const emotion in keywords) {
    const relevantKeywords = keywords[emotion as keyof typeof keywords];
    for (const keyword of relevantKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        const index = emotions.findIndex(e => e.emotion === emotion);
        if (index !== -1) {
          emotions[index].probability += 0.3;
        }
      }
    }
  }

  // Normalize
  const total = emotions.reduce((sum, e) => sum + e.probability, 0);
  const normalized = emotions.map(e => ({
    ...e,
    probability: e.probability / total
  }));

  // Sort by probability
  normalized.sort((a, b) => b.probability - a.probability);
  
  return {
    prediction: normalized[0].emotion,
    confidence: normalized[0].probability,
    probabilities: normalized
  };
};

interface DetectionResult {
  prediction: string;
  confidence: number;
  probabilities: Array<{
    emotion: string;
    probability: number;
  }>;
}

const EmotionDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const detectEmotion = () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze emotions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const detectionResult = mockEmotionDetection(text);
      if (detectionResult) {
        setResult(detectionResult);
        
        // Save to history
        const history = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
        history.push({
          id: Date.now(),
          text,
          result: detectionResult,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('emotionHistory', JSON.stringify(history.slice(-20)));
      }
      setIsLoading(false);
    }, 1000);
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
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={detectEmotion} 
            disabled={isLoading || !text.trim()}
            className="px-6 py-5 text-lg"
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
      )}
    </div>
  );
};

export default EmotionDetector;
