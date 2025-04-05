
import Navbar from "@/components/Navbar";
import EmotionDetector from "@/components/EmotionDetector";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 emotion-gradient-text">
            Welcome to Emotion-Verse
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the emotions behind your words with our advanced text analysis technology
          </p>
        </div>

        <EmotionDetector />
      </main>
      <footer className="bg-secondary/50 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Emotion-Verse &copy; 2025 | Sentiment Analysis & Emotion Detection
        </p>
      </footer>
    </div>
  );
};

export default Index;
