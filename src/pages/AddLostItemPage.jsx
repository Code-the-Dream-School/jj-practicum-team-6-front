import AddItemForm from "../components/items/AddItemForm.jsx";

export default function AddLostItemPage() {
  return (
    <AddItemForm
      status="LOST"
      title="Add Lost Item"
      locationLabel="Location Where Lost *"
    />
  );
}
