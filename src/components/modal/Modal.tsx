import { ReactNode } from "react";

type Props = {
  buttonText: string;
  dialogTitle?: string;
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({
  open,
  setOpen,
  buttonText,
  dialogTitle = undefined,
  children,
}: Props) => {
  return (
    <>
      <button
        style={{
          color: "white",
        }}
        className="btn"
        onClick={() => setOpen(true)}
      >
        {buttonText}
      </button>
      <dialog className="modal" open={open}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{dialogTitle}</h3>
          <p className="py-4">{children}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};
