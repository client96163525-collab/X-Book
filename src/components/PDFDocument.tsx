import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Section, MCQData, TrueFalseData, QAData, FIBData } from '../types';

// Register fonts
Font.register({
  family: 'Noto Sans Devanagari',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansdevanagari/NotoSansDevanagari-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansdevanagari/NotoSansDevanagari-Bold.ttf', fontWeight: 'bold' },
  ]
});

Font.register({
  family: 'Noto Serif Devanagari',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notoserifdevanagari/NotoSerifDevanagari-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notoserifdevanagari/NotoSerifDevanagari-Bold.ttf', fontWeight: 'bold' },
  ]
});

Font.register({
  family: 'Kalam',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/kalam/Kalam-Regular.ttf', fontWeight: 'normal' },
  ]
});

Font.register({
  family: 'Teko',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/teko/Teko-Regular.ttf', fontWeight: 'normal' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Noto Sans Devanagari',
    fontSize: 12,
    lineHeight: 1.5,
  },
  // ... (keep existing styles)
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 50,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: 'Noto Sans Devanagari',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    color: '#666',
  },
  coverAuthor: {
    fontSize: 14,
    marginTop: 100,
    textAlign: 'center',
  },
  tocPage: {
    padding: 50,
  },
  tocTitle: {
    fontSize: 24,
    fontFamily: 'Noto Sans Devanagari',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'dotted',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Noto Sans Devanagari',
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 10,
    width: '90%',
    objectFit: 'contain',
    alignSelf: 'center',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  // Quiz Styles
  quizContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  questionText: {
    fontSize: 12,
    fontFamily: 'Noto Sans Devanagari',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 11,
    marginLeft: 10,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 5,
    marginLeft: 10,
  },
  answerText: {
    fontSize: 11,
    marginTop: 5,
    color: '#333',
  },
});

interface PDFDocumentProps {
  title: string;
  subtitle?: string;
  author?: string;
  sections: Section[];
  template?: string;
}

const getThemeStyles = (template: string = 'classic') => {
  switch (template) {
    case 'modern':
      return StyleSheet.create({
        page: { padding: 50, fontFamily: 'Noto Sans Devanagari', fontSize: 12, lineHeight: 1.6, color: '#333' },
        coverTitle: { fontSize: 48, fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold', marginBottom: 10, textAlign: 'left', color: '#2563eb' },
        coverSubtitle: { fontSize: 24, marginBottom: 40, textAlign: 'left', color: '#64748b' },
        coverAuthor: { fontSize: 16, marginTop: 100, textAlign: 'left', color: '#333' },
        sectionTitle: { fontSize: 24, fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold', marginBottom: 20, marginTop: 30, color: '#2563eb' },
      });
    case 'minimal':
      return StyleSheet.create({
        page: { padding: 60, fontFamily: 'Noto Sans Devanagari', fontSize: 11, lineHeight: 1.8, color: '#000' },
        coverTitle: { fontSize: 32, fontFamily: 'Noto Sans Devanagari', marginBottom: 30, textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase' },
        coverSubtitle: { fontSize: 14, marginBottom: 40, textAlign: 'center', color: '#666', letterSpacing: 1 },
        coverAuthor: { fontSize: 12, marginTop: 100, textAlign: 'center', textTransform: 'uppercase' },
        sectionTitle: { fontSize: 18, fontFamily: 'Noto Sans Devanagari', marginBottom: 20, marginTop: 40, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 },
      });
    case 'children':
      return StyleSheet.create({
        page: { padding: 40, fontFamily: 'Noto Sans Devanagari', fontSize: 14, lineHeight: 1.6, color: '#222' },
        coverTitle: { fontSize: 42, fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#e11d48' },
        coverSubtitle: { fontSize: 20, marginBottom: 40, textAlign: 'center', color: '#be123c' },
        coverAuthor: { fontSize: 16, marginTop: 80, textAlign: 'center', color: '#444' },
        sectionTitle: { fontSize: 28, fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold', marginBottom: 20, marginTop: 20, textAlign: 'center', color: '#e11d48' },
      });
    case 'story-book':
      return StyleSheet.create({
        page: { padding: 50, fontFamily: 'Noto Serif Devanagari', fontSize: 12, lineHeight: 1.6, color: '#000' },
        coverTitle: { fontSize: 40, fontFamily: 'Noto Serif Devanagari', fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase' },
        coverSubtitle: { fontSize: 18, marginBottom: 40, textAlign: 'center', color: '#444', fontStyle: 'italic' },
        coverAuthor: { fontSize: 14, marginTop: 100, textAlign: 'center', fontStyle: 'italic' },
        sectionTitle: { fontSize: 24, fontFamily: 'Noto Serif Devanagari', fontWeight: 'bold', marginBottom: 20, marginTop: 40, textAlign: 'center' },
      });
    default: // classic
      return StyleSheet.create({
        page: { padding: 50, fontFamily: 'Noto Sans Devanagari', fontSize: 12, lineHeight: 1.5 },
        coverTitle: { fontSize: 36, fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
        coverSubtitle: { fontSize: 18, marginBottom: 40, textAlign: 'center', color: '#666' },
        coverAuthor: { fontSize: 14, marginTop: 100, textAlign: 'center' },
        sectionTitle: { fontSize: 24, fontFamily: 'Noto Sans Devanagari', fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
      });
  }
};

export const MyDocument = ({ title, subtitle, author, sections, template }: PDFDocumentProps) => {
  const themeStyles = getThemeStyles(template);
  
  return (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={[styles.page, themeStyles.page]}>
      <View style={styles.coverPage}>
        <Text style={[styles.coverTitle, themeStyles.coverTitle]}>{title}</Text>
        {subtitle && <Text style={[styles.coverSubtitle, themeStyles.coverSubtitle]}>{subtitle}</Text>}
        <Text style={[styles.coverAuthor, themeStyles.coverAuthor]}>By {author || 'Unknown Author'}</Text>
      </View>
    </Page>

    {/* Table of Contents */}
    <Page size="A4" style={[styles.page, themeStyles.page]}>
      <Text style={styles.tocTitle}>Table of Contents</Text>
      {sections.filter(s => s.title).map((section, index) => (
        <View key={section.id} style={styles.tocItem}>
          <Text>{index + 1}. {section.title}</Text>
        </View>
      ))}
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>

    {/* Content Pages */}
    <Page size="A4" style={[styles.page, themeStyles.page]}>
      {sections.map((section, index) => {
        // Determine font family: use section specific if set, otherwise inherit from theme (undefined)
        let fontFamily = undefined;
        if (section.font && section.font !== 'default') {
             fontFamily = section.font === 'serif' ? 'Noto Serif Devanagari' :
                           section.font === 'handwriting' ? 'Kalam' :
                           section.font === 'cursive' ? 'Kalam' :
                           section.font === 'mono' ? 'Teko' : // Using Teko for mono/display-like or fallback to Courier if needed, but let's stick to registered fonts
                           'Noto Sans Devanagari';
             if (section.font === 'mono') fontFamily = 'Courier'; // Standard Courier for mono
        }
        
        const contentStyle = [styles.paragraph, fontFamily ? { fontFamily } : {}];

        return (
        <View key={section.id} break={index > 0 && section.type === 'story'}> 
          {/* Force break for new story sections if not first */}
          
          {section.title && (
            <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>
              {section.title}
            </Text>
          )}

          {/* Image Top Layout */}
          {(section.layout === 'image-top') && section.imageUrl && (
            <Image style={styles.image} src={section.imageUrl} />
          )}

          {section.type === 'story' && section.content && (
            <Text style={contentStyle}>{section.content}</Text>
          )}

          {/* Image Bottom Layout (Default for story if image exists but no layout specified, or explicit image-bottom) */}
          {((section.layout === 'image-bottom' || (!section.layout && section.type === 'story')) && section.imageUrl) && (
             <Image style={styles.image} src={section.imageUrl} />
          )}

          {/* Legacy Illustration Section Support */}
          {section.type === 'illustration' && section.imageUrl && !section.layout && (
            <Image style={styles.image} src={section.imageUrl} />
          )}

          {section.type === 'mcq' && section.data && (
            <View style={styles.quizContainer} wrap={false}>
               <Text style={styles.questionText}>Q: {(section.data as MCQData)?.question || ''}</Text>
               {(section.data as MCQData)?.options?.map((opt, i) => (
                   <Text key={i} style={styles.optionText}>
                       {String.fromCharCode(65 + i)}. {opt?.text || ''} {opt?.isCorrect ? '(Correct)' : ''}
                   </Text>
               ))}
               {(section.data as MCQData)?.explanation && (
                   <Text style={styles.explanationText}>Explanation: {(section.data as MCQData).explanation}</Text>
               )}
            </View>
          )}

          {section.type === 'true_false' && section.data && (
            <View style={styles.quizContainer} wrap={false}>
               <Text style={styles.questionText}>Statement: {(section.data as TrueFalseData)?.statement || ''}</Text>
               <Text style={styles.optionText}>Answer: {(section.data as TrueFalseData)?.isTrue ? 'True' : 'False'}</Text>
               {(section.data as TrueFalseData)?.explanation && (
                   <Text style={styles.explanationText}>Explanation: {(section.data as TrueFalseData).explanation}</Text>
               )}
            </View>
          )}

          {section.type === 'qa' && section.data && (
            <View style={styles.quizContainer} wrap={false}>
               <Text style={styles.questionText}>Q: {(section.data as QAData)?.question || ''}</Text>
               <Text style={styles.answerText}>A: {(section.data as QAData)?.answer || ''}</Text>
            </View>
          )}

          {section.type === 'fib' && section.data && (
            <View style={styles.quizContainer} wrap={false}>
               <Text style={styles.questionText}>Fill in the blank:</Text>
               <Text style={styles.paragraph}>{(section.data as FIBData)?.question || ''}</Text>
               <Text style={styles.answerText}>Answer: {(section.data as FIBData)?.answer || ''}</Text>
               {(section.data as FIBData)?.explanation && (
                   <Text style={styles.explanationText}>Explanation: {(section.data as FIBData).explanation}</Text>
               )}
            </View>
          )}

        </View>
      )})}
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
  );
};
