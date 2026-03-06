const API_URL = "https://flask-auth-api-cnjc.onrender.com";

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    },
    ...options
  });

  return res.json();
};