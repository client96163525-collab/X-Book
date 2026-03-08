import { Timestamp } from 'firebase/firestore';

export type SectionType = 'story' | 'mcq' | 'true_false' | 'qa' | 'illustration';

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQData {
  question: string;
  options: MCQOption[];
  explanation?: string;
}

export interface TrueFalseData {
  statement: string;
  isTrue: boolean;
  explanation?: string;
}

export interface QAData {
  question: string;
  answer: string;
}

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  content?: string; // For story text
  data?: MCQData | TrueFalseData | QAData | any;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  author?: string;
  template: 'classic' | 'children' | 'workbook' | 'minimal' | 'modern';
  sections: Section[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
