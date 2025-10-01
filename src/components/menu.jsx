export default function Menu({ menuContent }) {
  // placeholder/test code
  return (
    <form>
      Menu:{" "}
      {menuContent === "Register"
        ? "Register"
        : menuContent === "Login"
        ? "Login"
        : "Settings"}
    </form>
  );
}
