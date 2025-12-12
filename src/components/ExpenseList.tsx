import { Expense } from '@/types/patrimony';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Receipt, MapPin, Calendar, Tag } from 'lucide-react';

interface ExpenseListProps {
  expenses: Array<Expense & { folderPath: string; itemName?: string }>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Nenhuma despesa encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors animate-fade-in"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-primary/20 text-primary">
                  {expense.category}
                </span>
                {expense.itemName && (
                  <span className="px-2 py-0.5 text-xs rounded bg-item-icon/20 text-item-icon">
                    {expense.itemName}
                  </span>
                )}
              </div>
              
              {expense.description && (
                <p className="text-sm text-foreground mb-2">{expense.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(expense.date)}
                </span>
                <span className="flex items-center gap-1 truncate" title={expense.folderPath}>
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{expense.folderPath}</span>
                </span>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(expense.value)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(expense.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
