import './Profil.css';
import { useEffect, useMemo, useState } from "react";
import { SkillService } from "../../services/skillService/SkillService";
import { BoardsService } from "../../services/boardService/BoardsService";



// type Competence = {
//     name: string;
//     level: number;
//     image?: string;
// };

// type Boards = {
//     name: string;
//     nbTaches: number;
// };

export default function Profil() {
    const [competences, setSkills] = useState<{ name: string; imageSrc: string }[]>(
        []
    );
    const [boards, setBoards] = useState<{ name: string }[]>(
        []
    );
    
    const skillService = useMemo(() => new SkillService(), []);
    const boardsService = useMemo(() => new BoardsService(), [])

    useEffect(() => {
    const getSkills = async () => {
        const skills = await skillService.getSkills();
        setSkills(skills);
    };
    getSkills();
    }, [skillService]);

    useEffect(() => {
    const getBoards = async () => {
        const boards = await boardsService.getBoards();
        setBoards(boards);
    };
    getBoards();
    }, [boardsService]);

    const [competencePage, setCompetencePage] = useState(0);
    const [boardPage, setBoardPage] = useState(0);
    const competencesPerPage = 12;
    const boardsPerPage = 5;

    const isCompetencePaginated = competences.length > competencesPerPage;
    const totalCompetencePages = isCompetencePaginated ? Math.ceil(competences.length / competencesPerPage) : 1;
    const displayedCompetences = isCompetencePaginated
        ? competences.slice(competencePage * competencesPerPage, (competencePage + 1) * competencesPerPage)
        : competences;

    const isBoardPaginated = boards.length > boardsPerPage;
    const totalBoardPages = isBoardPaginated ? Math.ceil(boards.length / boardsPerPage) : 1;
    const displayedBoards = isBoardPaginated
        ? boards.slice(boardPage * boardsPerPage, (boardPage + 1) * boardsPerPage)
        : boards;

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
                                <img className="size-10 rounded-box" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                                <div>{item.name}</div>
                            </div>
                        ))}
                    </div>

                    {isCompetencePaginated && (
                        <div className="pagination">
                            <button className="btn btn-outline" onClick={() => setCompetencePage(competencePage - 1)} disabled={competencePage === 0}>
                                Précédent
                            </button>
                            <span>Page {competencePage + 1} / {totalCompetencePages}</span>
                            <button className="btn btn-outline btn-info" onClick={() => setCompetencePage(competencePage + 1)} disabled={competencePage === totalCompetencePages - 1}>
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
                            {/* <p>Nombre de tâches : {bloc..toString()}</p> */}
                        </div>
                    ))}

                    {isBoardPaginated && (
                        <div className="pagination">
                            <button className="btn btn-outline" onClick={() => setBoardPage(boardPage - 1)} disabled={boardPage === 0}>
                                Précédent
                            </button>
                            <span>Page {boardPage + 1} / {totalBoardPages}</span>
                            <button className="btn btn-outline btn-info" onClick={() => setBoardPage(boardPage + 1)} disabled={boardPage === totalBoardPages - 1}>
                                Suivant
                            </button>
                        </div>
                    )}
                </fieldset>
            </div>
        </div>
    );
}
