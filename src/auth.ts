// src/utils/auth.ts
export const checkAdminLogin = (username: string, password: string) => {
  const storedUser = localStorage.getItem("adminUsername") || "Dtechcaisseadmin";
  const storedPass = localStorage.getItem("adminPassword") || "Dtechsarl24";

  if (username === storedUser && password === storedPass) {
    localStorage.setItem("isAdminLoggedIn", "true"); // Indique que l'admin est connecté
    return true;
  }
  return false;
};

// Vérifier si l'admin est déjà connecté

export const isAdminLoggedIn = () => {
  return localStorage.getItem("isAdminLoggedIn") === "true";
};

// Déconnexion
export const logoutAdmin = () => {
  localStorage.removeItem("isAdminLoggedIn");
};
