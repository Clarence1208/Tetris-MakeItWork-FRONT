import './Profil.css'

type Competence = {
    name: String,
    level: Number,
    image?: String
}

export default function Profil() {
    const competences: Competence[] = [
        { name: "Test", level: 2 },
        { name: "Test2", level: 1 },
    ];    

    return (
        <div className="container">
            <div className="left-section">
                <div className="avatar">
                    <div className="w-32 rounded">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            alt="Avatar"
                        />
                    </div>
                </div>

                <div className="text-container">
                    <p>
                        Nom : Dupont <br />
                        Prénom : Dupont <br />
                        Email : test@gmail.com <br />
                        Numéro : 01234567 <br />
                    </p>
                </div>
            </div>

            <div className="competence-list bg-base-100 rounded-box shadow-md mt-4 p-4">
                <div className="competence-title">Liste des compétences</div>
                <ul className="list">
                    {competences.map((item, index) => (
                        <li key={index} className="list-row flex items-center gap-4 p-2">
                            <div>
                                <img className="size-10 rounded-box" />
                            </div>
                            <div>
                                <div>{item.name}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


