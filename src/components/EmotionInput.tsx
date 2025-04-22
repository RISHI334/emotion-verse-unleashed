
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmotionInputProps {
  text: string;
  setText: (text: string) => void;
  onDetect: () => void;
  isLoading: boolean;
  isClassifierReady: boolean;
}

const EmotionInput = ({ text, setText, onDetect, isLoading, isClassifierReady }: EmotionInputProps) => {
  const hasCustomModel = localStorage.getItem('customEmotionModel') !== null;

  return (
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
          disabled={isLoading || !isClassifierReady}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          asChild
          className="gap-2"
        >
          <Link to="/train">
            <Brain className="h-5 w-5" />
            {hasCustomModel ? "Retrain Model" : "Train Custom Model"}
          </Link>
        </Button>
        <Button 
          onClick={onDetect} 
          disabled={isLoading || !text.trim() || !isClassifierReady}
          className="px-6 py-5 text-lg"
        >
          {isLoading ? 'Analyzing...' : 'Detect Emotions'}
          {!isLoading && <Send className="ml-2 h-5 w-5" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionInput;
