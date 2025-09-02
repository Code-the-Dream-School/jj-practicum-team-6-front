import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { signUp } from "../services/authService";

export default function SignUpPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    zipcode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.password.length < 6) e.password = "Min 6 chars";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Doesn’t match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        zipcode: form.zipcode,
        phone: form.phone,
      });
      nav("/signin");
    } catch (err) {
      setApiError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center px-4 pt-12 md:pt-16 bg-white">
      <h1 className="text-center mt-6 mb-10 font-['Merriweather'] text-5xl md:text-6xl font-bold">
        Sign up to Retrieve
      </h1>

      <form
        onSubmit={onSubmit}
        className="border border-gray-200 p-6 rounded-[14px] shadow-[0_10px_15px_-3px_rgba(0,0,0,.1),0_4px_6px_-4px_rgba(0,0,0,.1)] bg-white w-full max-w-[520px]"
      >
        <div className="text-center mb-6">
          <div className="text-2xl font-bold mb-8 font-['Merriweather']">
            Logo
          </div>
          <p className="text-sm text-gray-700 mb-10">
            Have an account?{" "}
            <Link to="/signin" className="underline">
              Sign in →
            </Link>
          </p>
        </div>

        <div className="mb-4 space-y-4">
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={onChange}
              autoComplete="given-name"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
            />
            {errors.firstName ? (
              <span className="absolute right-4 py-1 text-xs text-red-600">
                {errors.firstName}
              </span>
            ) : null}
          </div>
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={onChange}
              autoComplete="family-name"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
            />
            {errors.lastName ? (
              <span className="absolute right-4 py-1 text-xs text-red-600">
                {errors.lastName}
              </span>
            ) : null}
          </div>
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
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
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              variant="frameless"
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
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={onChange}
              autoComplete="new-password"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
            />
            {errors.confirmPassword ? (
              <span className="absolute right-4 py-1 text-xs text-red-600">
                {errors.confirmPassword}
              </span>
            ) : null}
          </div>
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="zipcode"
              placeholder="Zipcode"
              value={form.zipcode}
              onChange={onChange}
              autoComplete="postal-code"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
            />
          </div>
          <div className="relative flex h-[50px] rounded-[25px] border border-[#E8E8E9] bg-white px-5 py-3">
            <Input
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={onChange}
              autoComplete="tel"
              variant="frameless"
              className="h-full w-full text-sm placeholder-gray-400 pt-[2px]"
            />
          </div>
        </div>

        {apiError ? (
          <p className="mb-3 text-sm text-red-600">{apiError}</p>
        ) : null}
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] rounded-[25px] bg-black !text-white hover:opacity-90 flex items-center justify-center"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>
    </main>
  );
}
