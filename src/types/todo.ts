export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    category: string;
    notes?: string;
  }
  
  export interface TodoStats {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  }