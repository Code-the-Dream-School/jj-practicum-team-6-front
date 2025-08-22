import React, { useState, useEffect } from 'react';
import { getAllData } from './util/index';
//import HomePage from './pages/HomePage';
import './App.css';

const URL = 'http://localhost:8000/api/v1/';

function App() {
  
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);

  useEffect(() => {

    (async () => {
      try{
        setLoading(true);
        const myData = await getAllData(URL)
        setMessage(myData.data);
        //setError(null);
      }
      catch (err) {
        console.error('API Error:', err);
        setError('Backend not connected');
        setMessage('API is not available - using mock data');
      }
      finally{
        setLoading(false);
      }
    })();
      
    return () => {
      console.log('unmounting');
    }

  }, []);

  if (loading){
    return(
     <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
      }}>
        <p className="text-body">Loading...</p>
      </div>
    );
  }

return (
    <div className="App">
      {/* Typography Test */}
      <section style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
        <h1 className="text-h1">Lost something?</h1>
        <h2 className="text-h2">Welcome to App Name</h2>
        <h3 className="text-h3">Recently Added</h3>
        <p className="text-body">This is body text using Roboto font family.</p>
        
        {message && (
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: 'var(--space-md)', 
            marginTop: 'var(--space-lg)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p className="text-body">Backend: {message}</p>
          </div>
        )}
      </section>
    </div>
  );

  // return (
  //   <>
  //     <h1>{message}</h1>
  //   </>
  // );

}

export default App
