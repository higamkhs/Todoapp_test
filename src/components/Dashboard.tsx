import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { todos, getOverdueTodos, getTodosCompletedToday } = useTodoStore();

  const stats = React.useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const overdue = getOverdueTodos().length;
    const completedToday = getTodosCompletedToday().length;
    
    const today = new Date();
    const dueToday = todos.filter(todo => 
      todo.dueDate && isToday(todo.dueDate) && !todo.completed
    ).length;
    
    const dueTomorrow = todos.filter(todo => 
      todo.dueDate && isTomorrow(todo.dueDate) && !todo.completed
    ).length;
    
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const thisWeekCompleted = todos.filter(todo => 
      todo.completed && 
      todo.updatedAt >= thisWeekStart && 
      todo.updatedAt <= thisWeekEnd
    ).length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      total,
      completed,
      active,
      overdue,
      completedToday,
      dueToday,
      dueTomorrow,
      thisWeekCompleted,
      completionRate
    };
  }, [todos, getOverdueTodos, getTodosCompletedToday]);

  const priorityStats = React.useMemo(() => {
    const high = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;
    const medium = todos.filter(todo => todo.priority === 'medium' && !todo.completed).length;
    const low = todos.filter(todo => todo.priority === 'low' && !todo.completed).length;
    
    return { high, medium, low };
  }, [todos]);

  const upcomingTasks = React.useMemo(() => {
    return todos
      .filter(todo => !todo.completed && todo.dueDate)
      .sort((a, b) => {
        const aTime = a.dueDate ? a.dueDate.getTime() : Infinity;
        const bTime = b.dueDate ? b.dueDate.getTime() : Infinity;
        return aTime - bTime;
      })
      .slice(0, 5);
  }, [todos]);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 size={18} />
          統計
        </h3>
        
        <StatCard
          title="完了率"
          value={Math.round(stats.completionRate)}
          icon={<TrendingUp className="text-white" size={20} />}
          color="bg-green-500"
          subtitle={`${stats.completed}/${stats.total} 完了`}
        />
        
        <StatCard
          title="アクティブタスク"
          value={stats.active}
          icon={<Clock className="text-white" size={20} />}
          color="bg-blue-500"
        />
        
        <StatCard
          title="今日完了"
          value={stats.completedToday}
          icon={<CheckCircle2 className="text-white" size={20} />}
          color="bg-green-500"
        />
        
        {stats.overdue > 0 && (
          <StatCard
            title="期限切れ"
            value={stats.overdue}
            icon={<AlertCircle className="text-white" size={20} />}
            color="bg-red-500"
          />
        )}
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <h4 className="font-semibold text-gray-800 mb-3">優先度別</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              高
            </span>
            <span className="text-sm font-medium">{priorityStats.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              中
            </span>
            <span className="text-sm font-medium">{priorityStats.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              低
            </span>
            <span className="text-sm font-medium">{priorityStats.low}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={16} />
          今後の予定
        </h4>
        
        {upcomingTasks.length > 0 ? (
          <div className="space-y-2">
            {upcomingTasks.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {todo.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {todo.dueDate && format(todo.dueDate, 'M月d日 (E)', { locale: ja })}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  todo.priority === 'high' ? 'bg-red-500' :
                  todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            予定されたタスクはありません
          </p>
        )}
      </div>

      {/* This Week Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <h4 className="font-semibold text-gray-800 mb-3">今週の実績</h4>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 mb-1">
            {stats.thisWeekCompleted}
          </p>
          <p className="text-sm text-gray-600">タスク完了</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
        <h4 className="font-semibold text-gray-800 mb-3">今日のタスク</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">今日期限</span>
            <span className="text-sm font-medium text-orange-600">{stats.dueToday}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">明日期限</span>
            <span className="text-sm font-medium text-blue-600">{stats.dueTomorrow}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;