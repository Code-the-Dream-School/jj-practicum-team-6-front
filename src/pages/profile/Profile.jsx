import {useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import { FaList, FaMap} from 'react-icons/fa'
import axios from 'axios';
// import ItemCard from '../components/items/ItemCard'


const fakeUser={
    name:'AAAAA BBBBB',
    email: 'AAAAAA@gmail.com',
    phone: '+1 123 123 1234',
    city: 'New York, NY 10019',
    avatarUrl: '/profile-pic.jpg',
    posts:[
        {id:1, title:'Lost Wallet', status:'Lost', location:'Central Park', date:'2025-08-10'},
        {id:2, title:'Keys', status:'Found', location:'Times Square', date:'2025-08-8'}
    ]
}

export default function Profile(){
    // const [user, setUser]= useState(null)
    // const {userId } = useParams()
    const navigate = useNavigate();
    const [search, setSearch]= useState('')
    const[ filter, setFilter]= useState('All')

     const filteredPosts = fakeUser.posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' || post.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });
//     useEffect(()=>{
//         console.log("Fetching user:", `/api/users/1`);
//        axios.get(`/api/v1/users/${userId}`)
//       .then(res => setUser(res.data))
//       .catch(err => console.error(err));
//   }, [userId]);

    // if (!user) return <p>Loading...</p>
    return(
        <div className='p-4 max-w-4xl mx-auto'>
            {/* profile Header */}
            <h1 className='text-2xl font-bold mb-4'> My profile</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className= 'flex items-center gap-6'>
                <img 
                  src={fakeUser.avatarUrl}
                  alt= 'avatar'
                  className='w-24 h-24 rounded-full object-cover border'/>
                <div >
                    <h2 className='text-xl font-semibold'>{fakeUser.name}</h2>
                    <p>{fakeUser.email}</p>
                    <p>{fakeUser.city}</p>
                    <p>{fakeUser.phone}</p>
                    </div>
                    </div>
                    <button
                         onClick={() => navigate('/profile/edit')}
                         className="bg-[#E66240] text-white px-4 py-2 rounded-[16px] hover:bg-[#1E1E1E]">
                              Edit Profile
                         </button>
                    </div >

             {/* My Posts */}
      <h3 className="text-2xl font-semibold mb-4">My Posts</h3>
       {/* {user.posts.map(post => (
        <ItemCard key={post.id} post={post} />
       ))} */}
      {/* <div className=''> */}
         {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, description or zipcode"
          value={search}
          onChange= {(e)=> setSearch(e.target.value)}
          className="flex-1 bg-[#F3F3F3] px-4 py-2 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#7FD96C]"
        />
        
         {/* View Toggle */}
         <div className='flex gap-2'>
            <button className="border px-3 py-2 rounded flex items-center gap-1">
                <FaList /> List of items
            </button>
            <button className="border px-3 py-2 rounded flex items-center gap-1">
                <FaMap /> Map view
            </button>
         </div>
      </div>
        {/* Filters */}
        <div className='flex gap-3 mb-8'>
            {['All', 'Lost', 'Found'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-sm px-3 py-1 border rounded-full ${
                filter === status ? 'bg-[#7FD96C] text-white' : 'hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
            <button className='text-sm px-3 py-1 border rounded-full hover:bg-gray-200'>Filter</button>
        </div>       
            {/* Placeholder: Posts List */}
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPosts && filteredPosts.length > 0 ? (
         filteredPosts.map((post) =>(
        // <ItemCard key={post.id} post={post} 
        //  />
          <div key={post.id} className="border rounded shadow-sm p-3">
            <div className="mb-2">
              <span
               className={`text-xs px-2 py-1 rounded-full font-semibold ${
                post.status === 'Lost'
                  ? 'bg-[#FEE2E2] text-[#E66240]'
                  : 'bg-[#D1FAE5] text-[#7FD96C]'
                }`}
              >
                {post.status}
              </span>
            </div>
            <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
              Image Placeholder
            </div>
            <h4 className="font-semibold mb-1">{post.title}</h4>
            <p className="text-sm text-gray-600">{post.location}</p>
            <p className="text-sm text-gray-500">{post.date}</p>
          </div>
        ))
    ):(
        <p> No posts yet.</p>
    )}
      </div>
      </div>
    )
}
