import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, TrendingUp, TrendingDown, FileText, Edit, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from '@/hooks/use-toast';

interface TransactionTableProps {
  transactions: Transaction[];
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const TransactionTable = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction
}: TransactionTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = transactions.filter(transaction =>
    Object.values(transaction).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToExcel = () => {
    if (transactions.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Il n'y a aucune transaction à exporter",
        variant: "destructive"
      });
      return;
    }

    const exportData = transactions.map(transaction => ({
      'DATE': transaction.date,
      'NOMS': transaction.nom,
      'NATURE': transaction.nature,
      'DETAIL': transaction.detail,
      'PROJET/INTERVENTION': transaction.projetIntervention,
      'IMP/PREV': transaction.impPrev,
      'CORPS DE METIERS': transaction.corpsDeMetiers,
      'MONNAIE': transaction.monnaie,
      'DEBIT': transaction.debit,
      'CREDIT': transaction.credit
    }));

    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
    const totalMonnaie = transactions.reduce((sum, t) => sum + t.monnaie, 0);

    // Ajouter les totaux
    const totalRow: any = {
      'DATE': '',
      'NOMS': '',
      'NATURE': '',
      'DETAIL': '',
      'PROJET/INTERVENTION': '',
      'IMP/PREV': '',
      'CORPS DE METIERS': '',
      'MONNAIE': totalMonnaie,
      'DEBIT': totalDebit,
      'CREDIT': totalCredit
    };
    
    exportData.push(totalRow);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    const colWidths = [
      { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 30 },
      { wch: 25 }, { wch: 10 }, { wch: 20 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }
    ];
    worksheet['!cols'] = colWidths;

    const fileName = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Export réussi",
      description: `Le fichier ${fileName} a été téléchargé`
    });
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalMonnaie = transactions.reduce((sum, t) => sum + t.monnaie, 0);
  const balance = totalDebit - totalCredit + totalMonnaie;

};
