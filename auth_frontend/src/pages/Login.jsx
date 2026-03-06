import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ako korisnik već ima token → idi na dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResponse("");

    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.access_token) {
        login(data.access_token);
        navigate("/dashboard");
      } else {
        setResponse("Login failed");
      }

    } catch (error) {
      setResponse("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="w-80 bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-red-500 mt-4">
          {response}
        </p>

      </div>

    </div>
  );
}

export default Login;