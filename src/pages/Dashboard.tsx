import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Download, Database, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Bouton retour */}
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 self-start sm:self-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>

            {/* Titre centré */}
            <div className="text-center flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Paramètres de gestion
              </h1>
            </div>

            {/* Logo */}
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <img
                src="/lovable-uploads/Dtech.png"
                alt="Logo Entreprise"
                className="h-10 sm:h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Administration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Administration
              </CardTitle>
              <CardDescription>
                Gestion des données configurables du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/admin-login')}
                  className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Accéder au Panneau Admin
                </Button>
                <p className="text-sm text-muted-foreground">
                  Modifier les noms, projets et corps de métiers
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Gestion des données
              </CardTitle>
              <CardDescription>
                Import/Export et sauvegarde des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter toutes les données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Sauvegarder la base
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Restaurer les données
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Statistiques rapides</CardTitle>
              <CardDescription>
                Vue d'ensemble des données de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Total transactions</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0 F CFA</div>
                  <div className="text-sm text-muted-foreground">Total crédits</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-red-600">0 F CFA</div>
                  <div className="text-sm text-muted-foreground">Total débits</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0 F CFA</div>
                  <div className="text-sm text-muted-foreground">Solde</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
