
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmptyDashboard = () => {
  return (
    <Card className="p-12 text-center">
      <CardContent>
        <h3 className="text-lg font-medium mb-2">No Emotion Data Yet</h3>
        <p className="text-muted-foreground mb-4">Start analyzing text on the home page to build your emotional dashboard.</p>
        <Button asChild>
          <a href="/">Try Emotion Detection</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyDashboard;
