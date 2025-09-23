import api from "./apiClient";

export function getAccessToken() {
  return localStorage.getItem("token") || "";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

const USE_MOCKS = false;

export async function signIn({ email, password }) {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          localStorage.setItem("token", "demo-token");
          localStorage.setItem(
            "user",
            JSON.stringify({ id: 123, firstName: "Demo", email })
          );
          resolve({ ok: true });
        } else {
          reject({ message: "Email and password required" });
        }
      }, 500);
    });
  } else {
    const res = await api.apiPost(`/api/v1/auth/login`, { email, password });
    // backend wraps payload in { success, data: { user, accessToken }, meta }
    const payload = res?.data || res;
    const token = payload?.accessToken || payload?.access_token || "";
    const user = payload?.user || payload?.user;
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return res;
  }
}

export async function signUp(payload) {
  if (USE_MOCKS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (payload?.email && payload?.password) {
          resolve({ ok: true });
        } else {
          reject({ message: "Missing fields" });
        }
      }, 700);
    });
  } else {
    const res = await api.apiPost(`/api/v1/auth/register`, payload);
    const payloadData = res?.data || res;
    const token = payloadData?.accessToken || payloadData?.access_token || "";
    const user = payloadData?.user || null;
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return res;
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.apiGet(`/api/v1/auth/me`);
    const user = res?.data?.user || res?.data || null;
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (e) {
    return null;
  }
}

export async function updateProfile(payload) {
  try {
    const res = await api.apiPatch(`/api/v1/users/self`, payload);
    const user = res?.data || res;
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    throw err;
  }
}
