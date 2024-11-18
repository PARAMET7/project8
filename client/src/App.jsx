import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from '../src/pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext'
import DashBoard from './pages/Dashboard';
// import { useState, useEffect } from 'react';

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
        let result = await fetch('/products.json');
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
              Add to Cart
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
        // and add cart item
        this.addCartItem(cartItem);
        // value and display showing in the cart:
        this.showCart();
      });


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
  addCartItem(item){
    const div= document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML =`
      <img src="${item.image}" alt="product" class="">
            <div>
              <h4>${item.title}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
    `
    cartContent.appendChild(div);

  }
  showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }
  setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click',this.hideCart);
  }
  populateCart(cart){
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }
  cartLogic() {
    //clear btm;
    clearCartBtn.addEventListener('click',()=> {
      this.clearCart();
    });
    //cart functionality
    cartContent.addEventListener('click', event =>{
      if (event.target.classList.contains('remove-item')){
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement)
        this.removeItem(id);
      } else if (event.target.classList.contains('fa-chevron-up')) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item=> item.id === id);
        tempItem.amount = tempItem.amount +1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }
      else if (event.target.classList.contains('fa-chevron-down')){
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item=> item.id === id);
        tempItem.amount = tempItem.amount -1;
        if (tempItem.amount >0){
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        }else{
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id)
        }
      }
    });
  }

  clearCart(){
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while(cartContent.children.length>0){
      cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();
  }
  removeItem(id){
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button =this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping=cart"></i> Add to Cart`;
  }
  getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id===id)
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
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const ui = new UI()
  const products = new Products()
  //setup app
  ui.setupAPP();
  //get all the products;
  products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products)
  }).then(()=>{
    ui.getBagButtons();
    ui.cartLogic();
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
