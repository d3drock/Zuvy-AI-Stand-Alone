'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';

interface TopicData {
  topic: string;
  accuracy: number;
  questionsAnswered: number;
  averageDifficulty: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopicPerformanceChartProps {
  data: TopicData[];
}

export function TopicPerformanceChart({ data }: TopicPerformanceChartProps) {
  // Prepare data for chart
  const chartData = data.map((item) => ({
    name: item.topic,
    Accuracy: item.accuracy,
    'Avg Difficulty': item.averageDifficulty * 10, // Scale to 0-100 for better visualization
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-body2 mb-2">{payload[0].payload.name}</p>
          <p className="text-body2 text-success">
            Accuracy: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-body2 text-primary">
            Avg Difficulty: {(payload[1].value / 10).toFixed(1)}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-body1 font-semibold">Topic Performance</h3>
          <p className="text-body2 text-muted-foreground">
            Accuracy and difficulty by topic
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Bar dataKey="Accuracy" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
            <Bar
              dataKey="Avg Difficulty"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Details */}
      <div className="space-y-3">
        {data.map((topic) => (
          <div
            key={topic.topic}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-body2">{topic.topic}</span>
                <Badge variant="outline" className="text-xs">
                  {topic.questionsAnswered} questions
                </Badge>
                {topic.trend !== 'stable' && (
                  <div className="flex items-center gap-1">
                    {topic.trend === 'up' ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">Improving</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-destructive">Needs work</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-body2 font-semibold text-success">
                  {topic.accuracy.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Difficulty</p>
                <p className="text-body2 font-semibold text-primary">
                  {topic.averageDifficulty.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
