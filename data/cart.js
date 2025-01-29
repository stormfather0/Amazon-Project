// import { updateCartNotification } from '../scripts/amazon.js';
export let cart = JSON.parse(localStorage.getItem('cart')) || []; 


// Save cart back to LocalStorage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  console.log("Adding to cart:", productId, quantity);  
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
    });
  }

  saveToStorage();
  calculateCartQuantity();

}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
  calculateCartQuantity();
}

// Clear the cart array and remove items from LocalStorage
export function removeFromCartAll() {
  cart = [];
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

calculateCartQuantity();