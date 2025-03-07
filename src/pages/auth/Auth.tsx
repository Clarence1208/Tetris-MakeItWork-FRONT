import { useState } from "react";
import { LoginForm } from "../../components/loginForm/LoginForm";
import { RegisterForm } from "../../components/registerForm/RegisterForm";

export const Auth = () => {
  const [tab, setTab] = useState({
    register: false,
    login: true,
  });

  return (
    <div className="tabs tabs-lift">
      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Register"
        checked={tab.register}
        onChange={() => {
          if (!tab.register) {
            setTab({
              register: true,
              login: false,
            });
          }
        }}
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
          <RegisterForm setTab={setTab} />
        </fieldset>
      </div>
      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Login"
        checked={tab.login}
        onChange={() => {
          if (!tab.login) {
            setTab({
              register: false,
              login: true,
            });
          }
        }}
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        <LoginForm />
      </div>
    </div>
  );
};
