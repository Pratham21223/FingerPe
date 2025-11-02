import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiArrowUpRight, FiArrowDownLeft, FiFilter, FiDownload, FiChevronRight } from 'react-icons/fi';
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import ParticleBackground from './ParticleBackground';

const TransactionDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timePeriod, setTimePeriod] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Hardcoded transaction history
  const transactions = [
    { id: 1, type: 'sent', name: 'John Doe', amount: 500, date: '2025-11-02', month: 'Nov', day: 2, time: '14:30', category: 'personal', status: 'completed' },
    { id: 2, type: 'received', name: 'Sarah Smith', amount: 2000, date: '2025-11-01', month: 'Nov', day: 1, time: '10:15', category: 'work', status: 'completed' },
    { id: 3, type: 'sent', name: 'Pizza Hub', amount: 350, date: '2025-11-01', month: 'Nov', day: 1, time: '19:45', category: 'food', status: 'completed' },
    { id: 4, type: 'received', name: 'Mom', amount: 1500, date: '2025-10-31', month: 'Oct', day: 31, time: '09:00', category: 'family', status: 'completed' },
    { id: 5, type: 'sent', name: 'Electricity Bill', amount: 1200, date: '2025-10-30', month: 'Oct', day: 30, time: '15:22', category: 'utilities', status: 'completed' },
    { id: 6, type: 'sent', name: 'Gym Membership', amount: 800, date: '2025-10-29', month: 'Oct', day: 29, time: '11:30', category: 'health', status: 'completed' },
    { id: 7, type: 'received', name: 'Freelance Project', amount: 5000, date: '2025-10-28', month: 'Oct', day: 28, time: '16:45', category: 'income', status: 'completed' },
    { id: 8, type: 'sent', name: 'Movie Tickets', amount: 600, date: '2025-10-27', month: 'Oct', day: 27, time: '18:00', category: 'entertainment', status: 'completed' },
    { id: 9, type: 'sent', name: 'Uber', amount: 250, date: '2025-10-26', month: 'Oct', day: 26, time: '20:15', category: 'travel', status: 'completed' },
    { id: 10, type: 'received', name: 'Bonus', amount: 10000, date: '2025-10-25', month: 'Oct', day: 25, time: '14:00', category: 'income', status: 'completed' },
    { id: 11, type: 'sent', name: 'Restaurant', amount: 750, date: '2025-10-24', month: 'Oct', day: 24, time: '19:30', category: 'food', status: 'completed' },
    { id: 12, type: 'sent', name: 'Groceries', amount: 450, date: '2025-10-23', month: 'Oct', day: 23, time: '11:00', category: 'groceries', status: 'completed' },
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (selectedFilter !== 'all' && t.type !== selectedFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      return true;
    });
  }, [selectedFilter, categoryFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const sent = filteredTransactions.filter(t => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0);
    const received = filteredTransactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0);
    return {
      totalSent: sent,
      totalReceived: received,
      netBalance: received - sent,
      avgTransaction: Math.round((sent + received) / filteredTransactions.length) || 0,
      totalTransactions: filteredTransactions.length
    };
  }, [filteredTransactions]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const breakdown = {};
    filteredTransactions.forEach(t => {
      if (t.type === 'sent') {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // Time-based trends
  const trendData = useMemo(() => {
    const trends = {};
    filteredTransactions.forEach(t => {
      const key = `${t.month} ${t.day}`;
      if (!trends[key]) {
        trends[key] = { date: key, income: 0, expense: 0 };
      }
      if (t.type === 'sent') {
        trends[key].expense += t.amount;
      } else {
        trends[key].income += t.amount;
      }
    });
    return Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredTransactions]);

  // Category totals for bar chart
  const categoryTotals = useMemo(() => {
    const totals = {};
    filteredTransactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Colors for charts
  const COLORS = ['#00D4FF', '#00F9FF', '#5B21B6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];
  const categoryColors = {
    personal: '#3B82F6',
    work: '#8B5CF6',
    food: '#F97316',
    family: '#EC4899',
    utilities: '#EAB308',
    health: '#10B981',
    income: '#06B6D4',
    entertainment: '#EF4444',
    travel: '#6366F1',
    groceries: '#84CC16'
  };

  const getCategoryColor = (category) => {
    const colors = {
      personal: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      work: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      food: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      family: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      utilities: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      health: 'from-green-500/20 to-green-600/20 border-green-500/30',
      income: 'from-accent-cyan/20 to-accent-blue/20 border-accent-cyan/30',
      entertainment: 'from-red-500/20 to-red-600/20 border-red-500/30',
      travel: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
      groceries: 'from-lime-500/20 to-lime-600/20 border-lime-500/30'
    };
    return colors[category] || colors.personal;
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto p-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-grotesk text-4xl font-bold text-white mb-2">Financial Dashboard</h1>
          <p className="font-rajdhani text-white/50">Comprehensive view of your spending and income patterns</p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Received */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <FiArrowDownLeft className="text-green-400" size={24} />
              </div>
              <span className="font-rajdhani text-xs text-white/50 uppercase">Income</span>
            </div>
            <p className="font-orbitron text-2xl font-bold text-green-400 mb-1">₹{stats.totalReceived.toLocaleString()}</p>
            <p className="font-rajdhani text-xs text-white/40">{filteredTransactions.filter(t => t.type === 'received').length} received</p>
          </motion.div>

          {/* Total Sent */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <FiArrowUpRight className="text-red-400" size={24} />
              </div>
              <span className="font-rajdhani text-xs text-white/50 uppercase">Spent</span>
            </div>
            <p className="font-orbitron text-2xl font-bold text-red-400 mb-1">₹{stats.totalSent.toLocaleString()}</p>
            <p className="font-rajdhani text-xs text-white/40">{filteredTransactions.filter(t => t.type === 'sent').length} sent</p>
          </motion.div>

          {/* Net Balance */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`liquid-glass rounded-2xl p-6 border ${stats.netBalance >= 0 ? 'border-accent-cyan/20' : 'border-red-500/20'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${stats.netBalance >= 0 ? 'bg-accent-cyan/20 border-accent-cyan/30' : 'bg-red-500/20 border-red-500/30'}`}>
                {stats.netBalance >= 0 ? <FiTrendingUp className="text-accent-cyan" size={24} /> : <FiTrendingDown className="text-red-400" size={24} />}
              </div>
              <span className="font-rajdhani text-xs text-white/50 uppercase">Net</span>
            </div>
            <p className={`font-orbitron text-2xl font-bold mb-1 ${stats.netBalance >= 0 ? 'text-accent-cyan' : 'text-red-400'}`}>
              ₹{Math.abs(stats.netBalance).toLocaleString()}
            </p>
            <p className="font-rajdhani text-xs text-white/40">{stats.netBalance >= 0 ? 'Positive' : 'Deficit'}</p>
          </motion.div>

          {/* Average Transaction */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
                <span className="font-orbitron font-bold text-accent-blue">Ø</span>
              </div>
              <span className="font-rajdhani text-xs text-white/50 uppercase">Avg</span>
            </div>
            <p className="font-orbitron text-2xl font-bold text-accent-blue mb-1">₹{stats.avgTransaction.toLocaleString()}</p>
            <p className="font-rajdhani text-xs text-white/40">Per transaction</p>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex gap-3 flex-wrap">
            <span className="font-rajdhani text-xs text-white/50 uppercase mt-2">Filter:</span>
            {['all', 'sent', 'received'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter)}
                className={`liquid-button rounded-lg px-4 py-2 font-rajdhani text-sm uppercase transition-all ${
                  selectedFilter === filter
                    ? 'bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white/90'
                }`}
              >
                {filter === 'all' ? '📊 All' : filter === 'sent' ? '📤 Sent' : '📥 Received'}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <span className="font-rajdhani text-xs text-white/50 uppercase mt-2">Category:</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryFilter('all')}
              className={`liquid-button rounded-lg px-4 py-2 font-rajdhani text-sm uppercase transition-all ${
                categoryFilter === 'all'
                  ? 'bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white/90'
              }`}
            >
              All
            </motion.button>
            {['personal', 'work', 'food', 'utilities', 'health', 'entertainment', 'travel', 'income'].map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryFilter(cat)}
                className={`liquid-button rounded-lg px-4 py-2 font-rajdhani text-sm uppercase transition-all ${
                  categoryFilter === cat
                    ? 'bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white/90'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Time-Based Trends - 2/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 liquid-glass rounded-2xl p-6 border border-accent-cyan/20"
          >
            <h2 className="font-grotesk text-xl font-bold text-white mb-6">Income vs Expenses Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff40" style={{ fontSize: '12px' }} />
                <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                  textStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Spending by Category Pie - 1/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20"
          >
            <h2 className="font-grotesk text-xl font-bold text-white mb-6">Spending Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                  textStyle={{ color: '#fff' }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20 mb-8"
        >
          <h2 className="font-grotesk text-xl font-bold text-white mb-6">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="category" stroke="#ffffff40" style={{ fontSize: '12px' }} />
              <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                textStyle={{ color: '#fff' }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Bar dataKey="amount" fill="#00D4FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20 mb-8"
        >
          <h2 className="font-grotesk text-xl font-bold text-white mb-6">Category Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTotals.map((cat, idx) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className={`bg-gradient-to-br ${getCategoryColor(cat.category)} rounded-xl p-4 border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-grotesk font-bold text-white capitalize">{cat.category}</p>
                  <span className="font-rajdhani text-xs bg-white/10 px-2 py-1 rounded">
                    {Math.round((cat.amount / stats.totalSent) * 100)}%
                  </span>
                </div>
                <p className="font-orbitron text-lg font-bold text-accent-cyan mb-3">₹{cat.amount.toLocaleString()}</p>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.amount / Math.max(...categoryTotals.map(c => c.amount))) * 100}%` }}
                    transition={{ delay: 0.8 + idx * 0.05, duration: 1 }}
                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="liquid-glass rounded-2xl p-6 border border-accent-cyan/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-grotesk text-xl font-bold text-white">Recent Transactions</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 liquid-button rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
                <FiDownload size={18} className="text-white/70" />
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredTransactions.slice(0, 6).map((transaction, idx) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-accent-cyan/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                      transaction.type === 'sent' 
                        ? 'bg-red-500/20 border-red-500/30' 
                        : 'bg-green-500/20 border-green-500/30'
                    } group-hover:scale-110 transition-transform`}>
                      {transaction.type === 'sent' 
                        ? <FiArrowUpRight className="text-red-400" size={20} />
                        : <FiArrowDownLeft className="text-green-400" size={20} />
                      }
                    </div>

                    <div className="flex-1">
                      <p className="font-grotesk font-bold text-white">{transaction.name}</p>
                      <div className="flex gap-2 items-center">
                        <span className={`text-xs px-2 py-1 rounded font-rajdhani bg-gradient-to-br ${getCategoryColor(transaction.category).split(' ')[0]}`}>
                          {transaction.category}
                        </span>
                        <p className="font-rajdhani text-xs text-white/50">{transaction.date} • {transaction.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-orbitron font-bold text-lg ${
                      transaction.type === 'sent' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTransactions.length > 6 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 liquid-button rounded-xl py-3 font-grotesk font-bold text-accent-cyan flex items-center justify-center gap-2 hover:bg-accent-cyan/10 transition-all"
            >
              View All Transactions
              <FiChevronRight size={20} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
