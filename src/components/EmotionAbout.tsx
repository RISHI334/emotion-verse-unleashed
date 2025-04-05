
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lightbulb, Brain, Sparkles } from 'lucide-react';

const EmotionAbout = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">About Emotion-Verse</h1>
        <p className="text-muted-foreground">Understand how our emotion detection technology works</p>
      </div>

      <Card className="emotion-card">
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-gradient-emotion flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <CardTitle className="text-2xl">Welcome to Emotion-Verse</CardTitle>
          <CardDescription>
            Explore the universe of human emotions through advanced text analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Emotion-Verse is an innovative platform designed to detect and analyze emotions in text. 
            Whether you're exploring your own feelings, analyzing communication patterns, or 
            just curious about the emotional content of different texts, our technology 
            provides insights into the complex world of human emotions.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="how-it-works">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="how-it-works">
            <Brain className="h-4 w-4 mr-2" />
            How It Works
          </TabsTrigger>
          <TabsTrigger value="emotions">
            <Sparkles className="h-4 w-4 mr-2" />
            Emotions
          </TabsTrigger>
          <TabsTrigger value="use-cases">
            <Lightbulb className="h-4 w-4 mr-2" />
            Use Cases
          </TabsTrigger>
          <TabsTrigger value="limitations">
            <AlertCircle className="h-4 w-4 mr-2" />
            Limitations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="how-it-works" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>How Emotion Detection Works</CardTitle>
              <CardDescription>The science behind our emotion analysis technology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Natural Language Processing</h3>
                <p>
                  Our emotion detection system uses advanced Natural Language Processing (NLP) 
                  techniques to analyze the semantic and contextual meaning of text. The process 
                  involves tokenization, part-of-speech tagging, and dependency parsing to 
                  understand the structure and meaning of sentences.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Machine Learning Models</h3>
                <p>
                  We utilize trained machine learning models that have learned from millions of 
                  labeled examples to recognize emotional patterns in text. These models consider 
                  not just individual words, but phrases, context, and linguistic patterns that 
                  indicate different emotional states.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Emotion Classification</h3>
                <p>
                  The system analyzes your text and classifies it across multiple emotion categories, 
                  providing probability scores for each emotion. This helps you understand not just 
                  the dominant emotion, but the complex emotional landscape of the text.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Continuous Learning</h3>
                <p>
                  Our models continue to improve over time as they process more text and receive 
                  feedback, allowing for more accurate and nuanced emotion detection.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emotions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Emotions</CardTitle>
              <CardDescription>The spectrum of emotions we detect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-joy flex items-center justify-center">
                      <span className="text-white text-lg">😊</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Joy</h3>
                      <p className="text-sm text-muted-foreground">Feelings of happiness, pleasure, and satisfaction</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-sadness flex items-center justify-center">
                      <span className="text-white text-lg">😔</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Sadness</h3>
                      <p className="text-sm text-muted-foreground">Expressions of sorrow, disappointment, and grief</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-anger flex items-center justify-center">
                      <span className="text-white text-lg">😠</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Anger</h3>
                      <p className="text-sm text-muted-foreground">Feelings of annoyance, hostility, and rage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-fear flex items-center justify-center">
                      <span className="text-white text-lg">😨</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Fear</h3>
                      <p className="text-sm text-muted-foreground">Expressions of worry, anxiety, and terror</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-surprise flex items-center justify-center">
                      <span className="text-white text-lg">😮</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Surprise</h3>
                      <p className="text-sm text-muted-foreground">Sudden feelings of wonder or amazement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-disgust flex items-center justify-center">
                      <span className="text-white text-lg">🤢</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Disgust</h3>
                      <p className="text-sm text-muted-foreground">Feelings of revulsion or strong disapproval</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emotion-neutral flex items-center justify-center">
                      <span className="text-white text-lg">😐</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Neutral</h3>
                      <p className="text-sm text-muted-foreground">Absence of strong emotion or balanced emotional state</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="use-cases" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>How emotion detection can be useful</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Personal Insights</h3>
                <p>
                  Gain awareness of your emotional patterns in written communication, 
                  journal entries, or social media posts. Track emotional changes over time 
                  to better understand your mental health patterns.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Communication Analysis</h3>
                <p>
                  Analyze emails, messages, or other communication to ensure the emotional 
                  tone aligns with your intentions. Understand how your words might be perceived 
                  by others.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Content Creation</h3>
                <p>
                  For writers, marketers, and content creators, understand the emotional impact 
                  of your content to ensure it evokes the intended response from your audience.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Research & Analysis</h3>
                <p>
                  Researchers can analyze text data at scale to identify emotional patterns 
                  in feedback, reviews, or other text sources.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="limitations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Limitations</CardTitle>
              <CardDescription>Understanding the boundaries of our technology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Context Sensitivity</h3>
                <p>
                  Emotion detection may miss subtle contextual cues that humans naturally understand, 
                  such as sarcasm, cultural references, or industry-specific language.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Ambiguity</h3>
                <p>
                  Some texts can express multiple emotions simultaneously or contain emotional 
                  ambiguity that's difficult for algorithms to disambiguate accurately.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Cultural Differences</h3>
                <p>
                  Emotional expression varies across cultures, and our models may not fully 
                  account for these differences in how emotions are expressed in text.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Not a Diagnostic Tool</h3>
                <p>
                  Emotion-Verse is not intended to diagnose or treat any mental health conditions. 
                  It's an exploratory tool for understanding emotional content in text, not a 
                  replacement for professional mental health services.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionAbout;
