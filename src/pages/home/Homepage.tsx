import "./homepage.css";
import ErrorBoundary from "../../components/ErrorBoundary.tsx";
import Board from "../../components/Board.tsx";
import BlockForm from "../../components/blockForm/BlockForm.tsx";

function Homepage() {
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
                                    <Board />
                                </ErrorBoundary>
                            </div>

                            {/* Formulaire à droite */}
                            <div className="block-form-container">
                                <BlockForm />
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
                {/* Colonne droite Notifications */}
                <aside className="right-col sidebar">
                    <h2>Notifications</h2>
                    <p>Liste des notifs...</p>
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
