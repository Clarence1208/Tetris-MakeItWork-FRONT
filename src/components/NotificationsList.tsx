import {RiFlag2Line} from "react-icons/ri";

type NotificationListProps = {
    notificationsReceived: FlagNotification[];
    notificationsSent: FlagNotification[];
}

export type FlagNotification = {
    id: number;
    title: string;
    message: string;
}

export default function NotificationsList({notificationsReceived, notificationsSent}: NotificationListProps) {

    return (
        <div className={"list bg-base-100 rounded-box shadow-md"}>
            <div id="notifications-list" className="list bg-base-100 rounded-box shadow-md">
                {notificationsReceived.map((notification) => (
                   <Notification key={notification.id} notification={notification} />
                ))}
            </div>

            <div id="notifications-sent-list" className="list bg-base-100 rounded-box shadow-md">
                {notificationsReceived.map((notification) => (
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