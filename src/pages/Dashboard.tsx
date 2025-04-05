
import Navbar from "@/components/Navbar";
import EmotionDashboard from "@/components/EmotionDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <EmotionDashboard />
      </main>
      <footer className="bg-secondary/50 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Emotion-Verse &copy; 2025 | Sentiment Analysis & Emotion Detection
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
