import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    avatarUrl: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "email is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    } else {
      console.log("Saved profile:", form);
      alert("Profile updated successfully!");
      navigate("/profile");
    }
  };
  return (
    <div>
      <h2>Edit profile</h2>
      <form onSubmit={handleSubmit} className="">
        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-[#F3F3F3] px-4 py-2 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#7FD96C]"
          />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full bg-[#F3F3F3] px-4 py-2 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#7FD96C]"
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            className="w-full bg-[#F3F3F3] px-4 py-2 rounded-[16px]"
          />
        </div>
        <div>
          <label>Location</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full bg-[#F3F3F3] px-4 py-2 rounded-[16px]"
          />
        </div>
        <div>
          <label>Upload Photo</label>
          <input type="file" name="avatarUrl" onChange={handleChange} />
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#E66240] text-white px-4 py-2 rounded-[16px]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="border border-gray-300 px-4 py-2 rounded-[16px]"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
