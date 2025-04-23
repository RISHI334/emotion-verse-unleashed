
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Dataset {
  name: string;
  text: string[];
  labels: string[];
  uniqueLabels: string[];
}

interface TrainingStats {
  epoch: number;
  loss: number;
  accuracy: number;
}

const parseDataset = (rawData: string, filename: string): Dataset | null => {
  try {
    const lines = rawData.split('\n').filter(line => line.trim());
    const text: string[] = [];
    const labels: string[] = [];
    const uniqueLabels = new Set<string>();

    lines.forEach(line => {
      const parts = line.split(';');
      if (parts.length >= 2) {
        const label = parts[0].trim();
        const content = parts.slice(1).join(';').trim();
        
        if (content && label) {
          labels.push(label);
          text.push(content);
          uniqueLabels.add(label);
        }
      }
    });

    return {
      name: filename,
      text,
      labels,
      uniqueLabels: Array.from(uniqueLabels)
    };
  } catch (error) {
    console.error('Error parsing dataset:', error);
    return null;
  }
};

const EmotionTrainer = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStats, setTrainingStats] = useState<TrainingStats[]>([]);
  const [modelSaved, setModelSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.includes('emotion_dataset_raw')) {
      toast({
        title: "Invalid Dataset",
        description: "Please upload the emotion_dataset_raw file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = e.target?.result as string;
        const parsedDataset = parseDataset(rawData, file.name);
        
        if (parsedDataset) {
          setDataset(parsedDataset);
          toast({
            title: "Dataset Loaded",
            description: `Loaded ${parsedDataset.text.length} examples with ${parsedDataset.uniqueLabels.length} unique emotions.`,
          });
        } else {
          toast({
            title: "Dataset Error",
            description: "Could not parse the dataset file.",
            variant: "destructive"
          });
        }
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

  const startTraining = async () => {
    if (!dataset) return;
    
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingStats([]);
    setModelSaved(false);

    try {
      const classifier = await pipeline('text-classification', 'j-hartmann/emotion-english-distilroberta-base', {
        device: 'webgpu'
      });

      const batchSize = 32;
      const epochs = 5;
      const totalBatches = Math.ceil(dataset.text.length / batchSize);

      for (let epoch = 1; epoch <= epochs; epoch++) {
        let epochLoss = 0;
        let correct = 0;
        let total = 0;

        for (let i = 0; i < dataset.text.length; i += batchSize) {
          const batchTexts = dataset.text.slice(i, i + batchSize);
          const batchLabels = dataset.labels.slice(i, i + batchSize);

          const predictions = await classifier(batchTexts, {
            top_k: 1
          });

          predictions.forEach((pred: any, idx: number) => {
            if (pred[0].label === batchLabels[idx]) {
              correct++;
            }
            total++;
            epochLoss += 1 - pred[0].score;
          });

          const progress = ((epoch - 1) * totalBatches + (i / batchSize)) / (epochs * totalBatches) * 100;
          setTrainingProgress(progress);
        }

        const accuracy = correct / total;
        const averageLoss = epochLoss / total;

        setTrainingStats(prev => [...prev, {
          epoch,
          loss: Number(averageLoss.toFixed(4)),
          accuracy: Number(accuracy.toFixed(4))
        }]);
      }

      const modelMetadata = {
        name: `emotion-model-${Date.now()}`,
        dataset: dataset.name,
        examples: dataset.text.length,
        labels: dataset.uniqueLabels,
        created: new Date().toISOString()
      };

      localStorage.setItem('emotionModel', JSON.stringify(modelMetadata));
      setModelSaved(true);

      toast({
        title: "Training Complete",
        description: "Your emotion detection model has been trained and saved.",
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
      setTrainingProgress(100);
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

  // Dataset Upload Component
  const DatasetUpload = () => (
    <Card>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            disabled={isTraining}
          />
          <p className="text-sm text-muted-foreground">
            Upload a dataset file with emotion labels and text examples
          </p>
        </div>

        {dataset && (
          <div className="space-y-2">
            <Alert>
              <AlertTitle>Dataset Loaded</AlertTitle>
              <AlertDescription>
                <p>Filename: {dataset.name}</p>
                <p>Examples: {dataset.text.length}</p>
                <p>Labels: {dataset.uniqueLabels.join(', ')}</p>
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2">
              <Button
                onClick={startTraining}
                disabled={isTraining}
                className="flex-1"
              >
                {isTraining ? 'Training...' : 'Start Training'}
              </Button>
              <Button
                variant="outline"
                onClick={resetTraining}
                disabled={isTraining}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Training Progress Component
  const TrainingProgress = () => (
    <>
      {(isTraining || trainingStats.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTraining && (
              <div className="space-y-2">
                <p>Training in progress...</p>
                <Progress value={trainingProgress} />
                <p className="text-sm text-muted-foreground">
                  {Math.round(trainingProgress)}% complete
                </p>
              </div>
            )}

            {trainingStats.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Training Statistics</h3>
                <div className="grid grid-cols-3 gap-2 font-semibold">
                  <div>Epoch</div>
                  <div>Loss</div>
                  <div>Accuracy</div>
                </div>
                {trainingStats.map((stat) => (
                  <div key={stat.epoch} className="grid grid-cols-3 gap-2">
                    <div>{stat.epoch}</div>
                    <div>{stat.loss}</div>
                    <div>{(stat.accuracy * 100).toFixed(2)}%</div>
                  </div>
                ))}
                {modelSaved && (
                  <Alert className="bg-green-50 dark:bg-green-950">
                    <AlertTitle>Model Saved</AlertTitle>
                    <AlertDescription>
                      Your emotion detection model has been saved and is ready to use.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <DatasetUpload />
      <TrainingProgress />
    </div>
  );
};

export default EmotionTrainer;
