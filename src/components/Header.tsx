import {RiDashboardHorizontalFill} from "react-icons/ri";
export default function Header() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a href="/" className="btn btn-ghost text-xl">Tetris - make it works</a>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <a href="/dashboards">
                            <div className="indicator" title="Tetris dashboards">
                                <RiDashboardHorizontalFill className="h-5 w-5" />
                            </div>
                        </a>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Profile pic"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}