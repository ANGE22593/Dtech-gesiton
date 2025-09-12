import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FolderKanban, Wrench, LayoutDashboard, Shield } from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
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
            <Button 
              onClick={() => navigate('/manage-workers')}
              className="w-full"
            >
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
            <Button 
              onClick={() => navigate('/manage-projects')}
              className="w-full"
            >
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
            <Button 
              onClick={() => navigate('/manage-trades')}
              className="w-full"
            >
              Gérer
            </Button>
          </CardContent>
        </Card>

        {/* Section Administration */}
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
              className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Accéder au Panneau Admin
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
