import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AuthService } from "../../services/authService/AuthService";

export const RegisterForm = ({
  setTab,
}: {
  setTab: Dispatch<
    SetStateAction<{
      login: boolean;
      register: boolean;
    }>
  >;
}) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const authService = useMemo(() => new AuthService(), []);

  const onRegisterClick = async () => {
    await authService.register(registerData);
    setTab({
      login: true,
      register: false,
    });
  };

  const onInputChange = (key: string, value: string) => {
    setRegisterData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Register</legend>

        <label className="fieldset-label">Name</label>
        <input
          type="text"
          className="input"
          placeholder="Name"
          onChange={(e) => onInputChange("name", e.target.value)}
        />

        <label className="fieldset-label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          onChange={(e) => onInputChange("email", e.target.value)}
        />

        <label className="fieldset-label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={(e) => onInputChange("password", e.target.value)}
        />

        <button
          style={{
            backgroundColor: "#1a1a1a",
          }}
          className="btn btn-neutral mt-4"
          onClick={onRegisterClick}
        >
          Register
        </button>
      </fieldset>
    </div>
  );
};
