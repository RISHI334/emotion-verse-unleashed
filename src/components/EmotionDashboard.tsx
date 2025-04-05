
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Emotion colors matching our theme
const EMOTION_COLORS = {
  joy: '#FFD166',
  sadness: '#73A5C6',
  anger: '#FF5C5C',
  fear: '#A06CD5',
  surprise: '#66D7D1',
  disgust: '#7CAA2D',
  neutral: '#8D8D8D'
};

interface EmotionHistoryItem {
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

const EmotionDashboard = () => {
  const [history, setHistory] = useState<EmotionHistoryItem[]>([]);
  const [emotionCounts, setEmotionCounts] = useState<any[]>([]);
  const [emotionTrend, setEmotionTrend] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
    setHistory(savedHistory);
    
    // Process data for charts
    processEmotionData(savedHistory);
  };

  const processEmotionData = (data: EmotionHistoryItem[]) => {
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
    
    setEmotionCounts(emotionCountsData);

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
    
    setEmotionTrend(trendData);
  };

  const clearHistory = () => {
    localStorage.removeItem('emotionHistory');
    setHistory([]);
    setEmotionCounts([]);
    setEmotionTrend([]);
    
    toast({
      title: "History Cleared",
      description: "Your emotion detection history has been cleared."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Emotion Dashboard</h1>
          <p className="text-muted-foreground">Track and visualize your emotional patterns over time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadHistory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="destructive" onClick={clearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">No Emotion Data Yet</h3>
            <p className="text-muted-foreground mb-4">Start analyzing text on the home page to build your emotional dashboard.</p>
            <Button asChild>
              <a href="/">Try Emotion Detection</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="emotion-card">
              <CardHeader>
                <CardTitle>Emotion Distribution</CardTitle>
                <CardDescription>Breakdown of your detected emotions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionCounts.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={EMOTION_COLORS[entry.name as keyof typeof EMOTION_COLORS] || '#8884d8'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="emotion-card">
              <CardHeader>
                <CardTitle>Emotion Trends</CardTitle>
                <CardDescription>Your emotional variations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionTrend}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {Object.keys(EMOTION_COLORS).map((emotion) => (
                      <Bar 
                        key={emotion} 
                        dataKey={emotion} 
                        stackId="a" 
                        fill={EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS]} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

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
        </>
      )}
    </div>
  );
};

export default EmotionDashboard;
