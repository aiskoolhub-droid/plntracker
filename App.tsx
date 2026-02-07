
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Expense, User } from './types';
import { loadState, saveState, serializeState, deserializeState, saveLastEmail, loadLastEmail } from './services/storage';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    // Initial load, check hash first for shared data
    const hash = window.location.hash.substring(1);
    if (hash && hash !== 'login') {
      const sharedExpenses = deserializeState(hash);
      if (sharedExpenses) {
        return { user: { email: 'shared@guest.com' }, expenses: sharedExpenses };
      }
    }
    return loadState();
  });

  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [lastEmail, setLastEmail] = useState<string | null>(loadLastEmail());
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    saveState(state);
    if (state.user) {
      saveLastEmail(state.user.email);
      setLastEmail(state.user.email);
    }
  }, [state]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    performLogin(emailInput);
  };

  const performLogin = (email: string) => {
    setState(prev => ({ ...prev, user: { email: email } }));
  };

  const handleLogout = () => {
    setState({ user: null, expenses: [] });
    window.location.hash = '';
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9)
    };
    setState(prev => ({
      ...prev,
      expenses: [expense, ...prev.expenses]
    }));
  };

  const deleteExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const shareAccount = () => {
    const hash = serializeState(state.expenses);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <i className="fas fa-coins text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold">PLN Tracker</h1>
            <p className="opacity-80 mt-2">Zarządzaj swoimi wydatkami mądrze</p>
          </div>
          
          <div className="p-8 space-y-6">
            {lastEmail && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Ostatnio używane konto</label>
                <button
                  onClick={() => performLogin(lastEmail)}
                  className="w-full flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl hover:bg-indigo-100 transition-colors group text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {lastEmail[0].toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-indigo-900 truncate">{lastEmail}</p>
                    <p className="text-xs text-indigo-500">Kliknij, aby wejść szybko</p>
                  </div>
                  <i className="fas fa-chevron-right text-indigo-300 group-hover:text-indigo-600 transition-colors"></i>
                </button>
                <div className="flex items-center gap-4 my-4">
                  <div className="h-px bg-gray-100 flex-1"></div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">lub inne konto</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adres Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all"
              >
                Rozpocznij śledzenie
              </button>
            </form>
            <p className="text-xs text-center text-gray-400">
              Logując się akceptujesz nasze warunki korzystania.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <i className="fas fa-wallet"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">PLN Tracker</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={shareAccount}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copySuccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <i className={copySuccess ? "fas fa-check" : "fas fa-share-nodes"}></i>
              <span className="hidden sm:inline">{copySuccess ? 'Skopiowano!' : 'Udostępnij'}</span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900 leading-none truncate max-w-[150px]">{state.user.email}</p>
                <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Wyloguj się</button>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                {state.user.email[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Witaj ponownie! 👋</h2>
            <p className="text-gray-500">Oto podsumowanie Twoich finansów w PLN.</p>
          </div>
          <button
            onClick={() => setIsAddingExpense(true)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <i className="fas fa-plus"></i>
            Dodaj wydatek
          </button>
        </div>

        {/* Dashboard Components */}
        <Dashboard expenses={state.expenses} />

        {/* Recent Expenses List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Ostatnie wydatki</h3>
            <span className="text-sm text-gray-400">{state.expenses.length} pozycji</span>
          </div>
          <div className="overflow-x-auto">
            {state.expenses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-receipt text-3xl text-gray-300"></i>
                </div>
                <p className="text-gray-500">Brak wydatków. Zacznij dodawać!</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Tytuł</th>
                    <th className="px-6 py-3 font-semibold">Kategoria</th>
                    <th className="px-6 py-3 font-semibold">Data</th>
                    <th className="px-6 py-3 font-semibold text-right">Kwota</th>
                    <th className="px-6 py-3 font-semibold text-right">Opcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{expense.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{expense.date}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {expense.amount.toFixed(2)} <span className="text-xs font-normal text-gray-400">PLN</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Floating Add Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={() => setIsAddingExpense(true)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl active:scale-90 transition-transform"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Modals */}
      {isAddingExpense && (
        <ExpenseForm
          onAdd={addExpense}
          onClose={() => setIsAddingExpense(false)}
        />
      )}
    </div>
  );
};

export default App;
