import { useState, useEffect } from "react";

export default function Menu(props) {
  const [validationResult, setValidationResult] = useState("");
  const [forgotPWMail, setForgotPWMail] = useState("");
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  useEffect(() => {
    if (props.menuContent === "Login" && props.displayPWButton) {
      // keep the "Forgot Password" button with the correct email if an associated username remains in the username input of the login form between renders; may be subject to change
      renderForgotPWButton(null, props.loginData.username);
    }
  }, [props.menuContent]);

  // send "formData" object to web server for user registration and login
  async function sendUserData(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const userURL =
        props.menuContent !== "Settings"
          ? `${serverRoot}/users/${props.menuContent.toLowerCase()}-user`
          : "";
      const response = await fetch(userURL, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      processResult(result);
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  // determine user registration and login UI output and data processing
  function processResult(result) {
    switch (Object.keys(result)[0]) {
      case "valErrors":
        // display registration validation errors
        setValidationResult(() => {
          return result.valErrors.map((v) => {
            return <div key={v.msg}>{v.msg}</div>;
          });
        });
        break;
      // display simple registration and login (validation error) messages
      case "registrationSuccess":
        setValidationResult("");
        props.changeStatusMessage(result.registrationSuccess);
        break;
      case "loginData":
        setValidationResult("");
        props.loginUser(result);
        break;
      default:
        props.changeStatusMessage(result.error);
    }
  }

  // display the "Forgot Password" button in the login form if a valid user name is entered into the username input
  async function renderForgotPWButton(e, username) {
    try {
      const emailParam = e ? e.target.value : username;
      const mailUrl = `${serverRoot}/users/forgot-password?user=${emailParam}`;
      const response = await fetch(mailUrl);
      const result = await response.json();
      if (result.email) {
        setForgotPWMail(result.email);
        props.setDisplayPWButton(true);
      } else {
        setForgotPWMail("");
        props.setDisplayPWButton(false);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  // send a message with a link to a password reset route to the user's email address when clicking on the "Forgot Password" button
  async function sendForgotPWMail() {
    try {
      const pwUrl = `${serverRoot}/users/send-mail?email=${forgotPWMail}`;
      const response = await fetch(pwUrl);
      const result = await response.json();
      props.changeStatusMessage(result.success ? result.success : result.error);
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  return (
    <>
      <h1>{props.menuContent}</h1>
      <form
        onSubmit={(e) => {
          sendUserData(e);
        }}
      >
        {props.menuContent === "Register" ? (
          <>
            <label htmlFor="username">Username: </label>
            <input
              onChange={(e) => {
                props.setRegisterData({
                  ...props.registerData,
                  [e.target.name]: e.target.value,
                });
              }}
              type="text"
              id="username"
              name="username"
              placeholder="type in a username..."
              value={props.registerData.username}
              required
            />
            <br />
            <label htmlFor="email">Email: </label>
            <input
              onChange={(e) => {
                props.setRegisterData({
                  ...props.registerData,
                  [e.target.name]: e.target.value,
                });
              }}
              type="email"
              id="email"
              name="email"
              placeholder="type in an email..."
              value={props.registerData.email}
              required
            />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              onChange={(e) => {
                props.setRegisterData({
                  ...props.registerData,
                  [e.target.name]: e.target.value,
                });
              }}
              type="password"
              id="password"
              name="password"
              placeholder="type in a password..."
              value={props.registerData.password}
              required
            />
            <br />
          </>
        ) : props.menuContent === "Login" ? (
          <>
            <label htmlFor="username">Username: </label>
            <input
              onChange={(e) => {
                renderForgotPWButton(e, null);
                props.setLoginData({
                  ...props.loginData,
                  [e.target.name]: e.target.value,
                });
              }}
              type="text"
              id="username"
              name="username"
              placeholder="type in a username..."
              value={props.loginData.username}
              required
            />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              onChange={(e) => {
                props.setLoginData({
                  ...props.loginData,
                  [e.target.name]: e.target.value,
                });
              }}
              type="password"
              id="password"
              name="password"
              placeholder="type in a password..."
              value={props.loginData.password}
              required
            />
            <br />
            {props.displayPWButton ? (
              <input
                onClick={sendForgotPWMail}
                type="button"
                value="Forgot Password"
              />
            ) : (
              ""
            )}
            <br />
          </>
        ) : (
          <>
            <label htmlFor="color-primary">Change main color: </label>
            <input
              onChange={(e) =>
                props.setSettingsData({
                  ...props.settingsData,
                  colorPrimary: e.target.value,
                })
              }
              type="color"
              id="color-primary"
              name="color-primary"
              value={props.settingsData.colorPrimary}
            />
            <br />
            <label htmlFor="color-secondary">Change secondary color: </label>
            <input
              onChange={(e) =>
                props.setSettingsData({
                  ...props.settingsData,
                  colorSecondary: e.target.value,
                })
              }
              type="color"
              id="color-secondary"
              name="color-secondary"
              value={props.settingsData.colorSecondary}
            />
            <br />
            {/*
              experimental language setting option that may be dropped from the final version of the app 
            */}
            <label htmlFor="language">Change user language: </label>
            <select
              onChange={(e) =>
                props.setSettingsData({
                  ...props.settingsData,
                  appLanguage: e.target.value,
                })
              }
              id="language"
              value={props.settingsData.appLanguage}
            >
              <option value="english">English</option>
              <option value="german">German</option>
            </select>
            <br />
          </>
        )}
        {props.menuContent !== "Settings" ? (
          <input type="submit" value="Send Data" />
        ) : (
          <></>
        )}
      </form>
      {/*
        display validation error messages
      */}
      {validationResult}
    </>
  );
}
