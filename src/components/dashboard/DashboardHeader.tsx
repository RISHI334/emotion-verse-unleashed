
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onClear: () => void;
}

const DashboardHeader = ({ onRefresh, onClear }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Your Emotion Dashboard</h1>
        <p className="text-muted-foreground">Track and visualize your emotional patterns over time</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="destructive" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
