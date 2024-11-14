import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext'
import DashBoard from './pages/Dashboard';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const cartTotal = document.querySelector('.cart-total');
const productsDOM = document.querySelector('.products-center');

//cart
let cart = [];
let buttonsDOM = [];
//getting products
class Products{
    async getProducts() {
      try {
        let result = await fetch('../public/products.json');
        let data = await result.json();

        let products = data.items;
        products = products.map(item => {
          const{title, price} = item.fields;
          const {id} = item.sys;
          const image = item.fields.image.fields.file.url;
          return {title, price, id, image}
        });
        return products;
      } catch (error) {
        console.log(error);
      }
    }
}
//display the products
class UI {
  displayProducts(products){
    let result = '';
    products.forEach(product => {
      result +=`
        <article class="product">
          <div class="img-container">
            <img src=${product.image} alt="product" class="product-img">
            <button class="bag-btn" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
      `;
    });
    if (productsDOM) { // Ensure productsDOM is defined
      productsDOM.innerHTML = result;
    } else {
      console.error('productsDOM is not defined or not found in the document.');
    }
  }

  getBagButtons(){
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText ="IN CART";
        button.disabled =true;
      }
      button.addEventListener('click', event => {
        event.target.innerText = "IN CART";
        event.target.disavled = true;
         //get product from products
        let cartItem = {...Storage.getProduct(id), amount:1};
        // and add product to the cart
        cart = [...cart, cartItem];
        //  save in local storage
        Storage.saveCart(cart);
        // set cart value
        this.setCartValues(cart);
      });
                // and add cart value and display showing in the cart:

    });
  }
  setCartValues(cart){
    let tempTotal=0;
    let itemsTotal= 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal +=item.amount;
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
    cartItems.innerText = itemsTotal;
  }
}

class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products))
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id===id);
  }
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const ui = new UI()
  const products = new Products()
  //get all the products;
  products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products)
  }).then(()=>{
    ui.getBagButtons();
  });
})

function App() {
  return (
      <UserContextProvider>
        <Navbar />
        <Toaster position='bottom-right' toastOptions={{duration: 2000}}></Toaster>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<DashBoard />} />
        </Routes>
      </UserContextProvider>
  );
}

export default App;
