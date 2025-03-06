export default function CustomError({message}: {message: string}) {

    return (
        <div role="alert" className="alert alert-error alert-soft" style={{position: "absolute", top: "8vh", right: "2vw"}}>
            <span>{message}</span>
        </div>
    )
}