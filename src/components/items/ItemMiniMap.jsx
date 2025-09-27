import LocationMap from "../../components/LocationMap";

export default function ItemMiniMap({ item }) {
  const safeItem = {
    ...item,
    lat: typeof item.lat === "number" ? item.lat : undefined,
    lng: typeof item.lng === "number" ? item.lng : undefined,
  };
  return (
    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
      <LocationMap mode="display" items={[safeItem]} />
    </div>
  );
}
