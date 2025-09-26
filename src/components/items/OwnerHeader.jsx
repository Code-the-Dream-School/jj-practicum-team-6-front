import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function OwnerHeader({ owner, item }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {owner && owner.avatarUrl ? (
        <img
          src={owner.avatarUrl}
          alt={owner.firstName || "User"}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
          {owner && (owner.firstName || owner.name)
            ? (owner.firstName || owner.name)[0]
            : "U"}
        </div>
      )}
      <div>
        <div className="font-semibold">
          {(owner && (owner.firstName || owner.name)) || "User"}{" "}
          {owner && owner.lastName ? owner.lastName : ""}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>
              {item.location ||
                (owner && (owner.zipCode || owner.zipcode || owner.city)) ||
                "Unknown location"}
            </span>
          </span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-2">
            <FaRegCalendarAlt className="text-gray-400" />
            <span>{item.date || "Unknown date"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
