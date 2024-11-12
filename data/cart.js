// cart.js
export let cart = JSON.parse(localStorage.getItem('cart')) || []; // Ensure an empty array if localStorage is null

// Make sure to save cart back to localStorage if it's empty
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// const cartMessageDiv = document.getElementById('cartMessage');
// if (cart.length === 0) {

//   cartMessageDiv.innerText = 'Cart is empty';
// } else {
//   // Clear the message if the cart is not empty
//   cartMessageDiv.innerText = '';
// }





// function generateCartHTML(cart) {
//   let htmlContent = '';

//   if (cart.length === 0) {
//     // Generate HTML with a simple message if the cart is empty
//     htmlContent = `<p>Cart is empty</p>`;
//   } else {
//     // Generate the HTML structure when the cart has items
//     htmlContent = `
//       <div class="page-title">Review your order</div>
//       <div class="checkout-grid">
//         <div class="order-summary js-order-summary"></div>
//         <div class="payment-summary">
//           <div class="payment-summary-title">Order Summary</div>
//           <button class="place-order-button button-primary">
//             Place your order
//           </button>
//         </div>
//       </div>
//     `;
//   }

//   // Insert the generated HTML into a container element
//   document.getElementById('main').innerHTML = htmlContent;
// }







export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter(cartItem => cartItem.productId !== productId);
  saveToStorage();
  calculateCartQuantity();
}

//  Clear the cart array and remove items from LocalStorage
export function removeFromCartAll() {
  cart = []; 
  saveToStorage(); 
}


export function calculateCartQuantity() {
  let cartQuantity1 = 0;

  cart.forEach((cartItem) => {
    cartQuantity1 += cartItem.quantity;
 
  });
  return cartQuantity1
}

calculateCartQuantity() 









