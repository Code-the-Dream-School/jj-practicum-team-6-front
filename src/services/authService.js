const USE_MOCKS = true;

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
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    if (data.token) localStorage.setItem("token", data.token);
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
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw result;
    return result;
  }
}
