import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit!", { username, password });
    if (username && password) {
      navigate("/");
    }
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-8 rounded-2xl text-center w-full max-w-md shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {t("login.title")}
      </h1>
      <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-100 mx-auto mb-4 rounded" />
      <p className="text-sm text-gray-500 mb-6">
        {t("login.welcome")} <br />
        <span className="text-blue-500 hover:underline cursor-pointer">
          {t("login.forgot_password")}
        </span>
      </p>

      <form className="text-left" onSubmit={handleSubmit}>
        <label className="text-gray-600 text-sm">{t("login.username")}</label>
        <input
          type="text"
          className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-400 py-2 mb-6"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-gray-600 text-sm">{t("login.password")}</label>
        <input
          type="password"
          className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-400 py-2 mb-8"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 hover:brightness-120 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2"
        >
          <span>{t("login.continue")}</span>
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
