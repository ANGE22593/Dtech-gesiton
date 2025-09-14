import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  FolderKanban,
  Wrench,
  LayoutDashboard,
  Shield,
  TrendingUp,
  TrendingDown,
  FileText,
  Search,
  Download,
  Edit,
  Trash2
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/types/transaction"

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


// ---- Fonction utilitaire ----
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(value)

type DashboardProps = {
  transactions: Transaction[]
}

export default function Dashboard({ transactions }: DashboardProps) {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Transaction | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // ---- Calculs ----
  const totalDebit = useMemo(() => transactions.reduce((sum, t) => sum + t.debit, 0), [transactions])
  const totalCredit = useMemo(() => transactions.reduce((sum, t) => sum + t.credit, 0), [transactions])
  const balance = totalCredit - totalDebit

  // ---- Tri et recherche ----
  const sortedTransactions = useMemo(() => {
    let filtered = transactions.filter(
      (t) =>
        t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nature.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [transactions, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const exportToExcel = () => {
  if (transactions.length === 0) {
    alert("Aucune transaction à exporter");
    return;
  }

  // 1️⃣ Préparer les données
  const data = transactions.map(t => ({
    Date: t.date,
    Nom: t.nom,
    Nature: t.nature,
    Projet: t.projetIntervention,
    Type: t.impPrev,
    Corps: t.corpsDeMetiers,
    Monnaie: t.monnaie,
    Débit: t.debit,
    Crédit: t.credit
  }));

  // 2️⃣ Créer le workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");

  // 3️⃣ Générer le fichier Excel
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
 };

  return (
    
    <div className="p-4 sm:p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Tableau des statistiques</h1>
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          ← Retour
        </Button>
        <h1 className="text-2xl font-bold">Tableau des statistiques</h1>
      </div>


      {/* ---- Statistiques ---- */}
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

      {/* ---- Gestion ---- */}
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
              onClick={() => navigate("/admin-login")}
              className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Accéder au Panneau Admin
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ---- Tableau Transactions ---- */}
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
  )
}
