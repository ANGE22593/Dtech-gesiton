import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import HeaderTransactions from "@/components/HeaderTransactions"; 
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header principal */}
      <header className="bg-gradient-hero shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Ligne contenant logo + dashboard */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/lovable-uploads/Dtech.png"
                alt="Logo Entreprise"
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
            </div>

            {/* Dashboard bouton */}
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                title="Aller au Dashboard"
                className="p-2"
              >
                <LayoutDashboard className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Caisse Journalière
            </h1>
            <p className="text-base sm:text-lg text-white/90">
              Saisissez et exportez vos données financières en toute simplicité
            </p>
          </div>
        </div>
      </header>

      {/* 🟢 Header Transactions */}
      <HeaderTransactions />

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>
      </main>
    </div>
  );
};

export default Index;
