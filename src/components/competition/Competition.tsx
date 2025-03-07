import "./../../App.css"
import Board from "../Board.tsx";
import {RiTeamFill, RiTimerFlashFill} from "react-icons/ri";
export default function Competition() {
    return (
        <div className="flex flex-col main-layout">
        <h1>Turnament mode </h1>
        <h4>Team against team, who will be the first one to finish all the tasks ?</h4>
        <div className="flex flex-row justify-between ">
            <div className="flex bg-base-100 tetris-board ">
                <Board key="new"/>
                <div className="divider divider-horizontal divider-primary">VS</div>
                <Board key="new"/>
            </div>

        <div className="flex-col flex gap-5 right-col">
            <aside className="bg-base-100 rounded-sm p-2">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl">Teams details</h2>
                    <RiTeamFill/>
                </div>
                <p>The Avengers</p>
                <p>The Stones</p>
            </aside>
            <aside className="bg-base-100 rounded-sm p-2">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl">Time Left</h2>
                    <RiTimerFlashFill/>
                </div>
                <p>00:15:28</p>
                <button className="btn bg-info btn-outline mt-3">Reset</button>
            </aside>

        </div>
    </div>
        </div>
)
}