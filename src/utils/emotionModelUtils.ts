
import { pipeline } from '@huggingface/transformers';

// Type definitions for emotion detection results
export interface EmotionResult {
  prediction: string;
  confidence: number;
  probabilities: Array<{
    emotion: string;
    probability: number;
  }>;
}

// Map Ekman's 6 basic emotions to match the model
export const emotionMapping: Record<string, string> = {
  anger: 'anger',
  disgust: 'disgust',
  fear: 'fear',
  joy: 'joy',
  sadness: 'sadness',
  surprise: 'surprise',
  neutral: 'neutral'
};

// Cached model instance
let classifierInstance: any = null;

/**
 * Loads the emotion classification model
 * @returns {Promise<any>} The loaded classifier model
 */
export const loadEmotionClassifier = async (): Promise<any> => {
  try {
    // Return cached instance if available
    if (classifierInstance) {
      return classifierInstance;
    }
    
    // Load the model - using a reliable pre-trained model
    const model = await pipeline(
      'text-classification',
      'SamLowe/roberta-base-go_emotions'
    );
    
    classifierInstance = model;
    return model;
  } catch (error) {
    console.error("Error loading emotion detection model:", error);
    throw new Error("Could not load emotion detection model");
  }
};

/**
 * Detects emotion in the provided text
 * @param {string} text - The text to analyze
 * @returns {Promise<EmotionResult>} The emotion analysis result
 */
export const detectEmotion = async (text: string): Promise<EmotionResult> => {
  try {
    const classifier = await loadEmotionClassifier();
    
    // Get raw results from the model
    const results = await classifier(text);
    
    // Format the results
    const normalizedResults = results.map((r: any) => ({
      emotion: r.label.toLowerCase(),
      probability: r.score
    })).sort((a: any, b: any) => b.probability - a.probability);

    const topEmotion = normalizedResults[0];

    return {
      prediction: topEmotion.emotion,
      confidence: topEmotion.probability,
      probabilities: normalizedResults
    };
  } catch (error) {
    console.error("Emotion detection error:", error);
    throw new Error("Could not analyze emotions");
  }
};

/**
 * Saves analysis result to local history
 * @param {string} text - The analyzed text
 * @param {EmotionResult} result - The emotion analysis result
 */
export const saveToHistory = (text: string, result: EmotionResult): void => {
  const history = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
  history.push({
    id: Date.now(),
    text,
    result: result,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('emotionHistory', JSON.stringify(history.slice(-20)));
};
