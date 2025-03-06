import {Task} from "../../types.ts";
import {useEffect, useState} from "react";
import CustomError from "../CustomError.tsx";
import Cookies from "js-cookie";

type User = {
    id: string;
    name: string;
}

type NotificationResponse = {
    "id": string,
    "isActive": boolean,
    "senderId": User,
    "recipientId": User,
    "taskId": Task
}

type HelpersProps = {
    taskId: string;
}
export const PotentialHelpersList = ({taskId}: HelpersProps) => {

    const [mightHelpPeople, setMightHelpPeople] = useState<User[]>([{id: "a1b2", name: "Hollow Knight"}, {id: "a1b2", name: "Boollow Knight"}]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openErrpr, setOpenErrpr] = useState<boolean>(false);

    async function getMightHelpPeople() {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const token = Cookies.get("clientToken");


        try{
            const response =await fetch(`${API_URL}/users/recommended?taskId=`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok){
                setError(response.statusText);
                setOpenErrpr(true)
                return []
            }

            const users = await response.json();
            return users;

        }catch(error){
            setError("Error: " + error);
            setOpenErrpr(true)
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    }

    async function askForHelp(recipientId: string, taskId: string): Promise<NotificationResponse | null>{
        const API_URL = import.meta.env.VITE_API_URL;
        const token = Cookies.get("clientToken");
        const body = {
            "taksId": taskId,
            "recipientId": recipientId,
        }
        try{
            const response =await fetch(`${API_URL}/notification`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if(!response.ok){
                setError(response.statusText);
                setOpenErrpr(true)
                return null
            }

            const notification = await response.json();
            return notification;

        }catch(error){
            setError("Error: " + error);
            setOpenErrpr(true)
            console.log(error);
            return null
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getMightHelpPeople().then((data) => setMightHelpPeople(data));
    }, [])

    if (isLoading) {
        return (
            <div className="flex w-60 gap-4 mt-4">
                <CustomError message={error} />
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            </div>
        )
    }
    if ( !isLoading && mightHelpPeople.length === 0) {
        return (
            <div className="mt-4 flex flex-col justify-center items-center gap-5">
                <CustomError message={error} />
                <img className="w-60" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExazd0eDJpZThiaDRyaG45ZWZiNHh6MjN4a2FjNm45dGw5aDd3MTdtcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H6cmWzp6LGFvqjidB7/giphy.gif"/>
                <span>You are alone</span>
            </div>
        )
    }
    return (
        <div className="mt-4">
            <CustomError message={error} />
            {/*<button className="btn btn-primary">Ask for someone's help</button>*/}
            {mightHelpPeople.map((user) => (
                <div className="indicator m-4" onClick={()=>askForHelp(user.id, taskId)}>
                    <span className="indicator-item badge badge-xs badge-secondary">
                        <div className="indicator-item indicator-bottom">
                        </div>
                    </span>
                    <div
                        className=" avatar avatar-placeholder ring-primary rounded-full ring-offset-base-100 ring ring-offset-1">
                        <div className="bg-neutral text-neutral-content w-16 rounded-full">
                            <span className="text-xl">{user.name[0]}</span>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}

type ModalProps = {
    task: Task;
}
export const TaskModal = ({task}: ModalProps) => {
    return (
        <>
            <dialog id="task-modal" className="modal" >
                <div className="modal-box">
                    <p className="font-bold text-3xl">Title: {task.name}</p>
                    <h4 className="py-4">Description: {task.description}</h4>

                    <h4>Main skills: </h4>
                    <div className="flex flex-wrap items-center justify-start gap-5">
                    {task.skills?.map((skill) => (
                        <div key={skill} className="mt-3">
                            <img className="size-10 rounded-box"
                                 src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                            <div>skill</div>
                        </div>
                    ))}
                    </div>

                    <div className="divider"></div>

                    <h4 className="font-bold text-lg">People who might help: </h4>
                    <p className="text-xs">Clicking on a user avatar will send them a notification (yes, you can spam them).</p>
                    <PotentialHelpersList taskId={task.id} />

                    <div className="modal-action">
                        <form method="dialog">
                        <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};
