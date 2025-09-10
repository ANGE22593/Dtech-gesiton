export interface Transaction {
  id: string;
  date: string;
  nom: string;
  nature: string;
  detail: string;
  projetIntervention: string;
  impPrev: 'Imprévu' | 'Prévu';
  corpsDeMetiers: string;
  monnaie: number;
  debit: number;
  credit: number;
  createdAt: Date;
}

export interface TransactionFormData {
  date: string;
  nom: string;
  nature: string;
  detail: string;
  projetIntervention: string;
  impPrev: 'Imprévu' | 'Prévu';
  corpsDeMetiers: string;
  monnaie: string;
  debit: string;
  credit: string;
}