
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmotionHistoryItem } from '@/types/emotions';
import { formatDate } from '@/utils/dashboardUtils';

interface EmotionHistoryListProps {
  history: EmotionHistoryItem[];
}

const EmotionHistoryList = ({ history }: EmotionHistoryListProps) => {
  return (
    <Card className="emotion-card">
      <CardHeader>
        <CardTitle>Recent Emotion Analysis</CardTitle>
        <CardDescription>Your latest analyzed texts and detected emotions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {history.slice().reverse().map((item) => (
            <div key={item.id} className="border rounded-lg p-4 card-hover">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <Badge 
                  className={`w-fit bg-emotion-${item.result.prediction}`}
                >
                  {item.result.prediction} ({(item.result.confidence * 100).toFixed(1)}%)
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(item.timestamp)}
                </span>
              </div>
              <p className="text-sm line-clamp-2">{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHistoryList;
