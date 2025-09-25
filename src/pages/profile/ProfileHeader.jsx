import { useContext, useEffect, useState } from "react";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { updateProfile } from "../../services/authService";

export default function ProfileHeader() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveFieldErrors, setSaveFieldErrors] = useState({});

  useEffect(() => {
    const u = currentUser || {};
    setUser(u);
    setEditForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      city: u.city || u.zipCode || u.zipcode || "",
      phone: u.phone || u.phoneNumber || "",
    });
  }, [currentUser]);

  function handleEditChange(e) {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setAvatarFile(files[0]);
      const reader = new FileReader();
      reader.onload = (ev) =>
        setUser((u) => ({ ...u, avatarUrl: ev.target.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setEditForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSave() {
    setSaveError("");
    setSaveFieldErrors({});
    setSaving(true);
    const payload = {};
    const nextFirst = (editForm.firstName || "").trim();
    const nextLast = (editForm.lastName || "").trim();
    const nextPhone = (editForm.phone || "").trim();
    const nextZip = (editForm.city || "").trim();

    const errs = {};
    if (nextFirst && nextFirst.length < 2) errs.firstName = "Min 2 chars";
    if (nextLast && nextLast.length < 2) errs.lastName = "Min 2 chars";
    if (nextZip && !/^\d{5}$/.test(nextZip)) errs.city = "5 digits";
    if (nextPhone && !/^\+[1-9]\d{1,14}$/.test(nextPhone))
      errs.phone = "Use +11234567890";
    if (Object.keys(errs).length) {
      setSaveFieldErrors(errs);
      setSaving(false);
      return;
    }

    if (nextFirst && nextFirst !== (user.firstName || ""))
      payload.firstName = nextFirst;
    if (nextLast && nextLast !== (user.lastName || ""))
      payload.lastName = nextLast;
    if (nextPhone && nextPhone !== (user.phoneNumber || user.phone || ""))
      payload.phoneNumber = nextPhone;
    if (nextZip && nextZip !== (user.zipCode || user.zipcode || ""))
      payload.zipCode = nextZip;

    try {
      const serverUser = await updateProfile(payload);
      if (serverUser) {
        setUser(serverUser);
        setCurrentUser(serverUser);
        localStorage.setItem("user", JSON.stringify(serverUser));
      }
      setIsEditing(false);
    } catch (err) {
      const serverError = err?.error || err;
      if (
        serverError?.code === "VALIDATION_ERROR" &&
        Array.isArray(serverError?.details)
      ) {
        const first = serverError.details[0];
        setSaveError(
          first?.message || serverError.message || "Validation failed"
        );
      } else {
        setSaveError(
          serverError?.message || err?.message || "Failed to save profile"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-ink text-center mb-8">
        My Profile
      </h1>
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 mx-auto text-center sm:text-left"
        style={{ maxWidth: "600px" }}
      >
        <div className="flex flex-col items-center gap-2">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border shadow-md"
              style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.10)" }}
            />
          ) : (
            <div
              className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border shadow-md"
              style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.10)" }}
            >
              <span className="text-3xl font-semibold text-gray-500 select-none">
                {(() => {
                  const f = (user.firstName || "").trim();
                  const l = (user.lastName || "").trim();
                  const fi = f ? f[0].toUpperCase() : "U";
                  const li = l ? l[0].toUpperCase() : "";
                  return `${fi}${li}`;
                })()}
              </span>
            </div>
          )}
          {isEditing && (
            <label className="flex flex-col items-center cursor-pointer text-xs text-gray-500 mb-2">
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                Upload photo
              </span>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleEditChange}
              />
            </label>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2">
          <h2 className="text-2xl font-semibold text-ink font-['Roboto']">
            {user.firstName || "User"} {user.lastName || "User"}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 font-body">
            <MdEmail className="text-gray-400" />
            <span>{user.email || "retrieveapp@gmail.com"}</span>
          </div>
          {isEditing ? (
            <>
              <div className="flex items-center gap-2 w-full">
                <input
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  className="flex-1 px-3 py-2 rounded-full border border-gray-200"
                />
                {saveFieldErrors.city ? (
                  <span className="text-xs text-red-600">
                    {saveFieldErrors.city}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 w-full">
                <input
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="flex-1 px-3 py-2 rounded-full border border-gray-200"
                />
                {saveFieldErrors.phone ? (
                  <span className="text-xs text-red-600">
                    {saveFieldErrors.phone}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary disabled:opacity-60 hover:bg-[#1E1E1E] text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md mt-2"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                {saveError ? (
                  <div className="text-sm text-red-600">{saveError}</div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-600 font-body">
                <FaMapMarkerAlt className="text-gray-400" />
                <span>{user.zipCode || user.zipcode || user.city || ""}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-body">
                <MdPhone className="text-gray-400" />
                <span>{user.phone || user.phoneNumber || "+12345678901"}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-[#1E1E1E] text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md mt-2 flex items-center gap-2"
              >
                <FaEdit />
                <span className="font-body">Edit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
