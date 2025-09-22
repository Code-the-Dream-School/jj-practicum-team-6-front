import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { signIn } from "../services/authService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function SignInPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(form);
      nav("/items/list");
    } catch (err) {
      setApiError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center px-4 pt-12 md:pt-16">
      <h1 className="text-center mt-6 mb-10 font-['Merriweather'] text-5xl md:text-6xl font-bold">
        Sign in to Retrieve
      </h1>

      <form
        onSubmit={onSubmit}
        className="border border-gray-200 p-6 rounded-[14px] shadow-[0_10px_15px_-3px_rgba(0,0,0,.1),0_4px_6px_-4px_rgba(0,0,0,.1)] bg-white w-full max-w-[520px] mb-16"
      >
        <div className="text-center mb-6">
          <div className="text-2xl font-bold mb-8 font-['Merriweather']">
            Retrieve
          </div>
          <p className="text-sm text-gray-700 mb-10">
            Don’t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up →
            </Link>
          </p>
        </div>

        <div className="mb-4 space-y-4">
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px] border-none focus:ring-0 focus:outline-none focus:border-none hover:border-none"
            />
            {errors.email ? (
              <span className="absolute right-4 py-1 text-xs text-red-600">
                {errors.email}
              </span>
            ) : null}
          </div>

          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px] border-none focus:ring-0 focus:outline-none"
            />
            {errors.password ? (
              <span className="absolute right-4 py-1 text-xs text-red-600">
                {errors.password}
              </span>
            ) : null}
          </div>
        </div>

        {apiError ? (
          <p className="mb-3 text-sm text-red-600">{apiError}</p>
        ) : null}
        <div className="mt-4">
          {/* <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] rounded-[25px] bg-black !text-white hover:opacity-90 flex items-center justify-center"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button> */}
          

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] rounded-[25px] bg-black !text-white hover:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-sm text-gray-700 mt-8 text-center mb-6">
            <Link to="/forgot-password" className="underline">Forgot password?</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
