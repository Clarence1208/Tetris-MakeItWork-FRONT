import { useState } from "react";
import "./homepage.css";
import NotificationsList, {FlagNotification} from "../../components/NotificationsList.tsx";

const initFlagNotifications = {
  id: 2,
  title: "NestJS",
  message: "A user asked for your HELP",
}
function Homepage() {
  const [selectedTab, setSelectedTab] = useState<"tasks" | "notifications">("tasks");

  const [notifications, setNotifications] = useState<FlagNotification[]>([initFlagNotifications, initFlagNotifications]);
  return (
    <div className="page-container">
      <main className="main-layout">
        {/* Colonne gauche */}
        <div className="left-col">
          <section className="board-personnel">
            <h2 className="section-title">Board personnel</h2>

            {/* Row : Tetris Board (gauche) + colonne (Bouton aide + Compétences) */}
            <div className="board-row">
              <div className="tetris-board">
                <p>Ici se trouve le board Tetris statique.</p>
              </div>

              {/* Colonne verticale : bouton Demande aide en haut, Compétences en bas */}
              <div className="vertical-col">
                <button className="btn-demande-aide">Demande aide</button>
                <div className="competences">
                  <h3>Compétences</h3>
                  <p>Informations sur les compétences...</p>
                </div>
              </div>
            </div>

            {/* Boutons Clear en dessous */}
            <div className="clear-actions">
              <button className="btn-clear">Clear Bas</button>
              <button className="btn-clear">Clear Milieu</button>
              <button className="btn-clear">Clear Haut</button>
            </div>
          </section>
        </div>

        {/* Colonne droite : bande Tâches/Notifications */}
        <aside className="right-col sidebar">
          <div className="tab-bar">
            <div
              className={`tab ${selectedTab === "tasks" ? "active" : ""}`}
              onClick={() => setSelectedTab("tasks")}
            >
              Tâches
            </div>
            <div
              className={`tab ${selectedTab === "notifications" ? "active" : ""}`}
              onClick={() => setSelectedTab("notifications")}
            >
              Notifications
            </div>
          </div>

          {selectedTab === "tasks" ? (
            <div className="taches">
              <h2>Tâches</h2>
              <p>Liste des tâches...</p>
            </div>
          ) : (
            <div className="notifications">
              <h2>Notifications</h2>
              <NotificationsList notifications={notifications} />
            </div>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Footer – Informations complémentaires</p>
      </footer>
    </div>
  );
}

export default Homepage;