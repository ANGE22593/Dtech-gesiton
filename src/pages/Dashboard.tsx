import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  TrendingDown,
  FileText,
  Search,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ---- Fonction utilitaire ----
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

  // ---- Modal Admin ----
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ---- Vérifier la session côté serveur ----
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost/dtech/check_session.php");
        const data = await res.json();
        if (!data.loggedIn) {
          navigate("/admin-login"); // pas connecté → retour page login
        }
      } catch (err) {
        console.error(err);
        alert("Erreur serveur. Vérifiez que WAMP est démarré.");
      }
    };
    checkSession();
  }, [navigate]);

  // ---- Login modal pour panneau admin ----
  const handleAdminLogin = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost/dtech/login.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowLogin(false);
        navigate("/admin-panel");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la connexion.");
    }
  };

  // ---- Logout ----
  const handleLogout = async () => {
    try {
      await fetch("http://localhost/dtech/logout.php");
      navigate("/admin-login");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la déconnexion.");
    }
  };

  // ---- Calculs ----
  const totalDebit = useMemo(() => transactions.reduce((sum, t) => sum + t.debit, 0), [transactions]);
  const totalCredit = useMemo(() => transactions.reduce((sum, t) => sum + t.credit, 0), [transactions]);
  const balance = totalCredit - totalDebit;

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
      {/* Header */}
      <header className="bg-gradient-hero shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/lovable-uploads/Dtech.png" alt="Logo Entreprise" className="h-10 sm:h-12 md:h-10 w-auto" />
            </div>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Tableau des statistiques</h1>
            <p className="text-base sm:text-lg text-white/90">
              Saisissez et exportez vos données financières en toute simplicité
            </p>
          </div>
        </div>
      </header>

      {/* Boutons retour & déconnexion */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
          ← Retour
        </Button>
        <Button onClick={handleLogout} variant="destructive">
          Déconnexion
        </Button>
      </div>

      {/* Carte Admin */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Administration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Accéder au panneau d’administration sécurisé.</p>
            <Button
              onClick={() => setShowLogin(true)}
              className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Accéder au Panneau Admin
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal login admin */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Connexion Admin</h2>
            <Input
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-3"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-between mt-4 gap-2">
              <Button onClick={handleAdminLogin} className="flex-1">
                Se connecter
              </Button>
              <Button variant="outline" onClick={() => setShowLogin(false)} className="flex-1">
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques & tableau restent inchangés */}
      {/* ... ton code existant pour cartes et tableau ... */}
    </div>
  );
}
