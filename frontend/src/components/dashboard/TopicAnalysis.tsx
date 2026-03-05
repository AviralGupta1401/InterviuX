import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DashboardStats } from '@/types';

interface TopicAnalysisProps {
  data: DashboardStats['topicScores'];
}

const COLORS = ['#f97316', '#a855f7', '#06b6d4', '#22c55e', '#eab308', '#ef4444'];

export function TopicAnalysis({ data }: TopicAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
          <XAxis type="number" stroke="#71717a" fontSize={12} domain={[0, 10]} />
          <YAxis 
            type="category" 
            dataKey="topic" 
            stroke="#71717a" 
            fontSize={12} 
            width={100}
            tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '12px',
              color: '#fafafa',
            }}
            labelStyle={{ color: '#a1a1aa' }}
          />
          <Bar dataKey="avgScore" radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
