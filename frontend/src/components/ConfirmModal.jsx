import { Headline } from "./Headline";

export const ConfirmModal = ({
  id,
  handleConfirm,
  handleCancel,
  title = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
  dialogRef,
}) => {
  return (
    <dialog id={id} className="modal" ref={dialogRef}>
      <div className="modal-box text-center">
        <h3 className="font-bold text-lg mb-5">{title}</h3>

        <Headline className="mb-8">{title}</Headline>

        <div className="flex gap-2 items-center justify-center">
          <button className="btn btn-success text-base" onClick={handleConfirm}>
            {confirmText}
          </button>

          <button className="btn btn-error text-base" onClick={handleCancel}>
            {cancelText}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop bg-black/20">
        <button>close</button>
      </form>
    </dialog>
  );
};
