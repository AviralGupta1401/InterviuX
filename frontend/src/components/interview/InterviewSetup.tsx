import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Role, Topic, Difficulty } from '@/types';

interface InterviewSetupProps {
  onStart: (config: { role: Role; topic: Topic; difficulty: Difficulty }) => void;
  isLoading?: boolean;
}

const roleOptions = [
  { value: 'SDE', label: 'SDE (Software Development Engineer)' },
  { value: 'Frontend', label: 'Frontend Developer' },
  { value: 'Backend', label: 'Backend Developer' },
  { value: 'Full-Stack', label: 'Full-Stack Developer' },
];

const topicOptions = [
  { value: 'DSA', label: 'DSA (Data Structures & Algorithms)' },
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

export function InterviewSetup({ onStart, isLoading }: InterviewSetupProps) {
  const [role, setRole] = useState<Role>('SDE');
  const [topic, setTopic] = useState<Topic>('DSA');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ role, topic, difficulty });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto"
    >
      <Card variant="glass" className="gradient-border">
        <CardHeader>
          <CardTitle className="text-2xl">Start Your Interview</CardTitle>
          <CardDescription>
            Configure your mock interview session with AI-powered feedback
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Select
                label="Select Role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                options={roleOptions}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Select
                label="Select Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                options={topicOptions}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Select
                label="Select Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                options={difficultyOptions}
              />
            </motion.div>

            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Interview'}
              </Button>
            </motion.div>
          </CardContent>
        </form>
      </Card>
    </motion.div>
  );
}
