import {RiFlag2Line} from "react-icons/ri";
import {User, Task} from "../types.ts"

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
    return (
        <div className="list-row">
            <div>{notification.taskId.skills[0]}</div>
            <div>{notification.senderId.name} asked for your help</div>
            <RiFlag2Line />
        </div>
    )
}