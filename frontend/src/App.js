import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage('Error submitting product.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Product Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
