
export interface TrainingStats {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface Dataset {
  name: string;
  text: string[];
  labels: string[];
  uniqueLabels: string[];
}
