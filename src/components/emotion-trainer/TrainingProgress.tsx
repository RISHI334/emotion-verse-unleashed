
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Cpu } from 'lucide-react';
import { TrainingStats } from './types';

interface TrainingProgressProps {
  isTraining: boolean;
  trainingProgress: number;
  trainingStats: TrainingStats[];
  modelSaved: boolean;
}

const TrainingProgress = ({
  isTraining,
  trainingProgress,
  trainingStats,
  modelSaved,
}: TrainingProgressProps) => {
  if (!isTraining && trainingStats.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-6 w-6" /> 
          Training Progress
        </CardTitle>
        <CardDescription>
          {isTraining 
            ? "Your custom emotion model is being trained..." 
            : "Training complete. View your model performance below."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{Math.round(trainingProgress)}%</span>
          </div>
          <Progress value={trainingProgress} className="h-2" />
        </div>
        
        {trainingStats.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Epoch</TableHead>
                <TableHead>Loss</TableHead>
                <TableHead>Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingStats.map((stat) => (
                <TableRow key={stat.epoch}>
                  <TableCell>{stat.epoch}</TableCell>
                  <TableCell>{stat.loss}</TableCell>
                  <TableCell>{(stat.accuracy * 100).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {modelSaved && (
          <Alert className="bg-green-500/10 border-green-500/30">
            <Brain className="h-4 w-4" />
            <AlertTitle>Model Saved Successfully</AlertTitle>
            <AlertDescription>
              Your custom emotion model has been saved and is ready to use. You can now use it 
              to analyze emotions in your text.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingProgress;
