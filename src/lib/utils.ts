
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'entregue':
    case 'concluído':
    case 'pago':
      return 'bg-green-100 text-green-800';
    case 'pendente':
    case 'aguardando':
    case 'em processamento':
      return 'bg-yellow-100 text-yellow-800';
    case 'enviado':
    case 'em trânsito':
      return 'bg-blue-100 text-blue-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateRandomId(prefix = '') {
  return `${prefix}${Math.random().toString(36).substring(2, 10)}`;
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}
