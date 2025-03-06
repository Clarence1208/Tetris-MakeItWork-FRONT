import {useState} from "react";
import "./homepage.css";
import ErrorBoundary from "../../components/ErrorBoundary.tsx";
import Board from "../../components/Board.tsx";

function Homepage() {
    const [selectedTab, setSelectedTab] = useState<"tasks" | "notifications">("tasks");

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
                            <p>Liste des notifications...</p>
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