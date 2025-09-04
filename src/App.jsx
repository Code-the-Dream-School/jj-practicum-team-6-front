import React, { useState, useEffect } from 'react';
import { getAllData } from './util/index';
import { Routes, Route} from 'react-router-dom'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import ItemsList from './pages/ItemsList'

const URL = 'http://localhost:8000/api/v1/';

function App() {
  
  const [message, setMessage] = useState(''); 

  useEffect(() => {

    (async () => {
      const myData = await getAllData(URL)
      setMessage(myData.data);
    })();
      
    return () => {
      console.log('unmounting');
    }

  }, []);

  return (
    <>
      <h1>{message}</h1>

      <Routes>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/edit' element={<EditProfile/>}/>
        <Route path='/items/list' element={<ItemsList/>}/>
      </Routes>
    </>
  );

}

export default App
