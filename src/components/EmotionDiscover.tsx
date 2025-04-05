
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Quote, MessageSquare, RefreshCw } from 'lucide-react';

// Famous quotes with emotion data
const quotes = [
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    emotion: "joy",
    emotionScore: 0.85
  },
  {
    text: "Not how long, but how well you have lived is the main thing.",
    author: "Seneca",
    emotion: "neutral",
    emotionScore: 0.72
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    emotion: "surprise",
    emotionScore: 0.68
  },
  {
    text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
    author: "Bruce Lee",
    emotion: "fear",
    emotionScore: 0.64
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    emotion: "joy",
    emotionScore: 0.78
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    emotion: "neutral",
    emotionScore: 0.62
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    emotion: "sadness",
    emotionScore: 0.59
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    emotion: "joy",
    emotionScore: 0.88
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    emotion: "sadness",
    emotionScore: 0.75
  },
  {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    emotion: "surprise",
    emotionScore: 0.73
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    emotion: "joy",
    emotionScore: 0.91
  },
  {
    text: "In the end, it's not the years in your life that count. It's the life in your years.",
    author: "Abraham Lincoln",
    emotion: "neutral",
    emotionScore: 0.67
  }
];

// Sample movie quotes
const movieQuotes = [
  {
    text: "May the Force be with you.",
    source: "Star Wars",
    emotion: "neutral",
    emotionScore: 0.65
  },
  {
    text: "There's no place like home.",
    source: "The Wizard of Oz",
    emotion: "joy",
    emotionScore: 0.78
  },
  {
    text: "I'm going to make him an offer he can't refuse.",
    source: "The Godfather",
    emotion: "anger",
    emotionScore: 0.82
  },
  {
    text: "You're gonna need a bigger boat.",
    source: "Jaws",
    emotion: "fear",
    emotionScore: 0.88
  },
  {
    text: "Life is like a box of chocolates, you never know what you're gonna get.",
    source: "Forrest Gump",
    emotion: "surprise",
    emotionScore: 0.72
  },
  {
    text: "I feel the need... the need for speed!",
    source: "Top Gun",
    emotion: "joy",
    emotionScore: 0.85
  },
  {
    text: "Houston, we have a problem.",
    source: "Apollo 13",
    emotion: "fear",
    emotionScore: 0.79
  },
  {
    text: "I'll be back.",
    source: "The Terminator",
    emotion: "neutral",
    emotionScore: 0.62
  }
];

// Sample song lyrics
const songLyrics = [
  {
    text: "Don't stop believin', hold on to that feelin'",
    artist: "Journey",
    emotion: "joy",
    emotionScore: 0.86
  },
  {
    text: "Hello, it's me. I was wondering if after all these years you'd like to meet.",
    artist: "Adele",
    emotion: "sadness",
    emotionScore: 0.82
  },
  {
    text: "I will always love you.",
    artist: "Whitney Houston",
    emotion: "joy",
    emotionScore: 0.91
  },
  {
    text: "Wake me up when September ends.",
    artist: "Green Day",
    emotion: "sadness",
    emotionScore: 0.84
  },
  {
    text: "I can't get no satisfaction.",
    artist: "The Rolling Stones",
    emotion: "anger",
    emotionScore: 0.77
  },
  {
    text: "Every little thing is gonna be alright.",
    artist: "Bob Marley",
    emotion: "joy",
    emotionScore: 0.89
  }
];

// Interface for quote/lyric types
interface QuoteItem {
  text: string;
  author?: string;
  source?: string;
  artist?: string;
  emotion: string;
  emotionScore: number;
}

const EmotionDiscover = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [displayedQuotes, setDisplayedQuotes] = useState<QuoteItem[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<QuoteItem[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<QuoteItem[]>([]);

  useEffect(() => {
    shuffleItems();
  }, [selectedEmotion]);

  const shuffleItems = () => {
    // Filter by selected emotion if applicable
    let filteredQuotes = selectedEmotion 
      ? quotes.filter(q => q.emotion === selectedEmotion)
      : quotes;
    
    let filteredMovies = selectedEmotion 
      ? movieQuotes.filter(q => q.emotion === selectedEmotion)
      : movieQuotes;
    
    let filteredSongs = selectedEmotion 
      ? songLyrics.filter(q => q.emotion === selectedEmotion)
      : songLyrics;
    
    // Shuffle and set displayed items
    setDisplayedQuotes([...filteredQuotes].sort(() => Math.random() - 0.5).slice(0, 4));
    setDisplayedMovies([...filteredMovies].sort(() => Math.random() - 0.5).slice(0, 3));
    setDisplayedSongs([...filteredSongs].sort(() => Math.random() - 0.5).slice(0, 3));
  };

  const emotionFilters = [
    { value: "joy", label: "Joy", color: "bg-emotion-joy" },
    { value: "sadness", label: "Sadness", color: "bg-emotion-sadness" },
    { value: "anger", label: "Anger", color: "bg-emotion-anger" },
    { value: "fear", label: "Fear", color: "bg-emotion-fear" },
    { value: "surprise", label: "Surprise", color: "bg-emotion-surprise" },
    { value: "neutral", label: "Neutral", color: "bg-emotion-neutral" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discover Emotions</h1>
          <p className="text-muted-foreground">Explore emotional patterns in quotes, movies, and songs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedEmotion && (
            <Button variant="outline" onClick={() => setSelectedEmotion(null)}>
              Clear Filter
            </Button>
          )}
          <Button onClick={shuffleItems}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {emotionFilters.map((emotion) => (
          <Badge 
            key={emotion.value}
            className={`cursor-pointer ${
              selectedEmotion === emotion.value 
                ? emotion.color + ' text-white' 
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            onClick={() => setSelectedEmotion(
              selectedEmotion === emotion.value ? null : emotion.value
            )}
          >
            {emotion.label}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotes">
            <BookOpen className="h-4 w-4 mr-2" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="movies">
            <MessageSquare className="h-4 w-4 mr-2" />
            Movies
          </TabsTrigger>
          <TabsTrigger value="songs">
            <Quote className="h-4 w-4 mr-2" />
            Songs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes" className="mt-4 space-y-4">
          {displayedQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedQuotes.map((quote, index) => (
                <Card key={index} className="emotion-card hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{quote.author}</CardTitle>
                      <Badge className={`bg-emotion-${quote.emotion}`}>
                        {quote.emotion}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic">
                      "{quote.text}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p>No quotes found for this emotion.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="movies" className="mt-4 space-y-4">
          {displayedMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedMovies.map((quote, index) => (
                <Card key={index} className="emotion-card hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{quote.source}</CardTitle>
                      <Badge className={`bg-emotion-${quote.emotion}`}>
                        {quote.emotion}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic">
                      "{quote.text}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p>No movie quotes found for this emotion.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="songs" className="mt-4 space-y-4">
          {displayedSongs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedSongs.map((lyric, index) => (
                <Card key={index} className="emotion-card hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lyric.artist}</CardTitle>
                      <Badge className={`bg-emotion-${lyric.emotion}`}>
                        {lyric.emotion}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic">
                      "{lyric.text}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p>No song lyrics found for this emotion.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Express Yourself</CardTitle>
          <CardDescription>Ready to analyze your own text?</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <a href="/">Try Emotion Detection</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionDiscover;
