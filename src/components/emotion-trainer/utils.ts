
import { Dataset } from './types';

export const parseDataset = (rawData: string, fileName: string): Dataset | null => {
  const rows = rawData.split('\n').filter(row => row.trim());
  const hasHeader = rows[0].toLowerCase().includes('text') && rows[0].toLowerCase().includes('emotion');
  const dataRows = hasHeader ? rows.slice(1) : rows;
  
  const text: string[] = [];
  const labels: string[] = [];
  
  dataRows.forEach(row => {
    const [textContent, emotion] = row.split(',').map(s => s.trim());
    if (textContent && emotion) {
      text.push(textContent);
      labels.push(emotion);
    }
  });
  
  const uniqueLabels = [...new Set(labels)];
  
  if (text.length === 0 || labels.length === 0) {
    return null;
  }
  
  return {
    name: fileName,
    text,
    labels,
    uniqueLabels
  };
};
