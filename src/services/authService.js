export function getAccessToken() {
  return localStorage.getItem("token") || "";
}

export function logout() {
  localStorage.removeItem("token");
}
const USE_MOCKS = false;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const JSON_HEADERS = { "Content-Type": "application/json" };

export async function signIn({ email, password }) {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          localStorage.setItem("token", "demo-token");
          resolve({ ok: true });
        } else {
          reject({ message: "Email and password required" });
        }
      }, 500);
    });
  } else {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    if (data.accessToken) localStorage.setItem("token", data.accessToken);
    return data;
  }
}

export async function signUp(data) {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data?.email && data?.password) {
          resolve({ ok: true });
        } else {
          reject({ message: "Missing fields" });
        }
      }, 700);
    });
  } else {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw result;
    return result;
  }
}
