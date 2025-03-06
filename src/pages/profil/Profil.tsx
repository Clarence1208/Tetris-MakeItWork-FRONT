import { useState } from 'react';
import './Profil.css';

type Competence = {
    name: string;
    level: number;
    image?: string;
};

type Boards = {
    name: string;
    nbTaches: number;
};

export default function Profil() {
    const competences: Competence[] = [
        { name: "React", level: 3 },
        { name: "TypeScript", level: 2 },
        { name: "Node.js", level: 3 },
        { name: "MongoDB", level: 2 },
        { name: "GraphQL", level: 1 },
        { name: "Docker", level: 2 },
        { name: "Angular", level: 3 },
        { name: "Vue.js", level: 2 },
        { name: "Java", level: 3 },
        { name: "Python", level: 2 },
        { name: "C#", level: 1 },
        { name: "Kotlin", level: 2 },
        { name: "Swift", level: 2 },
        { name: "PHP", level: 2 },
        { name: "Ruby", level: 1 },
    ];    

    const blocs: Boards[] = [
        { name: "Projet A", nbTaches: 4 },
        { name: "Projet B", nbTaches: 7 },
        { name: "Projet C", nbTaches: 5 },
        { name: "Projet D", nbTaches: 6 },
        { name: "Projet E", nbTaches: 4 },
        { name: "Projet F", nbTaches: 3 },
        { name: "Projet G", nbTaches: 8 },
        { name: "Projet H", nbTaches: 2 },
        { name: "Projet I", nbTaches: 6 },
        { name: "Projet J", nbTaches: 4 },
        { name: "Projet K", nbTaches: 7 },
        { name: "Projet L", nbTaches: 5 },
        { name: "Projet M", nbTaches: 6 },
        { name: "Projet N", nbTaches: 4 },
        { name: "Projet O", nbTaches: 3 },
        { name: "Projet P", nbTaches: 8 },
    ];   

    const [competencePage, setCompetencePage] = useState(0);
    const [boardPage, setBoardPage] = useState(0);
    const competencesPerPage = 12;
    const boardsPerPage = 5;

    const isCompetencePaginated = competences.length > competencesPerPage;
    const totalCompetencePages = isCompetencePaginated ? Math.ceil(competences.length / competencesPerPage) : 1;
    const displayedCompetences = isCompetencePaginated
        ? competences.slice(competencePage * competencesPerPage, (competencePage + 1) * competencesPerPage)
        : competences;

    const isBoardPaginated = blocs.length > boardsPerPage;
    const totalBoardPages = isBoardPaginated ? Math.ceil(blocs.length / boardsPerPage) : 1;
    const displayedBoards = isBoardPaginated
        ? blocs.slice(boardPage * boardsPerPage, (boardPage + 1) * boardsPerPage)
        : blocs;

    return (
        <div className="container">
            <div className="left-container">
                <div className="left-section">
                    <div className="avatar">
                        <div className="w-32 rounded">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                alt="Avatar"
                            />
                        </div>
                    </div>

                    <div className="text-container">
                        <p>
                            Nom : Dupont <br />
                            Prénom : Dupont <br />
                            Email : test@gmail.com <br />
                            Numéro : 01234567 <br />
                        </p>
                    </div>
                </div>

                <div className="competence-list bg-base-100 rounded-box shadow-md mt-4 p-4">
                    <div className="competence-title">Liste des compétences</div>
                    <div className="list">
                        {displayedCompetences.map((item, index) => (
                            <div key={index} className="list-item">
                                <img className="size-10 rounded-box" />
                                <div>{item.name}</div>
                            </div>
                        ))}
                    </div>

                    {isCompetencePaginated && (
                        <div className="pagination">
                            <button onClick={() => setCompetencePage(competencePage - 1)} disabled={competencePage === 0}>
                                Précédent
                            </button>
                            <span>Page {competencePage + 1} / {totalCompetencePages}</span>
                            <button onClick={() => setCompetencePage(competencePage + 1)} disabled={competencePage === totalCompetencePages - 1}>
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bloc_details">
                <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                    <legend className="fieldset-legend">Boards</legend>
                    {displayedBoards.map((bloc, index) => (
                        <div key={index}>
                            <p>{bloc.name}</p>
                            <p>Nombre de tâches : {bloc.nbTaches.toString()}</p>
                        </div>
                    ))}

                    {isBoardPaginated && (
                        <div className="pagination">
                            <button onClick={() => setBoardPage(boardPage - 1)} disabled={boardPage === 0}>
                                Précédent
                            </button>
                            <span>Page {boardPage + 1} / {totalBoardPages}</span>
                            <button onClick={() => setBoardPage(boardPage + 1)} disabled={boardPage === totalBoardPages - 1}>
                                Suivant
                            </button>
                        </div>
                    )}
                </fieldset>
            </div>
        </div>
    );
}
