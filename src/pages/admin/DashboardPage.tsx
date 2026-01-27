import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, Clock, CheckCircle2, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { getStatistics } from '@/api/adminApi';
import { toast } from 'sonner';

interface Statistics {
  totalCustomers: number;
  totalAdmins: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  inProgressEnquiries: number;
  completedEnquiries: number;
  cancelledEnquiries: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data } = await getStatistics();
      setStats(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Pending',
      value: stats.pendingEnquiries,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgressEnquiries,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Completed',
      value: stats.completedEnquiries,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Cancelled',
      value: stats.cancelledEnquiries,
      icon: AlertCircle,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Matching Home Page Style */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          <Zap size={14} className="text-indigo-600 fill-indigo-600" />
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Dashboard Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
          Business <span className="text-slate-400">Performance</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
          Monitor your business performance and track all key metrics at a glance.
        </p>
      </div>

      {/* Statistics Grid - Reduced Size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${card.color}`}></div>
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {card.title}
                </h3>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards - Reduced Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-600/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:bg-indigo-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Users size={24} strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-90">
              Total Admins
            </h3>
            <p className="text-3xl sm:text-4xl font-black mb-2">{stats.totalAdmins}</p>
            <p className="text-sm opacity-80">Active administrators</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 hover:shadow-xl transition-all duration-500">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Enquiry Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Pending</span>
              <span className="text-xl font-black text-slate-900">{stats.pendingEnquiries}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">In Progress</span>
              <span className="text-xl font-black text-slate-900">{stats.inProgressEnquiries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Completed</span>
              <span className="text-xl font-black text-slate-900">{stats.completedEnquiries}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
