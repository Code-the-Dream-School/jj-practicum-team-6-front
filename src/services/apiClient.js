const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function getToken() {
  return localStorage.getItem("token") || "";
}

async function apiFetch(path, opts = {}) {
  const isForm =
    typeof FormData !== "undefined" && opts.body instanceof FormData;
  const headers = {
    ...(opts.headers || {}),
  };
  if (!isForm) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const err = data || { message: `Request failed: ${res.status}` };
    throw err;
  }

  return data;
}

export async function apiGet(path) {
  return apiFetch(path, { method: "GET" });
}

export async function apiPost(path, body) {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPostForm(path, formData) {
  return apiFetch(path, { method: "POST", body: formData });
}

export async function apiPatch(path, body) {
  return apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete(path) {
  return apiFetch(path, { method: "DELETE" });
}

export default { apiGet, apiPost, apiPatch, apiDelete, BASE_URL };
