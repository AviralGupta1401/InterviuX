import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Clock, Target, Lightbulb, Home, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function SessionSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { summary, overallScore, duration } = location.state || {};

  if (!summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-textSecondary">No session data found</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-error';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 8) return 'Excellent performance!';
    if (score >= 6) return 'Good job! Keep practicing.';
    return 'Room for improvement. Try again!';
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-4">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-textPrimary mb-2">Interview Complete!</h1>
          <p className="text-textSecondary">{getScoreMessage(overallScore)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardContent className="text-center py-6">
              <Award className={`w-8 h-8 mx-auto mb-2 ${getScoreColor(overallScore)}`} />
              <p className="text-4xl font-bold text-textPrimary">{overallScore.toFixed(1)}</p>
              <p className="text-textMuted text-sm">Overall Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center py-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-4xl font-bold text-textPrimary">{formatDuration(duration)}</p>
              <p className="text-textMuted text-sm">Duration</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center py-6">
              <Target className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-4xl font-bold text-textPrimary">
                {summary.split('\n').filter((l: string) => l.includes('Strengths') || l.includes('Improvement')).length}
              </p>
              <p className="text-textMuted text-sm">Key Insights</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Interview Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                {summary.split('\n').map((line: string, index: number) => {
                  if (line.includes('Overall') || line.includes('strengths') || line.includes('Strengths') || 
                      line.includes('Improvement') || line.includes('improvement') || line.includes('Recommendations') ||
                      line.includes('recommendations') || line.includes('Topics') || line.includes('topics') ||
                      line.includes('Focus') || line.includes('focus')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-textPrimary mt-4 mb-2">
                        {line.replace(/^[0-9]+\.\s*/, '')}
                      </h3>
                    );
                  }
                  if (line.trim()) {
                    return (
                      <p key={index} className="text-textSecondary mb-2">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Practice Again
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
