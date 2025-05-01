
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { EMOTION_COLORS } from '@/utils/dashboardUtils';

interface EmotionTrendChartProps {
  emotionTrend: any[];
}

const EmotionTrendChart = ({ emotionTrend }: EmotionTrendChartProps) => {
  return (
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
  );
};

export default EmotionTrendChart;
