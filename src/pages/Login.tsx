import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { login } from "../utils/apis";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res) {
      setLoginSuccess("ログインに成功しました");
      setLoginError("");
      // Set Cookie
      document.cookie = `jwt=${res.Token}`;
      document.cookie = `username=${res.Username}`;
      const cookies = document.cookie;
      // ホーム画面に遷移
      navigate("/");
      navigate(0);
    } else {
      setLoginSuccess("");
      setLoginError("ログインに失敗しました");
    }
  };

  return (
    <div className="max-w-md m-auto">
      <InputField
        label="メールアドレス"
        onChange={handleChangeEmail}
        value={email}
      />
      <InputField
        label="パスワード"
        onChange={handleChangePassword}
        password={true}
        value={password}
      />
      {loginError && <div className="text-red-500">{loginError}</div>}
      {loginSuccess && <div className="text-green-500">{loginSuccess}</div>}
      <div className="flex justify-end">
        <Button label="ログイン" onClick={handleLogin} className="mt-4" />
      </div>
    </div>
  );
};

export default Login;
