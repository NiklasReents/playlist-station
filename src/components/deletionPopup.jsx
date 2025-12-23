export default function DeletionPopup(props) {
  return (
    <div className="deletion-popup">
      <h3>Do you really want to delete this {props.confirmationMessage}?</h3>
      <br />
      <div>
        <button
          onClick={() => {
            props.deleteObject();
            props.setDisplayDeletionPopup(false);
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            props.setDisplayDeletionPopup(false);
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}
