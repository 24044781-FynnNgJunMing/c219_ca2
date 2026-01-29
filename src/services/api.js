const API_URL = process.env.REACT_APP_API_URL || "https://onlinecarswebservice.onrender.com";


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
// Protect ONLY addCard in this demo
export function addCard(card) {
  return fetch(`${API_URL}/addcar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(card),
  });
}

export async function getCards() {
  const res = await fetch(`${API_URL}/allcars`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateCard(id, card) {
  const res = await fetch(`${API_URL}/editcar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteCard(id) {
  const res = await fetch(`${API_URL}/deletecar/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}