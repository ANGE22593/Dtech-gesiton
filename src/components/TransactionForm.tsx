import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Calculator, Check, ChevronsUpDown } from 'lucide-react';
import { TransactionFormData, Transaction } from '@/types/transaction';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import DateInput from '@/components/DateInput';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const CORPS_METIERS = [
  'GENIE CIVIL',
  'PLOMBERIE', 
  'ELECTRICITE',
  'PEINTURE',
  'MENUSERIE',
  'CARREULAGE',
  'FROID/CLIMATISATION',
  'CAISSE',
  'CONTABILITE',
  'INFORMATIQUE',
  'MENUISERIE METALLIQUE',
  'CHAUFFAGE',
  'AUTRE'
];

const NOMS = [
  'ABLO','ACKCHI', 'ADAMA','AGENT MOOV','AGNERO',
  'ALASSANE','ALFRED','ALI','ANGE','ANTHONY','APE','ARIM',
  'ARMAND','ARSENE','ASSOU','ATTA','AZIZ','BAKARY','BALO',
  'BEN','BLANCO','BONEBO','BRUCE','CEDRIC','CISSE','CONSTANT',
  'COULIBALY','DAF','DEH','DENIS','DG','DIOMANDE','DJERA',
  'DJIBO','DOSSO','DRIDDI','EMLYS','EMMANUEL','ESAIE','FADIGA',
  'GOHOUSSOU','GNAHORE','GOURVERNEUR','GUY','HANNIEL','HERMAN',
  'HERVE','IBRAHIM','ISSA','JEAN','JOACHIM','JOSIANE','JUMEAU',
  'JUMEAUX','JUNIOR','KADER','KADER','KAMATE','KARIM','KAYO',
  'KEMA','KEVIN','KIKI','KODJO','KOFFI','KONE','KONATE','KOUAME',
  'KOUMAN ABDOUL','LASME','LASSINA','LE VIEUX','LOUKA','LOUISE',
  'MAIGA','MAMADOU','MICHEE','MIEZAN','MME N\'GUESSAN MIETE','MORTY',
  'MOUSSA','N\'DAH','NOEL','OUKA','OUATTARA','PARFAIT','PETIT FATIGA',
  'PRIMAEL','RAOUL','RAYMOND','REP','ROBERT','SAIBOU','SIRIKI','SORO',
  'SOULEMANE','STEPHANE','SYLLA','TACHEBY','TANOH','TCHERE','TONY',
  'TRABOUE','TRAORE','VIVIANE','WILLIAM','XAVIER','YVES'
];

const PROJETS_INTERVENTIONS = [
  'ADV','AGL','AGL CFAO INFRAS','AIRE DECLIVRAISON','AIRE LIVRAISON MERCEDES',
  'AMEN BURO CFAO','AMEN BURO INFO','AMEN INFO CFAO','ANCIEN ADV','APPRO CAISSE',
  'ARISE IVOIRE','ASCENSEUR AGL','ATINKOU','BABI','BABI MOTORS','BQ COSMOS',
  'BRASSIVOIRE','BURO CFAO','BURO INFO','CF JUIN','CFAO','CFAO VRIDI','CIGRAC',
  'CIGRAC/RMS','CIM IVOIRE','CITROEN','CLOTURE EN GRILLAGE PLATEAU','CNAM','COLAS',
  'COPHARMED','DAF A+','DAF CANAL+','DEM WINPART TREICH','DG BASSAM','DG C+','DG DTECH',
  'DIR SECURITE CFAO','DOM DAF A+','DOM PAPILLO','DOM TOUMI','DOP C+','ECMTD','EXTENSION RESEAU',
  'FACADE CFAO SARI','FG','GE MME DIALLO','GEMBA WINPART ZONE4','GNA PLATEAU','GREEN BURO','IMM KARABOUE',
  'INFRAS CFAO','INFRASTRUCTURE CFAO','IVOIRE','MAINTENANCE CANAL+','MARQUAGE AU SOL','MARQUAGE CFAO',
  'MARQUAGE SARI','MERCEDES','MERCEDES+SALLE REUNION','MME REMARK','MME RICCI','MOBILITY','MOLOKO',
  'MONT CHARGE WINPART YOP','MOTORS','MOTORS CFAO','OLAM','ONDULEUR CFAO','ORPHEE ADJAME','ORPHEE YOP',
  'PAPILLO','PAPILLO DOM','PAPILLO+DAF A+','PARKING SAV','PARKING SAV MB','PEUGEOT','REMBARDE CFAO INFRAS','REP TOYOTA',
  'RMS','SALLE REUNION','SALLE REUNION CFAO','SARI','SAV MB','SAV SUZUKI','SAV TOYOTA','SCO','SEDAFCI',
  'SHOW ROOM SARI','SHOWROOM SARI','SOLDE','ST DIGITAL','TCBT SARI','TOIL ADMIN CFAO','TOILETTE BURO INFO',
  'TOUR IVOIRE','TOYOTA','TR AMEN BURO VFAO','TR CFAO','TR CFAO MOBILITY','TR FACADE','TREICH WINPART',
  'TSK','VILLA ATTA','VILLA IVOIRE','VILLA WOGNIN','VILLA YABO','VRIDI','WINPART YOP','WINPART ZONE 4',
  'YOP CFAO','YOP COSMOS C+','YOP WINPART','ZONE MITSU','ZONE4 WINPART'
];

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    nom: '',
    nature: '',
    detail: '',
    projetIntervention: '',
    impPrev: 'Prévu',
    corpsDeMetiers: '',
    monnaie: '',
    debit: '',
    credit: ''
  });
  const [openProjet, setOpenProjet] = useState(false);
  const [openNom, setOpenNom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim() || !formData.nature.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom et la nature sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    const debit = parseFloat(formData.debit) || 0;
    const credit = parseFloat(formData.credit) || 0;
    const monnaie = parseFloat(formData.monnaie) || 0;

    if (debit === 0 && credit === 0) {
      toast({
        title: "Erreur de validation", 
        description: "Au moins un montant (débit ou crédit) doit être saisi",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: formData.date,
      nom: formData.nom.trim(),
      nature: formData.nature.trim(),
      detail: formData.detail.trim(),
      projetIntervention: formData.projetIntervention.trim(),
      impPrev: formData.impPrev,
      corpsDeMetiers: formData.corpsDeMetiers,
      monnaie: monnaie,
      debit,
      credit,
      createdAt: new Date()
    };

    onAddTransaction(transaction);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      nom: '',
      nature: '',
      detail: '',
      projetIntervention: '',
      impPrev: 'Prévu',
      corpsDeMetiers: '',
      monnaie: '',
      debit: '',
      credit: ''
    });

    toast({
      title: "Transaction ajoutée",
      description: "La transaction a été ajoutée avec succès"
    });
  };

  const updateField = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card bg-gradient-card border-0">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Plus className="h-5 w-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold bg-gradient-hero bg-clip-text text-transparent">
            Nouvelle Transaction
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-lg font-medium">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="transition-smooth focus:shadow-hover"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nom" className="text-lg font-medium">Nom *</Label>
            <Popover open={openNom} onOpenChange={setOpenNom}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openNom}
                  className="w-full justify-between transition-smooth focus:shadow-hover"
                >
                  {formData.nom || "Sélectionner ou entrer un nom..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Rechercher ou entrer un nom..." 
                    value={formData.nom}
                    onValueChange={(value) => updateField('nom', value)}
                  />
                  <CommandList>
                    <CommandEmpty>Aucun nom trouvé.</CommandEmpty>
                    <CommandGroup>
                      {formData.nom && formData.nom.trim() && !NOMS.some(nom => nom.toLowerCase() === formData.nom.toLowerCase()) && (
                        <CommandItem
                          key="custom-nom"
                          value={formData.nom}
                          onSelect={() => {
                            setOpenNom(false);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Utiliser "{formData.nom}"
                        </CommandItem>
                      )}
                      {NOMS.filter(nom => 
                        formData.nom ? nom.toLowerCase().includes(formData.nom.toLowerCase()) : true
                      ).map((nom) => (
                        <CommandItem
                          key={nom}
                          value={nom}
                          onSelect={(currentValue) => {
                            updateField('nom', currentValue);
                            setOpenNom(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.nom === nom ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {nom}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nature" className="text-lg font-medium">Nature *</Label>
            <Input
              id="nature" 
              placeholder="Nature de la transaction"
              value={formData.nature}
              onChange={(e) => updateField('nature', e.target.value)}
              className="transition-smooth focus:shadow-hover"
            />
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label htmlFor="detail" className="text-lg font-medium">Détail</Label>
            <Textarea
              id="detail"
              placeholder="Description détaillée..."
              value={formData.detail}
              onChange={(e) => updateField('detail', e.target.value)}
              className="min-h-[80px] transition-smooth focus:shadow-hover"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projet" className="text-lg font-medium">Projet/Intervention</Label>
            <Popover open={openProjet} onOpenChange={setOpenProjet}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProjet}
                  className="w-full justify-between transition-smooth focus:shadow-hover"
                >
                  {formData.projetIntervention
                    ? PROJETS_INTERVENTIONS.find(
                        (projet) => projet === formData.projetIntervention
                      )
                    : "Sélectionner un projet..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher un projet..." />
                  <CommandList>
                    <CommandEmpty>Aucun projet trouvé.</CommandEmpty>
                    <CommandGroup>
                      {PROJETS_INTERVENTIONS.map((projet) => (
                        <CommandItem
                          key={projet}
                          value={projet}
                          onSelect={(currentValue) => {
                            updateField('projetIntervention', currentValue === formData.projetIntervention ? "" : currentValue);
                            setOpenProjet(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.projetIntervention === projet ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {projet}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impPrev" className="text-lg font-medium">Imprévu/Prévu</Label>
            <Select value={formData.impPrev} onValueChange={(value) => updateField('impPrev', value)}>
              <SelectTrigger className="transition-smooth focus:shadow-hover">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prévu">Prévu</SelectItem>
                <SelectItem value="Imprévu">Imprévu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corps" className="text-lg font-medium">Corps de Métiers</Label>
            <Select value={formData.corpsDeMetiers} onValueChange={(value) => updateField('corpsDeMetiers', value)}>
              <SelectTrigger className="transition-smooth focus:shadow-hover">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {CORPS_METIERS.map(corps => (
                  <SelectItem key={corps} value={corps}>{corps}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monnaie" className="text-lg font-medium">Monnaie</Label>
            <Input
              id="monnaie"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.monnaie}
              onChange={(e) => updateField('monnaie', e.target.value)}
              className="transition-smooth focus:shadow-hover"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="debit" className="text-lg font-medium">Débit</Label>
            <Input
              id="debit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.debit}
              onChange={(e) => updateField('debit', e.target.value)}
              className="transition-smooth focus:shadow-hover"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit" className="text-lg font-medium">Crédit</Label>
            <Input
              id="credit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.credit}
              onChange={(e) => updateField('credit', e.target.value)}
              className="transition-smooth focus:shadow-hover"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Ajouter la Transaction
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};