import {RiFlag2Line} from "react-icons/ri";
import {User, Task} from "../types.ts"
import CustomError from "./CustomError.tsx";
import {useState} from "react";

type NotificationListProps = {
    notifications: FlagNotification[];
}

export type FlagNotification = {
    "id": string,
    "isActive": boolean,
    "senderId": User,
    "recipientId": User,
    "taskId": Task
}

export default function NotificationsList({notifications}: NotificationListProps) {

    return (
        <div className={"list rounded-box shadow-md mt-4"}>
            <div id="notifications-list" className="list bg-blend-darken rounded-box shadow-md">
                {notifications.map((notification) => (
                   <Notification key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    )
}

type NotificationProps = {
    notification: FlagNotification;
}

export function Notification({notification}: NotificationProps) {

    const [error, setError] = useState<string>("");
    const [openError, setOpenError] = useState<boolean>(false);

    function handleClose() {
        setOpenError(false);
    }
    async function handleNotificationSeen(
        notification: FlagNotification,
    ){
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/notification/${notification.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({isActive: false})
            });

            if (!response.ok) {
                setError('Failed to create the task :' + response.statusText);
                setOpenError(true);
            }
            const data: any = await response.json();
            return data;
        }catch (error) {
            setError('Failed to create the task' + error);
            setOpenError(true);
            return {};
        }
    }
    return (
        <div className="list-row" onClick={() => handleNotificationSeen}>
            {openError && <CustomError message={error} handleClose={handleClose}/>}
            <div>{notification.taskId.skills[0].name}</div>
            <div>{notification.senderId.name} asked for your help</div>
            <RiFlag2Line fill={notification.isActive ? "green" : "red"} />
        </div>
    )
}