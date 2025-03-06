import { ReactNode, useRef } from "react";

type Props = {
  buttonText: string;
  dialogTitle?: string;
  children: ReactNode;
};

export const Modal = ({
  buttonText,
  dialogTitle = undefined,
  children,
}: Props) => {
  const modalRef = useRef(null);

  return (
    <>
      <button
        className="btn"
        onClick={() => {
          (
            modalRef?.current as unknown as { showModal: () => void }
          ).showModal();
        }}
      >
        {buttonText}
      </button>
      <dialog className="modal" ref={modalRef}>
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
