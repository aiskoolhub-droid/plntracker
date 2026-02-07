
import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Expense, Category } from '../types';
import { getFinancialAdvice } from '../services/gemini';

interface DashboardProps {
  expenses: Expense[];
}

const COLORS = [
  '#4F46E5', // Jedzenie -> Indigo
  '#10B981', // Transport -> Emerald
  '#F59E0B', // Mieszkanie -> Amber
  '#EF4444', // Rozrywka -> Red
  '#8B5CF6', // Zdrowie -> Violet
  '#EC4899', // Zakupy -> Pink
  '#06B6D4', // Edukacja -> Cyan
  '#059669', // Oszczędności -> Emerald Dark
  '#D97706', // Przyjemności -> Amber Dark
  '#64748B', // Inne -> Slate
];

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('Asystent AI analizuje Twoje wydatki...');

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryData = Object.values(Category).map(cat => {
      const amount = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
      return { name: cat, value: amount };
    }).filter(d => d.value > 0);

    return { total, categoryData };
  }, [expenses]);

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await getFinancialAdvice(expenses);
      setAiAdvice(advice);
    };
    fetchAdvice();
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Suma wszystkich wydatków</p>
        <h3 className="text-4xl font-black text-indigo-600 mt-2 tracking-tight">
          {stats.total.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} <span className="text-lg font-medium opacity-60">PLN</span>
        </h3>
        <div className="mt-8 w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {stats.categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Podział wydatków</h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase">Statystyki kategorii</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.categoryData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{fontSize: 11, fontWeight: 600, fill: '#64748B'}} 
                width={100}
              />
              <Tooltip 
                 cursor={{fill: '#f8fafc'}}
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#4F46E5" radius={[0, 10, 10, 0]} barSize={20}>
                {stats.categoryData.map((_, index) => (
                   <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Advice Card */}
      <div className="lg:col-span-3 bg-gradient-to-r from-indigo-600 to-blue-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-indigo-200">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 flex-shrink-0 animate-pulse">
            <i className="fas fa-wand-magic-sparkles text-3xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg flex items-center gap-2 mb-2">
              Inteligentna Analiza
              <span className="bg-blue-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Powered by Gemini</span>
            </h4>
            <p className="text-indigo-50 leading-relaxed text-lg font-medium">"{aiAdvice}"</p>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none scale-150 transform rotate-12">
          <i className="fas fa-coins text-9xl"></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
