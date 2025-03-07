import {useEffect, useState} from "react";
import "./homepage.css";
import NotificationsList, {FlagNotification} from "../../components/NotificationsList.tsx";
import CustomError from "../../components/CustomError.tsx";
import ErrorBoundary from "../../components/ErrorBoundary.tsx";
import Board from "../../components/Board.tsx";
import BlockForm from "../../components/blockForm/BlockForm.tsx";
import {TetrisShape, KanbanStatus} from "../../types.ts";
import {RiNotification4Fill} from "react-icons/ri";

const initFlagNotifications: FlagNotification = {
  id: "ifr",
  senderId : {
      id: "ek",
      name: "Loriane"
  },
  recipientId : {
      id: "ek",
      name: "Aurélien"
  },
    isActive: true,
    taskId: {
        id: '1',
        name: 'Create UI Components',
        skills: ['React', 'CSS', 'HTML'],
        shape: 'I' as TetrisShape,
        status: 'Todo' as KanbanStatus,
        blockPoints: [],
        description: "Tests",
        company: "Intern"
    },

}
function Homepage() {
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
                return [];
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
        /*getNotifications().then(response => {
            setNotifications(response);
        }).catch(
            error => console.log(error)
        );*/
    }, [])

    return (
        <div className="page-container">
            {openError && <CustomError message={error} handleClose={handleClose} /> }
            <main className="main-layout">
                {/* Colonne gauche */}
                <div className="left-col">
                    <section className="board-personnel">
                            <div className="tetris-board bg-base-100">
                                <ErrorBoundary>
                                    <Board />
                                </ErrorBoundary>
                                <BlockForm />
                            </div>

                    <div className="clear-actions">
                      <button className="btn btn-soft btn-error">Clear Bas</button>
                      <button className="btn btn-soft btn-error ">Clear Milieu</button>
                      <button className="btn btn-soft btn-error">Clear Haut</button>
                    </div>
          </section>
        </div>

                <aside className="right-col bg-base-100">
                    <div className="flex flex-row justify-between">
                        <h2>Notifications</h2>
                        <RiNotification4Fill/>
                    </div>

                    <NotificationsList notifications={notifications} />
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