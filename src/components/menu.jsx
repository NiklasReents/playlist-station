export default function Menu({ menuContent }) {
  // placeholder/test code
  return (
    <>
      <h1>{menuContent}</h1>
      <form
        onSubmit={async (e) => {
          //e.preventDefault();
        }}
        action={
          menuContent !== "Settings"
            ? `http://localhost:3000/users/` +
              menuContent.toLowerCase() +
              "-user"
            : ""
        }
        method="POST"
      >
        {menuContent === "Register" ? (
          <>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="type in a username..."
              required
            />
            <br />
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="type in an email..."
              required
            />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="type in a password..."
              required
            />
            <br />
          </>
        ) : menuContent === "Login" ? (
          <>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="type in a username..."
              required
            />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="type in a password..."
              required
            />
            <br />
            <input type="button" value="Forgot Password" />
            <br />
          </>
        ) : (
          <>
            <label htmlFor="color-main">Change main color: </label>
            <input type="color" id="color-main" name="color-main" />
            <br />
            <label htmlFor="color-secondary">Change secondary color: </label>
            <input type="color" id="color-secondary" name="color-secondary" />
            <br />
            {/*
              experimental language setting option that may be dropped from the final version of the app 
            */}
            <label htmlFor="language">Change user language: </label>
            <select id="language">
              <option value="english">English</option>
              <option value="german">German</option>
            </select>
            <br />
          </>
        )}
        <input type="submit" value="Send Data" />
      </form>
    </>
  );
}
