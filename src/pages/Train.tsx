
import React from 'react';
import Navbar from '@/components/Navbar';
import EmotionTrainer from '@/components/EmotionTrainer';

const Train = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 emotion-gradient-text">
            Train Your Emotion Model
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your dataset and train a custom emotion detection model
          </p>
        </div>

        <EmotionTrainer />
      </main>
      <footer className="bg-secondary/50 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Emotion-Verse &copy; 2025 | Sentiment Analysis & Emotion Detection
        </p>
      </footer>
    </div>
  );
};

export default Train;
