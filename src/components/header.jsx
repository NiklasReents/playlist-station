export default function Header({
  viewButton,
  popupImage,
  popupList,
  username,
  toggleView,
  togglePopupMenu,
}) {
  return (
    <header>
      <div>
        <img onClick={toggleView} src={viewButton} alt="chevron" />
      </div>
      <div>
        <div>Welcome, {username}</div>
        <select>
          <option>Default</option>
        </select>
      </div>
      <div>
        <img onClick={togglePopupMenu} src={popupImage} alt="menu" />
        {popupList}
      </div>
    </header>
  );
}
