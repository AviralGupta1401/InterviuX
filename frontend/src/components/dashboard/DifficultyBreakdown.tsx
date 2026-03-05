import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { DashboardStats } from '@/types';

interface DifficultyBreakdownProps {
  data: DashboardStats['difficultyScores'];
}

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export function DifficultyBreakdown({ data }: DifficultyBreakdownProps) {
  const chartData = data.map(item => ({
    name: item.difficulty,
    value: item.count,
    avgScore: item.avgScore,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '12px',
              color: '#fafafa',
            }}
          />
          <Legend
            formatter={(value) => <span className="text-textSecondary text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
