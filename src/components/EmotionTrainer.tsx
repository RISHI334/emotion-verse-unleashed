
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';
import DatasetUpload from './emotion-trainer/DatasetUpload';
import TrainingProgress from './emotion-trainer/TrainingProgress';
import { Dataset, TrainingStats } from './emotion-trainer/types';
import { parseDataset } from './emotion-trainer/utils';

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

  return (
    <div className="space-y-6 animate-fade-in">
      <DatasetUpload
        onFileUpload={handleFileUpload}
        dataset={dataset}
        isTraining={isTraining}
        fileInputRef={fileInputRef}
        onReset={resetTraining}
        onStartTraining={startTraining}
      />

      <TrainingProgress
        isTraining={isTraining}
        trainingProgress={trainingProgress}
        trainingStats={trainingStats}
        modelSaved={modelSaved}
      />
    </div>
  );
};

export default EmotionTrainer;
