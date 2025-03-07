import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Board, getAllBoards } from "../../api/boardApi";

export default function Dashboard(): JSX.Element {
  // État pour stocker TOUS les boards renvoyés par l'API
  const [boards, setBoards] = useState<Board[]>([]);

  // État pour la recherche locale (champ texte)
  const [searchTerm, setSearchTerm] = useState("");

  // Charger tous les Tetris au montage du composant
  useEffect(() => {
    loadAllBoards();
  }, []);

  async function loadAllBoards() {
    try {
      const data = await getAllBoards(); // ou fetchAllBoards
      console.log("Réponse API (boards) :", data);
      setBoards(data);
    } catch (error) {
      console.error("Erreur lors du chargement des Tetris :", error);
    }
  }
  

  // Filtrer localement par nom (ou selon d'autres critères)
  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page mx-auto p-4">
      {/* ---- Section supérieure : Création & Recherche ---- */}
      <div className="dashboard-top-section flex flex-col md:flex-row gap-4 mb-8">

        {/* Carte de création (à gauche) */}
        <div className="dashboard-card card w-full md:w-1/2 bg-base-100 shadow-xl">
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">Créer un Tetris</h2>
            <button className="dashboard-btn-create btn btn-success btn-wide mt-4">
              + Nouveau Tetris
            </button>
          </div>
        </div>

        {/* Carte de recherche (à droite) */}
        <div className="dashboard-card card w-full md:w-1/2 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Rechercher un Tetris</h2>
            <div className="dashboard-search form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Rechercher un Tetris…"
                  className="dashboard-input input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Affichage filtré */}
            <div className="mt-4 space-y-2">
              {filteredBoards.map((board) => (
                <div key={board.id} className="p-2 border rounded bg-gray-50">
                  <p><strong>ID :</strong> {board.id}</p>
                  <p><strong>Nom :</strong> {board.name}</p>
                  <p><strong>Colonnes :</strong> {board.column}</p>
                </div>
              ))}

              {/* Si aucun résultat */}
              {filteredBoards.length === 0 && (
                <p className="text-sm text-gray-500">
                  Aucun Tetris ne correspond à la recherche.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Section inférieure : Configuration du Tetris ---- */}
      <div className="dashboard-config card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title">Configurer son Tetris</h2>
          {/* Reste inchangé... */}
          <div className="form-control mt-4 dashboard-visibility">
            <label className="label">
              <span className="label-text">Visibilité :</span>
            </label>
            <div className="flex gap-4">
              <label className="cursor-pointer label">
                <span className="label-text">Public</span>
                <input
                  type="radio"
                  name="visibility"
                  className="radio radio-primary"
                  defaultChecked
                />
              </label>
              <label className="cursor-pointer label">
                <span className="label-text">Privé</span>
                <input type="radio" name="visibility" className="radio" />
              </label>
            </div>
          </div>
          {/* ...etc... */}
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer text-center">
        <p className="text-sm text-gray-500">
          © 2025 Tetris - Make It Works. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
