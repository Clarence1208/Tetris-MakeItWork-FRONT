import {RiFlag2Line} from "react-icons/ri";

type NotificationListProps = {
    notifications: FlagNotification[];
}

export type FlagNotification = {
    id: number;
    title: string;
    message: string;
}

export default function NotificationsList({notifications}: NotificationListProps) {

    return (
        <div className={"list bg-base-100 rounded-box shadow-md"}>
            <div id="notifications-list" className="list bg-base-100 rounded-box shadow-md">
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
            <div>{notification.title}</div>
            <div>{notification.message}</div>
            <RiFlag2Line />
        </div>
    )
}