import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const mockItems = [
  {
    id: 1,
    title: 'Lost Wallet',
    status: 'Lost',
    location: 'Central Park',
    date: '2025-08-10',
    imageUrl: '/wallet.jpg',
  },
  {
    id: 2,
    title: 'Keys',
    status: 'Found',
    location: 'Times Square',
    date: '2025-08-08',
    imageUrl: '/keys.jpg',
  },
];

export default function EditItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itemData, setItemData] = useState(null)

  useEffect(()=>{
    const item= mockItems.find((i)=>i.id ===parseInt(id))
    if (item){
        setItemData(item)
    } else{
        alert('Item not found')
        navigate('/')
    }
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: value,
    }))
}

const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated Item:', itemData)
    alert('Item updated!')
        navigate('/')
}

if (!itemData) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={itemData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={itemData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            name="location"
            value={itemData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
         <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={itemData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            name="imageUrl"
            value={itemData.imageUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#7FD96C] text-white px-4 py-2 rounded hover:bg-[#69c359]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
