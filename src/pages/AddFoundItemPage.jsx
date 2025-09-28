import AddItemForm from "../components/items/AddItemForm.jsx";

export default function AddFoundItemPage() {
  return (
    <AddItemForm
      status="FOUND"
      title="Add Found Item"
      locationLabel="Location Where Found *"
    />
  );
}
