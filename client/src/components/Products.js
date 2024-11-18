import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Make sure you are fetching from the correct URL
    axios.get('http://localhost:8000/products')
      .then(response => {
        const fetchedProducts = response.data.items.map(item => ({
          id: item.sys.id,
          title: item.fields.title,
          price: item.fields.price,
          image: item.fields.image.fields.file.url // Adjust for nested structure
        }));
        setProducts(fetchedProducts); // Update state with the adjusted data
      })
      .catch(error => console.error('Error fetching products', error));
  }, []);

  return (
    <div className="products-center">
      {products.map(product => (
        <div key={product.id} className="product">
          <div className="img-container">
            <img src={product.image} alt={product.title} className="product-img" />
            <button className="bag-btn" data-id={product.id}>
              <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
          <h3>{product.title}</h3>
          <h4>${product.price}</h4>
        </div>
      ))}
    </div>
  );
};

export default Products;
