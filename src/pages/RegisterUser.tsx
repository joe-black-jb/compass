import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { registerUser } from "../utils/apis";

const RegisterUser = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [registerSuccess, setRegisterSuccess] = useState<string>("");
  const [isPassword, setIsPassword] = useState<boolean>(true);

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleRegisterUser = async () => {
    if (password !== confirmPassword) {
      console.log("パスワードが一致していません");
      setConfirmPasswordError("パスワードが一致していません");
      setRegisterSuccess("");
      return;
    }

    setConfirmPasswordError("");
    setRegisterSuccess("ユーザの新規登録が完了しました");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    const res = await registerUser(username, email, password);
    return;
  };

  return (
    <div className="max-w-md m-auto">
      <InputField
        label="ユーザ名"
        onChange={handleChangeUsername}
        value={username}
      />
      <InputField
        label="メールアドレス"
        onChange={handleChangeEmail}
        value={email}
      />
      <InputField
        label="パスワード"
        onChange={handleChangePassword}
        password={isPassword}
        value={password}
      />
      <InputField
        label="パスワード（確認用）"
        onChange={handleChangeConfirmPassword}
        password={isPassword}
        value={confirmPassword}
      />
      {confirmPasswordError && (
        <div className="text-red-500">{confirmPasswordError}</div>
      )}
      {registerSuccess && (
        <div className="text-green-500">{registerSuccess}</div>
      )}
      <div className="flex justify-end">
        <Button
          label="新規登録"
          onClick={handleRegisterUser}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default RegisterUser;
