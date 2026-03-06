import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getProfile = async () => {
    const data = await apiFetch("/api/profile");
    setProfile(data);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard ✅</h2>

      <button onClick={getProfile}>Get Profile</button>

      <br /><br />

      <button onClick={handleLogout}>Logout</button>

      <br /><br />

      {profile && (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      )}
    </div>
  );
}

export default Dashboard;