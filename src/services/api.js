const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://onlinestudyspaceswebservice.onrender.com/";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function login(credentials) {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function addSpace(space) {
  return fetch(`${API_URL}/addspace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(space),
  });
}

export async function getSpaces() {
  const res = await fetch(`${API_URL}/allspaces`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateSpace(id, space) {
  const res = await fetch(`${API_URL}/editspace/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(space),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteSpace(id) {
  const res = await fetch(`${API_URL}/deletespace/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}