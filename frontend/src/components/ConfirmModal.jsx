export const ConfirmModal = ({
  id,
  handleConfirm,
  handleCancel,
  title = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box text-center">
        <h3 className="font-bold text-lg mb-5">{title}</h3>

        <div className="flex gap-2 items-center justify-center">
          <button className="btn btn-secondary" onClick={handleConfirm}>
            {confirmText}
          </button>

          <button className="btn btn-secondary" onClick={handleCancel}>
            {cancelText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
