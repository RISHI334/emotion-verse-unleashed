
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EmptyDashboard from '@/components/dashboard/EmptyDashboard';
import EmotionDistributionChart from '@/components/dashboard/EmotionDistributionChart';
import EmotionTrendChart from '@/components/dashboard/EmotionTrendChart';
import EmotionHistoryList from '@/components/dashboard/EmotionHistoryList';
import { loadEmotionHistory, clearEmotionHistory, processEmotionData } from '@/utils/dashboardUtils';
import { EmotionHistoryItem } from '@/types/emotions';

const EmotionDashboard = () => {
  const [history, setHistory] = useState<EmotionHistoryItem[]>([]);
  const [emotionCounts, setEmotionCounts] = useState<any[]>([]);
  const [emotionTrend, setEmotionTrend] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = loadEmotionHistory();
    setHistory(savedHistory);
    
    // Process data for charts
    const { emotionCountsData, trendData } = processEmotionData(savedHistory);
    setEmotionCounts(emotionCountsData);
    setEmotionTrend(trendData);
  };

  const handleClearHistory = () => {
    clearEmotionHistory();
    setHistory([]);
    setEmotionCounts([]);
    setEmotionTrend([]);
    
    toast({
      title: "History Cleared",
      description: "Your emotion detection history has been cleared."
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-fade-in">
      <DashboardHeader onRefresh={loadHistory} onClear={handleClearHistory} />

      {history.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmotionDistributionChart emotionCounts={emotionCounts} />
            <EmotionTrendChart emotionTrend={emotionTrend} />
          </div>
          <EmotionHistoryList history={history} />
        </>
      )}
    </div>
  );
};

export default EmotionDashboard;
