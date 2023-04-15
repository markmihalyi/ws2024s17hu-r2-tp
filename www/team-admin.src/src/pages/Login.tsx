import axios from "axios";
import React from "react";

const Login = () => {
  const [tokenInputValue, setTokenInputValue] = React.useState("");

  const handleTokenInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTokenInputValue(e.currentTarget.value);
  };

  const handleLogin = async () => {
    const token = tokenInputValue.trim();
    try {
      const res = await axios.post("/api/v1/login", { token });
      if (!res.data.user.isAdmin) {
        alert("You are not an administrator.");
        return;
      }
      localStorage.setItem("token", token);
      window.location.replace("/");
    } catch (err) {
      alert("The provided token is incorrect.");
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="border-gray-300 border rounded-lg px-12 py-6 flex flex-col items-center">
        <h1 className="text-2xl font-medium">Login</h1>
        <h2 className="text-sm">Login using your token</h2>
        <input
          type="text"
          value={tokenInputValue}
          onChange={handleTokenInputChange}
          className="border border-gray-500 rounded-md my-6 pl-3 py-1"
          placeholder="Token"
          aria-label="token"
        />
        <button
          className="rounded-md bg-gray-200 px-3 py-1 border border-gray-500"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </main>
  );
};

export default Login;
