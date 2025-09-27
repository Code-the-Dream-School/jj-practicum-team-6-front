import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center px-4 pt-12 md:pt-16 bg-white">
      <h1 className="text-center mt-6 mb-10 font-['Merriweather'] text-5xl md:text-6xl font-bold">
        Forgot your password?
      </h1>

      <form
        onSubmit={onSubmit}
        className="border border-gray-200 p-6 rounded-[14px] shadow-[0_10px_15px_-3px_rgba(0,0,0,.1),0_4px_6px_-4px_rgba(0,0,0,.1)] bg-white w-full max-w-[520px]"
      >
        {!submitted ? (
          <>
            <div className="mb-4 space-y-4">
              <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  variant="frameless"
                  className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
                />
                {errors.email ? (
                  <span className="absolute right-4 py-1 text-xs text-red-600">
                    {errors.email}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] rounded-[25px] bg-black !text-white hover:opacity-90 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    Send reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-2 text-center">
            <p className="text-sm text-green-700">
              If the email exists, we have sent reset instructions.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Open the link from your email to set a new password.
            </p>
          </div>
        )}
      </form>
    </main>
  );
}
