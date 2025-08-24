import React, { useState, useEffect } from 'react';
import { getAllData } from './util/index';
import Header from './components/layout/Header';
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
      <Header />

      {/* Typography Test for testing the sticky(freeze) heder*/}
      <main style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
        <section style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)'}}>
          <h1 className="text-h1">Lost something?</h1>
          <h2 className="text-h2">Welcome to RetrieveApp</h2>
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

         {/* temporary test content to test sticky header scrolling */}
        <section style={{ height: '200vh', padding: 'var(--space-xl)', backgroundColor: 'var(--color-background)' }}>
          <h3 className="text-h3">Scroll down to test sticky header</h3>
          <p className="text-body">The header should stay at the top and be clearly visible over this content.</p>
          <div style={{ marginTop: '50vh' }}>
            <p className="text-body">More content here... Keep scrolling to test the header visibility.</p>
          </div>
          <div style={{ marginTop: '50vh' }}>
            <p className="text-body">Even more content. The header should remain clearly visible.</p>
          </div>
        </section>

    </main>  
    </div>
  );

  // return (
  //   <>
  //     <h1>{message}</h1>
  //   </>
  // );

}

export default App
