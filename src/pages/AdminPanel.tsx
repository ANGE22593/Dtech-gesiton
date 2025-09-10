import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  // Données initiales (pré-remplies sur la page d'accueil)
  const [noms, setNoms] = useState<string[]>(["Alice", "Bob"]);
  const [projets, setProjets] = useState<string[]>(["Projet A", "Projet B"]);
  const [metiers, setMetiers] = useState<string[]>(["Comptable", "Technicien"]);

  // Inputs pour ajout
  const [nom, setNom] = useState("");
  const [projet, setProjet] = useState("");
  const [metier, setMetier] = useState("");

  // État pour l’édition
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<"nom" | "projet" | "metier" | null>(null);
  const [editValue, setEditValue] = useState("");

  // Démarrer la modification
  const startEdit = (type: "nom" | "projet" | "metier", index: number, value: string) => {
    setEditType(type);
    setEditIndex(index);
    setEditValue(value);
  };

  // Sauvegarder la modification
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

  // Supprimer un élément
  const deleteItem = (type: "nom" | "projet" | "metier", index: number) => {
    if (type === "nom") setNoms(noms.filter((_, i) => i !== index));
    if (type === "projet") setProjets(projets.filter((_, i) => i !== index));
    if (type === "metier") setMetiers(metiers.filter((_, i) => i !== index));
  };

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
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteItem(type, i)}
                    >
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
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-6">⚙️ Panneau Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderList("Noms", "nom", noms, nom, setNom, setNoms)}
        {renderList("Projets / Interventions", "projet", projets, projet, setProjet, setProjets)}
        {renderList("Corps de métiers", "metier", metiers, metier, setMetier, setMetiers)}
      </div>
    </div>
  );
}
