import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { postBody } from "../helpers"; // ✅ แก้ path ตามโปรเจกต์

interface LoginResponse {
  access: string;
  refresh: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // mutation สำหรับ login
  const { mutate, isPending } = useMutation<
    LoginResponse,
    Error,
    { username: string; password: string }
  >({
    mutationFn: ({ username, password }) =>
      postBody("authen/api/v1/login", { username, password }),

    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      Swal.fire({
        icon: "success",
        title: t("login.success") || "Login Successful",
        text: t("login.redirecting") || "Redirecting to dashboard...",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => navigate("/"), 1600);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      Swal.fire({
        icon: "error",
        title: t("login.failed") || "Login Failed",
        text:
          err?.response?.data?.detail ||
          err?.message ||
          "Invalid username or password",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ username, password });
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
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>{t("login.loading") || "Loading..."}</span>
            </>
          ) : (
            <span>{t("login.continue")}</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
