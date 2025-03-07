export default function CustomError({message, handleClose}: {message: string, handleClose: () => void}) {

    return (
            <div role="alert" className="alert alert-error alert-soft"
                 style={{position: "absolute", top: "8vh", right: "2vw", zIndex: 100}}>
                <span>{message}</span>
                <div>
                    <button className="btn btn-sm" onClick={handleClose}>Deny</button>
                </div>
            </div>
    )
}