import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, Wrench, LayoutDashboard, Shield } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface DashboardProps {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: DashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>

      {/* Section cartes de gestion */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Gestion des Travailleurs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des Travailleurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Ajouter, modifier ou supprimer des travailleurs.
            </p>
            <Button onClick={() => navigate('/manage-workers')} className="w-full">
              Gérer
            </Button>
          </CardContent>
        </Card>

        {/* Gestion des Projets */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Gestion des Projets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Suivi et organisation des projets.
            </p>
            <Button onClick={() => navigate('/manage-projects')} className="w-full">
              Gérer
            </Button>
          </CardContent>
        </Card>

        {/* Gestion des Corps de Métier */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Corps de Métier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Administration des corps de métier.
            </p>
            <Button onClick={() => navigate('/manage-trades')} className="w-full">
              Gérer
            </Button>
          </CardContent>
        </Card>

        {/* Administration */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Accéder au panneau d’administration sécurisé.
            </p>
            <Button
              onClick={() => navigate('/admin-login')}
              className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300 flex items-center justify-center"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Accéder au Panneau Admin
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Section Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Transactions récentes</h2>

        {transactions.length > 0 ? (
  transactions.map((t: Transaction) => (
    <tr key={t.id} className="hover:bg-gray-50">
      <td>{t.date}</td>
      <td>{t.nom}</td>
      <td>{t.nature}</td>
      <td>{t.projetIntervention}</td>
      <td>{t.impPrev}</td>
      <td>{t.corpsDeMetiers}</td>
      <td>{t.monnaie}</td>
      <td>{t.debit}</td>
      <td>{t.credit}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={9} className="text-center">
      Aucune transaction pour le moment
    </td>
  </tr>
)}

      </div>
    </div>
  );
}
