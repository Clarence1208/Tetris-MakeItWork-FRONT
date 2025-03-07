import { useMemo, useState } from "react";
import { AuthService } from "../../services/authService/AuthService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const authService = useMemo(() => new AuthService(), []);

  const onLoginClick = async () => {
    const data = await authService.login(loginData);
    Cookies.set("token", data?.access_token);
    navigate("/");
  };

  const onInputChange = (key: string, value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Login</legend>
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
          onClick={onLoginClick}
        >
          Login
        </button>
      </fieldset>
    </div>
  );
};
