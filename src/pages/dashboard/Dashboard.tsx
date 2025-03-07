import "./Dashboard.css"; // Le fichier CSS dans lequel on mettra nos classes .dashboard-...

export default function Dashboard(): JSX.Element {
  return (
    <div className="dashboard-page mx-auto p-4">
      {/* Section supérieure : Création & Recherche */}
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
                />
                <button className="dashboard-btn-search btn btn-primary">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section inférieure : Configuration du Tetris */}
      <div className="dashboard-config card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title">Configurer son Tetris</h2>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Choisir un Tetris :</span>
            </label>
            <select className="dashboard-select select select-bordered w-full">
              <option>Tetris 1</option>
              <option>Tetris 2</option>
              {/* Ajouter d'autres options dynamiques si besoin */}
            </select>
          </div>
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
          <div className="form-control mt-4 dashboard-invite">
            <label className="label">
              <span className="label-text">Ajouter une personne :</span>
            </label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nom ou email"
                className="dashboard-input input input-bordered"
              />
              <button className="dashboard-btn-add btn btn-outline">
                Ajouter
              </button>
            </div>
          </div>
          <div className="form-control mt-6">
            <button className="dashboard-btn-save btn btn-warning">
              Enregistrer
            </button>
          </div>
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
