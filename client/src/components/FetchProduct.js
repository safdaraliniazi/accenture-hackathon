import React, { useState } from 'react';

function ProductDetails() {
  const [url, setUrl] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState('');

  const fetchProductDetails = async () => {
    try {
      setLoading('Loading...');
      const response = await fetch('http://localhost:5000/product_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      
      const data = await response.json();
      setProductDetails(data);
      setLoading('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Amazon URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={fetchProductDetails}>Fetch Details</button>
      {loading && <p>{loading}</p>}
      {productDetails && (
        <div>
          <p>{productDetails.title}</p>
          <p>{productDetails.description}</p>
          <img src={productDetails.photos} alt="Product" />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
