import { Timestamp } from 'firebase/firestore';

export type SectionType = 'story' | 'mcq' | 'true_false' | 'qa' | 'illustration' | 'fib';

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

export interface FIBData {
  question: string; // The sentence with blanks
  answer: string;   // The correct word(s) to fill in
  explanation?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  content?: string; // For story text
  data?: MCQData | TrueFalseData | QAData | FIBData | any;
  imageUrl?: string;
  imagePrompt?: string;
  layout?: 'text-only' | 'image-top' | 'image-bottom' | 'image-left' | 'image-right' | 'background';
  font?: 'sans' | 'serif' | 'mono' | 'handwriting' | 'cursive' | 'default';
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  author?: string;
  coverImage?: string;
  template: 'classic' | 'children' | 'workbook' | 'minimal' | 'modern' | 'story-book';
  sections: Section[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
