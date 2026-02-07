
import React, { useState } from 'react';
import { Category, Expense } from '../types';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  [Category.FOOD]: 'fa-utensils',
  [Category.TRANSPORT]: 'fa-car',
  [Category.HOUSING]: 'fa-home',
  [Category.ENTERTAINMENT]: 'fa-gamepad',
  [Category.HEALTH]: 'fa-heart-pulse',
  [Category.SHOPPING]: 'fa-bag-shopping',
  [Category.EDUCATION]: 'fa-book',
  [Category.SAVINGS]: 'fa-piggy-bank',
  [Category.PLEASURE]: 'fa-martini-glass-citrus',
  [Category.OTHER]: 'fa-ellipsis-h',
};

const CATEGORY_COLORS: Record<string, string> = {
  [Category.FOOD]: 'bg-orange-100 text-orange-600',
  [Category.TRANSPORT]: 'bg-blue-100 text-blue-600',
  [Category.HOUSING]: 'bg-indigo-100 text-indigo-600',
  [Category.ENTERTAINMENT]: 'bg-purple-100 text-purple-600',
  [Category.HEALTH]: 'bg-red-100 text-red-600',
  [Category.SHOPPING]: 'bg-pink-100 text-pink-600',
  [Category.EDUCATION]: 'bg-cyan-100 text-cyan-600',
  [Category.SAVINGS]: 'bg-emerald-100 text-emerald-600',
  [Category.PLEASURE]: 'bg-yellow-100 text-yellow-600',
  [Category.OTHER]: 'bg-gray-100 text-gray-600',
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    
    onAdd({
      title,
      amount: parseFloat(amount),
      category,
      date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Nowy wydatek</h2>
            <p className="text-indigo-100 text-sm">Uzupełnij szczegóły transakcji</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Co kupiłeś?</label>
              <input
                type="text"
                required
                autoFocus
                placeholder="np. Obiad w restauracji"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kwota (PLN)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">PLN</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Wybierz kategorię</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.values(Category) as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border-2 ${
                    category === cat 
                      ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-sm' 
                      : 'border-transparent bg-gray-50 hover:bg-gray-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${CATEGORY_COLORS[cat as string] || 'bg-gray-100'}`}>
                    <i className={`fas ${CATEGORY_ICONS[cat as string] || 'fa-question'}`}></i>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase text-center truncate w-full">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl transform active:scale-[0.97] transition-all mt-4 flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            Zapisz wydatek
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
