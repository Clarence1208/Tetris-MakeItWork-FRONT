import { RiDashboardHorizontalFill } from "react-icons/ri";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a href="/home" className="btn btn-ghost text-xl">Tetris - make it works</a>
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
                <button className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                </button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Profile pic"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between" href="/profil">
                                Profile
                            </a>
                        </li>
                        <li><a href="/mode/competition">Tournament mode</a></li>
                        <li>
                            <a
                                onClick={() => {
                                    Cookies.remove("token");
                                    navigate("/auth");
                                }}
                            >
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}