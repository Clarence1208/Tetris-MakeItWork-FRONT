import './Profil.css'

export default function Profil() {
    return (
        <div className="container">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Avatar"
            className="w-full h-full object cover"
            width={75} height={75} 
            style={{marginLeft : '3vw', marginBottom : '16vh'}}/>
            <p>
                SecondName <br />
                FirstName <br />
                FirstName <br />
                FirstName <br />
                FirstName <br />
                FirstName <br />
            </p>
        </div>
    );
}
