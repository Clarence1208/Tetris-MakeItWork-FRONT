import {useEffect, useState} from "react";
import "./homepage.css";
import NotificationsList, {FlagNotification} from "../../components/NotificationsList.tsx";
import CustomError from "../../components/CustomError.tsx";
import ErrorBoundary from "../../components/ErrorBoundary.tsx";
import Board from "../../components/Board.tsx";

const initFlagNotifications = {
  id: 2,
  title: "NestJS",
  message: "A user asked for your HELP",
}
function Homepage() {
    const [selectedTab, setSelectedTab] = useState<"tasks" | "notifications">("tasks");
    const [error, setError] = useState<string>("");
    const [notifications, setNotifications] = useState<FlagNotification[]>([initFlagNotifications, initFlagNotifications]);
    const [openError, setOpenError] = useState(false);
    function handleClose() {
        setOpenError(false);
    }
    async function getNotifications():Promise<FlagNotification[]> {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/notifications`, {
                method: 'GET',
            });

            if (!response.ok) {
                setError('Failed to get notifications :' + response.statusText);
                setOpenError(true);
            }
            const data: any = await response.json();
            return data;
        }catch (error) {
            setError('Failed to get notifications' + error);
           setOpenError(true);
            return [];
        }
    }

    useEffect(() => {
        getNotifications().then(response => {
            setNotifications(response);
        }).catch(
            error => console.log(error)
        );
    }, [])

  return (
      <div className="page-container">
          {openError && <CustomError message={error} handleClose={handleClose} /> }
          <main className="main-layout">
              {/* Colonne gauche */}
              <div className="left-col">
                  <section className="board-personnel">
                      <h2 className="section-title">Board personnel</h2>

                      {/* Row : Tetris Board (gauche) + colonne (Bouton aide + Compétences) */}
                      <div className="board-row">
                          <div className="tetris-board">
                              <ErrorBoundary>
                                  <Board/>
                              </ErrorBoundary>
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
                          <button className="btn btn-soft btn-error">Clear Bas</button>
                          <button className="btn btn-soft btn-error ">Clear Milieu</button>
                          <button className="btn btn-soft btn-error">Clear Haut</button>
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