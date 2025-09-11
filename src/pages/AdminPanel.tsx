import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Trash2, Check, TrendingUp, TrendingDown, FileText, Search, Download, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// --- Fonction utilitaire pour formatage ---
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Exemple de données pour transactions
interface Transaction {
  id: number;
  date: string;
  nom: string;
  nature: string;
  projetIntervention: string;
  impPrev: string;
  corpsDeMetiers: string;
  monnaie: number;
  debit: number;
  credit: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();

  // --- Données Admin ---
  const [noms, setNoms] = useState<string[]>(["Alice", "Bob"]);
  const [projets, setProjets] = useState<string[]>(["Projet A", "Projet B"]);
  const [metiers, setMetiers] = useState<string[]>(["Comptable", "Technicien"]);

  const [nom, setNom] = useState("");
  const [projet, setProjet] = useState("");
  const [metier, setMetier] = useState("");

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<"nom" | "projet" | "metier" | null>(null);
  const [editValue, setEditValue] = useState("");

  // --- Transactions ---
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2025-09-01", nom: "Alice", nature: "Achat", projetIntervention: "Projet A", impPrev: "Prévu", corpsDeMetiers: "Comptable", monnaie: 0, debit: 2000, credit: 0 },
    { id: 2, date: "2025-09-02", nom: "Bob", nature: "Vente", projetIntervention: "Projet B", impPrev: "Imprévu", corpsDeMetiers: "Technicien", monnaie: 0, debit: 0, credit: 5000 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // --- Totaux ---
  const totalDebit = useMemo(() => transactions.reduce((acc, t) => acc + t.debit, 0), [transactions]);
  const totalCredit = useMemo(() => transactions.reduce((acc, t) => acc + t.credit, 0), [transactions]);
  const balance = totalCredit - totalDebit;

  // --- Edition ---
  const startEdit = (type: "nom" | "projet" | "metier", index: number, value: string) => {
    setEditType(type);
    setEditIndex(index);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editType && editIndex !== null) {
      if (editType === "nom") {
        const updated = [...noms];
        updated[editIndex] = editValue;
        setNoms(updated);
      }
      if (editType === "projet") {
        const updated = [...projets];
        updated[editIndex] = editValue;
        setProjets(updated);
      }
      if (editType === "metier") {
        const updated = [...metiers];
        updated[editIndex] = editValue;
        setMetiers(updated);
      }
      setEditType(null);
      setEditIndex(null);
      setEditValue("");
    }
  };

  const deleteItem = (type: "nom" | "projet" | "metier", index: number) => {
    if (type === "nom") setNoms(noms.filter((_, i) => i !== index));
    if (type === "projet") setProjets(projets.filter((_, i) => i !== index));
    if (type === "metier") setMetiers(metiers.filter((_, i) => i !== index));
  };

  // --- Table tri/recherche ---
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions]
      .filter(
        (t) =>
          t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.projetIntervention.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [transactions, searchTerm, sortField, sortDirection]);

  // Bloc réutilisable
  const renderList = (
    title: string,
    type: "nom" | "projet" | "metier",
    items: string[],
    value: string,
    setValue: (val: string) => void,
    setItems: (items: string[]) => void
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder={`Ajouter ${title.toLowerCase()}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            onClick={() => {
              if (value.trim()) {
                setItems([...items, value]);
                setValue("");
              }
            }}
          >
            Ajouter
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between items-center bg-muted p-2 rounded">
              {editType === type && editIndex === i ? (
                <div className="flex gap-2 w-full">
                  <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                  <Button size="sm" onClick={saveEdit}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  {item}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEdit(type, i, item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteItem(type, i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-6">⚙️ Panneau Admin</h1>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-card bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-muted-foreground">Total Débit</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebit, "CFA")}</p>
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
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit, "CFA")}</p>
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
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(balance, "CFA")}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des données configurables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {renderList("Noms", "nom", noms, nom, setNom, setNoms)}
        {renderList("Projets / Interventions", "projet", projets, projet, setProjet, setProjets)}
        {renderList("Corps de métiers", "metier", metiers, metier, setMetier, setMetiers)}
      </div>

      {/* Table des transactions */}
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
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                onClick={() => console.log("Exporter Excel")}
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
                {searchTerm ? "Aucune transaction trouvée" : "Aucune transaction enregistrée"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("date")} className="cursor-pointer">Date</TableHead>
                    <TableHead onClick={() => handleSort("nom")} className="cursor-pointer">Nom</TableHead>
                    <TableHead>Nature</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Corps</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{transaction.nom}</TableCell>
                      <TableCell>{transaction.nature}</TableCell>
                      <TableCell>{transaction.projetIntervention}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.impPrev === "Imprévu" ? "destructive" : "secondary"}>
                          {transaction.impPrev}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.corpsDeMetiers}</TableCell>
                      <TableCell className="text-right text-red-600">
                        {transaction.debit > 0 ? formatCurrency(transaction.debit, "CFA") : "-"}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {transaction.credit > 0 ? formatCurrency(transaction.credit, "CFA") : "-"}
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
