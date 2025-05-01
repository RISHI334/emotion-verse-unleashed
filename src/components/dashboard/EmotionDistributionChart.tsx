
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EMOTION_COLORS } from '@/utils/dashboardUtils';

interface EmotionDistributionChartProps {
  emotionCounts: Array<{
    name: string;
    value: number;
  }>;
}

const EmotionDistributionChart = ({ emotionCounts }: EmotionDistributionChartProps) => {
  return (
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
  );
};

export default EmotionDistributionChart;
