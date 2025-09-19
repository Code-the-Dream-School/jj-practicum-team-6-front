import { useEffect, useState } from "react";
import { FaList, FaMap } from "react-icons/fa";
import LocationMap from "../../components/LocationMap";

function getUserFromStorage() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || {};
  } catch {
    return {};
  }
}

export default function Profile() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [viewMode, setViewMode] = useState("list");
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const u = getUserFromStorage();
    setUser(u);
    setEditForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      city: u.city || u.zipcode || "",
      phone: u.phone || u.phoneNumber || "",
    });
  }, []);

  const posts = user.posts || [];
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.location?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || post.status?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  function handleEditChange(e) {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setAvatarFile(files[0]);
      // Show preview
      const reader = new FileReader();
      reader.onload = (ev) =>
        setUser((u) => ({ ...u, avatarUrl: ev.target.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setEditForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSave() {
    const updated = {
      ...user,
      ...editForm,
      avatarUrl: avatarFile ? user.avatarUrl : user.avatarUrl,
      zipcode: editForm.city,
    };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setIsEditing(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white min-h-screen">
      {/* profile Header */}
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
            ></div>
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
            {user.firstName || user.name || "User"} {user.lastName || "User"}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 font-body">
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
              </div>
              <div className="flex items-center gap-2 w-full">
                <input
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="flex-1 px-3 py-2 rounded-full border border-gray-200"
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-[#E66240] hover:bg-[#1E1E1E] text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md mt-2"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-600 font-body">
                {/* You may want to import and use MdLocationOn here if needed */}
                <span>{user.city || user.zipcode || "10019"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-body">
                {/* You may want to import and use MdPhone here if needed */}
                <span>{user.phone || user.phoneNumber || "+12345678901"}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#E66240] hover:bg-[#1E1E1E] text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md mt-2"
              >
                <span className="font-body">Edit</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* My Posts */}
      <h3 className="font-display text-3xl font-bold text-ink text-center mb-8">
        My Posts
      </h3>
      {/* Search + View Toggle + Filter Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center w-full max-w-4xl mx-auto">
        <div className="flex flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name, description or zipcode"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary font-body text-ink placeholder:text-gray-400 max-w-xl"
          />
        </div>
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          {/* View Toggle Buttons */}
          <button
            onClick={() => setViewMode("list")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              viewMode === "list"
                ? "bg-ink text-white shadow-md"
                : "bg-gray-100 text-gray600 hover:bg-gray-200"
            }`}
          >
            <FaList size={16} /> List of items
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
              viewMode === "map"
                ? "bg-ink text-white shadow-md"
                : "bg-gray-100 text-gray600 hover:bg-gray-200"
            }`}
          >
            <FaMap size={16} /> Map view
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setFilter("All")}
          className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
            filter === "All"
              ? "bg-ink text-white border-ink"
              : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Lost")}
          className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
            filter === "Lost"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
          }`}
        >
          Lost
        </button>
        <button
          onClick={() => setFilter("Found")}
          className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
            filter === "Found"
              ? "bg-success text-white border-success"
              : "bg-white text-gray600 border-gray-300 hover:border-gray-400"
          }`}
        >
          Found
        </button>
        {/* Sort Dropdown */}
        <div className="relative self-stretch flex items-center ml-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm font-medium text-gray600 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="Newest">Sort by: Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Name">Name</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.10)",
                }}
              >
                <div className="mb-4">
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                      post.status === "Lost"
                        ? "bg-red-50 text-primary border border-red-100"
                        : "bg-green-50 text-success border border-green-100"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div
                  className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400"
                  style={{ borderRadius: "14px" }}
                >
                  Image Placeholder
                </div>
                <h4 className="font-semibold mb-1 font-display text-ink">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 font-body">
                  {post.location}
                </p>
                <p className="text-sm text-gray-500 font-body">{post.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 font-body text-center w-full col-span-full">
              No posts yet.
            </p>
          )}
        </div>
      ) : (
        <div className="w-full h-[350px] mb-12">
          <LocationMap
            mode="display"
            items={filteredPosts.map((post) => ({
              ...post,
              lat: post.lat || 40.7128,
              lng: post.lng || -74.006,
            }))}
          />
        </div>
      )}
    </div>
  );
}
