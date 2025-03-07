import {Task, User} from "../../types.ts";
import {useEffect, useState} from "react";
import CustomError from "../CustomError.tsx";
import Cookies from "js-cookie";

type NotificationResponse = {
    "id": string,
    "isActive": boolean,
    "senderId": User,
    "recipientId": User,
    "taskId": Task
}

type HelpersProps = {
    task: Task;
}
export const PotentialHelpersList = ({task}: HelpersProps) => {

    const [mightHelpPeople, setMightHelpPeople] = useState<User[]>([{id: "9397ff93-b33f-4532-985f-521b74a18fd7", name: "feruhi"}]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openErrpr, setOpenErrpr] = useState<boolean>(false);

    async function getMightHelpPeople() {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5Mzk3ZmY5My1iMzNmLTQ1MzItOTg1Zi01MjFiNzRhMThmZDciLCJuYW1lIjoiQXVyZWxpZW4iLCJlbWFpbCI6ImFAZ21haWwuY29tIiwiaWF0IjoxNzQxMzM3MDYxLCJleHAiOjQ4OTcwOTcwNjF9.dLvDVsOneZ6S_mSy_wbJmERYuh2LfnH7Xoz_eEJ4DaQ";

        try{
            const response =await fetch(`${API_URL}/users/skills-weight`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    skillId: task.skills[0].id,
                    limit: 3,
                })
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
            return []
        }finally {
            setIsLoading(false);
        }
    }

    async function askForHelp(recipientId: string, task: Task): Promise<NotificationResponse | null>{
        const API_URL = import.meta.env.VITE_API_URL;
        //const token = Cookies.get("clientToken");
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5Mzk3ZmY5My1iMzNmLTQ1MzItOTg1Zi01MjFiNzRhMThmZDciLCJuYW1lIjoiQXVyZWxpZW4iLCJlbWFpbCI6ImFAZ21haWwuY29tIiwiaWF0IjoxNzQxMzM3MDYxLCJleHAiOjQ4OTcwOTcwNjF9.dLvDVsOneZ6S_mSy_wbJmERYuh2LfnH7Xoz_eEJ4DaQ";

        const body = {
            "taksId": "28adf9ea-169a-4017-8548-77f6ad233495",
            "recipientId": "9397ff93-b33f-4532-985f-521b74a18fd7",
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

    function handleClose() {
        setOpenErrpr(false);
    }

    useEffect(() => {
        //getMightHelpPeople().then((data) => setMightHelpPeople(data));
    }, [])

    if (isLoading) {
        return (
            <div className="flex w-60 gap-4 mt-4">
                { openErrpr && <CustomError message={error} handleClose={handleClose} />}
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            </div>
        )
    }
    if ( !isLoading && mightHelpPeople.length === 0) {
        return (
            <div className="mt-4 flex flex-col justify-center items-center gap-5">
                {openErrpr &&  <CustomError message={error} handleClose={handleClose} />}
                <img className="w-60" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExazd0eDJpZThiaDRyaG45ZWZiNHh6MjN4a2FjNm45dGw5aDd3MTdtcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H6cmWzp6LGFvqjidB7/giphy.gif"/>
                <span>You are alone</span>
            </div>
        )
    }
    return (
        <div className="mt-4">
            {openErrpr && <CustomError message={error} handleClose={handleClose} />}
            {/*<button className="btn btn-primary">Ask for someone's help</button>*/}
            {mightHelpPeople.map((user) => (
                <div className="indicator m-4" onClick={()=>askForHelp(user.id, task)}>
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
    console.log(task);
    return (
        <>
            <dialog id={`task-modal-${task.name}`} className="modal" >
                <div className="modal-box">
                    <p className="font-bold text-3xl">Title: {task.name}</p>
                    <h4 className="py-4">Description: {task.description}</h4>

                    <h4>Main skills: </h4>
                    <div className="flex flex-wrap items-center justify-start gap-5">
                    {task.skills?.map((skill) => (
                        <div key={skill.name} className="mt-3">
                            <img className="size-10 rounded-box"
                                 src={skill.image}/>
                            <div>skill</div>
                        </div>
                    ))}
                    </div>

                    <div className="divider"></div>

                    <h4 className="font-bold text-lg">People who might help: </h4>
                    <p className="text-xs">Clicking on a user avatar will send them a notification (yes, you can spam them).</p>
                    <PotentialHelpersList task={task} />

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
