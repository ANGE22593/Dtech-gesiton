import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionTable } from '@/components/TransactionTable';
import HeaderTransactions from '@/components/HeaderTransactions'; // ← Import du composant
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header existant */}
      <header className="bg-gradient-hero shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Caisse Journalière
            </h1>
            <p className="text-lg text-white/90">
              Saisissez et exportez vos données financières en toute simplicité
            </p>

            {/* LOGO */}

            <div className="flex items-center space-x-2 -mt-4 ml-2 absolute top-20 left-40"> 
              <img
                src="/lovable-uploads/Dtech.png"
                alt="Logo Entreprise"
                className="h-12 w-auto pb-1000"  // ← agrandi (avant h-12)
              />
            </div>

            {/* dashboard */}

            <div className="absolute top-20 right-4 "> 
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                title="Aller au Dashboard"
              >
                <LayoutDashboard className="h-7 w-7" /> {/* ← icône un peu plus grande */}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 Nouveau Header Transactions */}
      <HeaderTransactions />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default Index;
