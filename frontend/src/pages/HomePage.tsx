import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Brain, BarChart3, Sparkles, Target, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { api } from '@/services/api';
import type { Role, Topic, Difficulty } from '@/types';

export function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalInterviews: 0, avgScore: 0 });
  const [isStarting, setIsStarting] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [role, setRole] = useState<Role>('SDE');
  const [topic, setTopic] = useState<Topic>('DSA');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  useEffect(() => {
    api.getDashboardStats()
      .then(data => {
        setStats({
          totalInterviews: data.totalInterviews,
          avgScore: data.avgScore,
        });
      })
      .catch(() => {});
  }, []);

  const handleStartInterview = async () => {
    setIsStarting(true);
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, topic, difficulty }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        navigate(`/interview/${result.data.sessionId}`, { 
          state: { config: { role, topic, difficulty }, question: result.data.question } 
        });
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const roleOptions = [
    { value: 'SDE', label: 'SDE - Software Engineer' },
    { value: 'Frontend', label: 'Frontend Developer' },
    { value: 'Backend', label: 'Backend Developer' },
    { value: 'Full-Stack', label: 'Full-Stack Developer' },
  ];

  const topicOptions = [
    { value: 'DSA', label: 'Data Structures & Algorithms' },
    { value: 'System Design', label: 'System Design' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Behavioral', label: 'Behavioral' },
  ];

  const difficultyOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ];

  return (
    <div className="min-h-screen bg-gradient-orbs noise-overlay">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-textPrimary">InterviewLab</span>
          </motion.div>
          
          <nav className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-textSecondary">AI-Powered Interview Prep</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-textPrimary">Master Your</span>
              <br />
              <span className="gradient-text">Dream Interview</span>
            </h1>
            
            <p className="text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice with AI-powered voice interviews. Get real-time feedback, 
              track your progress, and ace your next technical interview.
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSetup(true)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-semibold text-lg flex items-center gap-2 glow-primary-hover"
              >
                Start Practicing
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
                View Progress
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          {stats.totalInterviews > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 flex items-center justify-center gap-8"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.totalInterviews}</p>
                <p className="text-textMuted text-sm">Interviews</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{stats.avgScore.toFixed(1)}</p>
                <p className="text-textMuted text-sm">Avg Score</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Mic, title: 'Voice Practice', description: 'Speak naturally with AI interviewer using voice input & output', color: 'from-primary to-orange-500' },
              { icon: Target, title: 'Real-time Feedback', description: 'Get instant scoring on technical accuracy, communication, depth', color: 'from-accent to-purple-500' },
              { icon: Trophy, title: 'Track Progress', description: 'Monitor improvement over time with detailed analytics', color: 'from-secondary to-cyan-500' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-hover h-full">
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-2">{feature.title}</h3>
                    <p className="text-textSecondary">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowSetup(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md"
            >
              <Card className="gradient-border p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-textPrimary mb-2">Configure Interview</h2>
                  <p className="text-textSecondary">Select your practice parameters</p>
                </div>

                <div className="space-y-5">
                  <Select
                    label="Your Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    options={roleOptions}
                  />
                  <Select
                    label="Focus Area"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as Topic)}
                    options={topicOptions}
                  />
                  <Select
                    label="Difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    options={difficultyOptions}
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowSetup(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleStartInterview}
                    isLoading={isStarting}
                  >
                    Begin Interview
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
