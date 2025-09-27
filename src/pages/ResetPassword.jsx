import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export default function ResetPasswordPage() {
  const token = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return sp.get("token") || "";
  }, []);

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const e = {};
    if (!token) e.token = "Invalid or missing token";
    if (!form.password || form.password.length < 8)
      e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.success) {
        setDone(true);
      } else {
        setApiError(
          json?.error?.message || "Reset link is invalid or expired."
        );
      }
    } catch {
      setApiError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center px-4 pt-12 md:pt-16 bg-white">
      <h1 className="text-center mt-6 mb-10 font-['Merriweather'] text-5xl md:text-6xl font-bold">
        Reset your password
      </h1>

      <form
        onSubmit={onSubmit}
        className="border border-gray-200 p-6 rounded-[14px] shadow-[0_10px_15px_-3px_rgba(0,0,0,.1),0_4px_6px_-4px_rgba(0,0,0,.1)] bg-white w-full max-w-[520px]"
      >
        {done ? (
          <div className="text-center">
            <p className="text-sm text-green-700 mb-4">
              Password has been updated. You can now sign in.
            </p>
            <Link to="/signin" className="no-underline">
              <Button className="w-full h-[50px] rounded-[25px] bg-black !text-white hover:opacity-90">
                Go to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {!token && (
              <p className="mb-4 text-sm text-red-600">
                Invalid or missing token.
              </p>
            )}

            <div className="mb-4 space-y-4">
              <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
                <Input
                  name="password"
                  type="password"
                  placeholder="New password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="new-password"
                  className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
                />
                {errors.password ? (
                  <span className="absolute right-4 py-1 text-xs text-red-600">
                    {errors.password}
                  </span>
                ) : null}
              </div>

              <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  autoComplete="new-password"
                  className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
                />
                {errors.confirmPassword ? (
                  <span className="absolute right-4 py-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </span>
                ) : null}
              </div>
            </div>

            {apiError ? (
              <p className="mb-3 text-sm text-red-600">{apiError}</p>
            ) : null}

            <div className="mt-4">
              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full h-[50px] rounded-[25px] bg-black !text-white hover:opacity-90 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}
