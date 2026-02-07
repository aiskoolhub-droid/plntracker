
export enum Category {
  FOOD = 'Jedzenie',
  TRANSPORT = 'Transport',
  HOUSING = 'Mieszkanie',
  ENTERTAINMENT = 'Rozrywka',
  HEALTH = 'Zdrowie',
  SHOPPING = 'Zakupy',
  EDUCATION = 'Edukacja',
  SAVINGS = 'Oszczędności',
  PLEASURE = 'Przyjemności',
  OTHER = 'Inne'
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
}

export interface User {
  email: string;
  name?: string;
}

export interface AppState {
  user: User | null;
  expenses: Expense[];
}
