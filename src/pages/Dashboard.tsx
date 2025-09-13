import { useState } from "react";
import { Transaction } from "@/types/transaction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";

interface DashboardProps {
  transactions: Transaction[];
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

const Dashboard = ({ transactions, onEditTransaction, onDeleteTransaction }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // --- Filtrer les transactions
  const filteredTransactions = transactions.filter((transaction) =>
    Object.values(transaction).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // --- Trier les transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // --- Export Excel
  const exportToExcel = () => {
    if (transactions.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Il n'y a aucune transaction à exporter",
        variant: "destructive",
      });
      return;
    }

    const exportData = transactions.map((t) => ({
      DATE: t.date,
      NOMS: t.nom,
      NATURE: t.nature,
      DETAIL: t.detail,
      "PROJET/INTERVENTION": t.projetIntervention,
      "IMP/PREV": t.impPrev,
      "CORPS DE METIERS": t.corpsDeMetiers,
      MONNAIE: t.monnaie,
      DEBIT: t.debit,
      CREDIT: t.credit,
    }));

    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
    const totalMonnaie = transactions.reduce((sum, t) => sum + t.monnaie, 0);

    // Ligne des totaux
    const totalRow: any = {
      DATE: "",
      NOMS: "",
      NATURE: "",
      DETAIL: "",
      "PROJET/INTERVENTION": "",
      "IMP/PREV": "",
      "CORPS DE METIERS": "",
      MONNAIE: totalMonnaie,
      DEBIT: totalDebit,
      CREDIT: totalCredit,
    };

    exportData.push(totalRow);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, `transactions_${new Date().toISOString().split("T")[0]}.xlsx`);

    toast({
      title: "Export réussi",
      description: "Le fichier a été téléchargé",
    });
  };

  // --- Format monnaie
  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);

  // --- Totaux
  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalMonnaie = transactions.reduce((sum, t) => sum + t.monnaie, 0);
  const balance = totalDebit - totalCredit + totalMonnaie;

  return (
    <div className="space-y-6">
      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Total Débit</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalDebit, "CFA")}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Total Crédit</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalCredit, "CFA")}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Solde</p>
                <p
                  className={`text-2xl font-bold ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(balance, "CFA")}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau Transactions */}
      <Card className="shadow-card bg-gradient-card border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold bg-gradient-hero bg-clip-text text-transparent">
              Transactions ({transactions.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 transition-smooth focus:shadow-hover"
                />
              </div>
              <Button
                onClick={exportToExcel}
                className="bg-gradient-secondary hover:shadow-hover transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchTerm
                  ? "Aucune transaction trouvée"
                  : "Aucune transaction enregistrée"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                      Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("nom")} className="cursor-pointer">
                      Nom {sortField === "nom" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Nature</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Corps</TableHead>
                    <TableHead className="text-right">Monnaie</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>{new Date(t.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{t.nom}</TableCell>
                      <TableCell>{t.nature}</TableCell>
                      <TableCell className="max-w-32 truncate">{t.projetIntervention}</TableCell>
                      <TableCell>
                        <Badge variant={t.impPrev === "Imprévu" ? "destructive" : "secondary"}>
                          {t.impPrev}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-24 truncate">{t.corpsDeMetiers}</TableCell>
                      <TableCell className="text-right">
                        {t.monnaie > 0 ? formatCurrency(t.monnaie, "CFA") : "-"}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {t.debit > 0 ? formatCurrency(t.debit, "CFA") : "-"}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {t.credit > 0 ? formatCurrency(t.credit, "CFA") : "-"}
                      </TableCell>
                      <TableCell className="text-center flex justify-center gap-2">
                        {onEditTransaction && (
                          <Button size="sm" variant="outline" onClick={() => onEditTransaction(t)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteTransaction && (
                          <Button size="sm" variant="destructive" onClick={() => onDeleteTransaction(t.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
