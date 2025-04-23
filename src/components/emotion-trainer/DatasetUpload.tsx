
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';
import { Dataset } from './types';

interface DatasetUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dataset: Dataset | null;
  isTraining: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onReset: () => void;
  onStartTraining: () => void;
}

const DatasetUpload = ({
  onFileUpload,
  dataset,
  isTraining,
  fileInputRef,
  onReset,
  onStartTraining
}: DatasetUploadProps) => {
  return (
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
              onChange={onFileUpload}
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
          onClick={onReset}
          disabled={isTraining || !dataset}
        >
          Reset
        </Button>
        <Button 
          onClick={onStartTraining}
          disabled={isTraining || !dataset}
          className="gap-2"
        >
          {isTraining ? (
            <>Training...</>
          ) : (
            <>
              <FileText className="h-5 w-5" /> 
              Train Model
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatasetUpload;
