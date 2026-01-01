import { AttendanceStats } from '@/types/attendance';
import { Users, CheckCircle, XCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: AttendanceStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Present',
      value: stats.totalPresent,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Total Absent',
      value: stats.totalAbsent,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Total Leave',
      value: stats.totalLeave,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Attendance Rate',
      value: `${stats.averageAttendance.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Fees Paid',
      value: `${stats.feesPaidCount}/${stats.feesPaidCount + stats.feesUnpaidCount}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => (
        <div
          key={item.label}
          className="stat-card bg-card border border-border/50 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center mb-3`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
          <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
};
