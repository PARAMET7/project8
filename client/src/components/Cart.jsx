import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import f from '../../public/products.json'

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products data from the public folder
  useEffect(() => {
    fetch('../../public/products.json')  // Correct path for public folder
      .then(response => response.json())
      .then(data => {
        console.log('Fetched products:', data);  // Ensure products are fetched correctly
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart items:', storedCart);  // Check if cart items are being retrieved
    setCart(storedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Increase item amount in the cart
  const increaseAmount = (id) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, amount: item.amount + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Decrease item amount in the cart
  const decreaseAmount = (id) => {
    const updatedCart = cart.map(item =>
      item.id === id && item.amount > 1 ? { ...item, amount: item.amount - 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Find the product details based on the cart item id
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty</p> : (
        cart.map(item => {
          const product = getProductById(item.id);
          if (!product) return null; // if product data not found, skip the item

          return (
            <div key={item.id} className="cart-item">
              <img src={product.image} alt={product.title} />
              <div>
                <h4>{product.title}</h4>
                <p>${product.price}</p>
                <p>Amount: {item.amount}</p>
              </div>
              <div>
                <button onClick={() => increaseAmount(item.id)}>+</button>
                <button onClick={() => decreaseAmount(item.id)}>-</button>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          );
        })
      )}
      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
};

export default Cart;
