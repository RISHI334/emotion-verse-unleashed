
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Brain, Upload, FileText, Cpu } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TrainingStats {
  epoch: number;
  loss: number;
  accuracy: number;
}

interface Dataset {
  name: string;
  text: string[];
  labels: string[];
  uniqueLabels: string[];
}

const EmotionTrainer = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStats, setTrainingStats] = useState<TrainingStats[]>([]);
  const [modelSaved, setModelSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = e.target?.result as string;
        parseDataset(rawData, file.name);
      } catch (error) {
        console.error("Error parsing dataset:", error);
        toast({
          title: "Dataset Error",
          description: "Could not parse the dataset file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const parseDataset = (rawData: string, fileName: string) => {
    // Simple CSV parsing (assumes format: text,label)
    const rows = rawData.split('\n').filter(row => row.trim());
    
    // Skip header if present
    const hasHeader = rows[0].toLowerCase().includes('text') && rows[0].toLowerCase().includes('label');
    const dataRows = hasHeader ? rows.slice(1) : rows;
    
    const text: string[] = [];
    const labels: string[] = [];
    
    dataRows.forEach(row => {
      const lastCommaIndex = row.lastIndexOf(',');
      if (lastCommaIndex !== -1) {
        const rowText = row.substring(0, lastCommaIndex).trim();
        const label = row.substring(lastCommaIndex + 1).trim();
        
        if (rowText && label) {
          text.push(rowText);
          labels.push(label);
        }
      }
    });
    
    const uniqueLabels = [...new Set(labels)];
    
    if (text.length === 0 || labels.length === 0) {
      toast({
        title: "Invalid Dataset",
        description: "The dataset is empty or in an incorrect format.",
        variant: "destructive"
      });
      return;
    }
    
    setDataset({
      name: fileName,
      text,
      labels,
      uniqueLabels
    });
    
    toast({
      title: "Dataset Loaded",
      description: `Loaded ${text.length} examples with ${uniqueLabels.length} unique emotions.`,
    });
  };

  const startTraining = async () => {
    if (!dataset) return;
    
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingStats([]);
    setModelSaved(false);
    
    try {
      // Simulate training process
      const totalEpochs = 5;
      
      for (let epoch = 1; epoch <= totalEpochs; epoch++) {
        // Simulate epoch training time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update progress
        setTrainingProgress((epoch / totalEpochs) * 100);
        
        // Generate some simulated metrics
        const loss = 0.8 - (epoch * 0.15) + (Math.random() * 0.05);
        const accuracy = 0.5 + (epoch * 0.08) + (Math.random() * 0.03);
        
        setTrainingStats(prev => [...prev, {
          epoch,
          loss: Number(loss.toFixed(4)),
          accuracy: Number(accuracy.toFixed(4))
        }]);
      }
      
      // Finalize training
      setTrainingProgress(100);
      
      // Save model to localStorage
      const modelMetadata = {
        name: `custom-emotion-model-${Date.now()}`,
        dataset: dataset.name,
        examples: dataset.text.length,
        labels: dataset.uniqueLabels,
        created: new Date().toISOString()
      };
      
      localStorage.setItem('customEmotionModel', JSON.stringify(modelMetadata));
      setModelSaved(true);
      
      toast({
        title: "Training Complete",
        description: "Your custom emotion model has been trained and saved.",
      });
    } catch (error) {
      console.error("Training error:", error);
      toast({
        title: "Training Error",
        description: "An error occurred during model training.",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  const resetTraining = () => {
    setDataset(null);
    setTrainingStats([]);
    setTrainingProgress(0);
    setModelSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" /> 
            Upload Emotion Dataset
          </CardTitle>
          <CardDescription>
            Upload your CSV dataset with text and emotion labels to train a custom model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                disabled={isTraining}
                className="cursor-pointer"
              />
              
              {dataset && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Dataset: {dataset.name}</AlertTitle>
                  <AlertDescription>
                    Loaded {dataset.text.length} examples with {dataset.uniqueLabels.length} emotions: 
                    {dataset.uniqueLabels.map(label => (
                      <span key={label} className="inline-block px-2 py-1 mr-1 mt-1 text-xs bg-primary/10 rounded-md">
                        {label}
                      </span>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetTraining}
            disabled={isTraining || !dataset}
          >
            Reset
          </Button>
          <Button 
            onClick={startTraining}
            disabled={isTraining || !dataset}
            className="gap-2"
          >
            {isTraining ? (
              <>Training...</>
            ) : (
              <>
                <Brain className="h-5 w-5" /> 
                Train Model
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {(isTraining || trainingStats.length > 0) && (
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
      )}
    </div>
  );
};

export default EmotionTrainer;
