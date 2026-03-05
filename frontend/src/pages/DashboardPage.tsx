import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Clock, TrendingUp, Award, ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ScoreChart, TopicAnalysis, DifficultyBreakdown } from '@/components/dashboard';
import { api } from '@/services/api';
import type { DashboardStats } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-orbs flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-textSecondary">Loading your progress...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-orbs flex flex-col items-center justify-center gap-4">
        <p className="text-error">{error || 'Something went wrong'}</p>
        <Button onClick={loadStats}>Try Again</Button>
      </div>
    );
  }

  const statCards = [
    {
      icon: BarChart3,
      label: 'Total Interviews',
      value: stats.totalInterviews,
      color: 'from-primary to-orange-500',
      textColor: 'text-primary',
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: stats.avgScore.toFixed(1),
      suffix: '/10',
      color: 'from-accent to-purple-500',
      textColor: 'text-accent',
    },
    {
      icon: Clock,
      label: 'Avg Duration',
      value: stats.avgDuration ? Math.round(stats.avgDuration / 60000) : 0,
      suffix: ' min',
      color: 'from-secondary to-cyan-500',
      textColor: 'text-secondary',
    },
    {
      icon: Award,
      label: 'Best Topic',
      value: stats.topicScores.length > 0 
        ? stats.topicScores.reduce((a, b) => a.avgScore > b.avgScore ? a : b).topic 
        : 'N/A',
      color: 'from-success to-green-500',
      textColor: 'text-success',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-orbs">
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back Home
            </Button>
          </nav>
        </div>
      </motion.header>

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Your Progress</h1>
            <p className="text-textSecondary mt-1">Track your interview performance</p>
          </div>
          <Button onClick={() => navigate('/')}>
            Start New Interview
          </Button>
        </motion.div>

        {stats.totalInterviews === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 rounded-full bg-surface border border-white/10 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-textMuted" />
            </div>
            <h2 className="text-2xl font-semibold text-textPrimary mb-3">No interviews yet</h2>
            <p className="text-textSecondary mb-8 max-w-md mx-auto">Start your first practice interview to begin tracking your progress and improving your skills.</p>
            <Button onClick={() => navigate('/')} size="lg">
              Start Your First Interview
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card className="glass-hover">
                    <CardContent className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-textMuted text-sm">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.textColor}`}>
                          {stat.value}
                          {stat.suffix && <span className="text-textMuted text-sm font-normal">{stat.suffix}</span>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Score Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScoreChart data={stats.recentSessions} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TopicAnalysis data={stats.topicScores} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DifficultyBreakdown data={stats.difficultyScores} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.recentSessions.slice(0, 5).map((session, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-surfaceElevated border border-white/5"
                        >
                          <div>
                            <p className="text-textPrimary font-medium">{session.topic}</p>
                            <p className="text-textMuted text-sm">{session.difficulty}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{session.score.toFixed(1)}</p>
                            <p className="text-textMuted text-xs">/10</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
