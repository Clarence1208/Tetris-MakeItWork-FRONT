import "./homepage.css";
<<<<<<< HEAD
import BlockForm from "../../components/blockForm/BlockForm";

function Homepage() {
  return (
    <div className="page-container">
      <main className="main-layout">
        <div className="left-col">
          <section className="board-personnel">
            <h2 className="section-title">Board personnel</h2>

            <div className="board-row">
              {/* Tetris à gauche */}
              <div className="tetris-board">
                <p>Ici se trouve le board Tetris statique.</p>
              </div>

              {/* Formulaire à droite */}
              <div className="block-form-container">
                <BlockForm />
              </div>
            </div>

            {/* Boutons Clear */}
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
=======
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
>>>>>>> main
}

export default Homepage;
