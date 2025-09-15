import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, Shield, TrendingUp, TrendingDown, FileText, Search, Download, Edit, Trash2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Utilitaire
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(value);

type DashboardProps = {
  transactions: Transaction[];
};

export default function Dashboard({ transactions }: DashboardProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // ---- Vérifier si admin connecté côté serveur ----
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const res = await fetch("http://localhost/dtech/check_session.php");
        const data = await res.json();
        if (!data.loggedIn) {
          alert("Un autre appareil est déjà connecté ou vous n'êtes pas connecté !");
          navigate("/admin-login");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur serveur. Vérifiez que WAMP est démarré.");
      }
    };
    checkAdminSession();
  }, [navigate]);

  // ---- Déconnexion ----
  const handleLogout = async () => {
    try {
      await fetch("http://localhost/dtech/logout.php");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la déconnexion.");
    }
  };

  // ---- Tri et recherche ----
  const sortedTransactions = useMemo(() => {
    let filtered = transactions.filter(
      (t) =>
        t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nature.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [transactions, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ---- Calculs ----
  const totalDebit = useMemo(() => transactions.reduce((sum, t) => sum + t.debit, 0), [transactions]);
  const totalCredit = useMemo(() => transactions.reduce((sum, t) => sum + t.credit, 0), [transactions]);
  const balance = totalCredit - totalDebit;

  // ---- Export Excel ----
  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert("Aucune transaction à exporter");
      return;
    }

    const data = transactions.map((t) => ({
      Date: t.date,
      Nom: t.nom,
      Nature: t.nature,
      Projet: t.projetIntervention,
      Type: t.impPrev,
      Corps: t.corpsDeMetiers,
      Monnaie: t.monnaie,
      Débit: t.debit,
      Crédit: t.credit,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-background">
      <header className="bg-gradient-hero shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/lovable-uploads/Dtech.png" alt="Logo Entreprise" className="h-10 sm:h-12 md:h-10 w-auto" />
            </div>
            <Button onClick={handleLogout} variant="destructive">Déconnexion</Button>
          </div>
        </div>
      </header>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-muted-foreground">Total Débit</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebit)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-muted-foreground">Total Crédit</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-muted-foreground">Solde</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* Tableau Transactions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold">Transactions ({transactions.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button onClick={exportToExcel} className="bg-gradient-secondary">
                <Download className="h-4 w-4 mr-2" />
                Exporter Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucune transaction trouvée</p>
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
                    <TableRow key={t.id}>
                      <TableCell>{new Date(t.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{t.nom}</TableCell>
                      <TableCell>{t.nature}</TableCell>
                      <TableCell>{t.projetIntervention}</TableCell>
                      <TableCell>
                        <Badge variant={t.impPrev === "Imprévu" ? "destructive" : "secondary"}>{t.impPrev}</Badge>
                      </TableCell>
                      <TableCell>{t.corpsDeMetiers}</TableCell>
                      <TableCell className="text-right">{t.monnaie > 0 ? formatCurrency(t.monnaie) : "-"}</TableCell>
                      <TableCell className="text-right text-red-600">{t.debit > 0 ? formatCurrency(t.debit) : "-"}</TableCell>
                      <TableCell className="text-right text-green-600">{t.credit > 0 ? formatCurrency(t.credit) : "-"}</TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
}
