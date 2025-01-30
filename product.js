// import { products, } from '../data/products.js';

// import { formatCurrency } from '/scripts/utils/money.js';
import {cart, addToCart, calculateCartQuantity} from './data/cart.js'; // Import addToCart from './data/cart.js';

// import {formatCurrency} from './utils/money.js';
// Fetch products data from backend
let products = [];
fetch('https://amazon-project-sta4.onrender.com/api/products') // Replace with your API endpoint
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then((data) => {
    products = data; // Assign fetched data to products
    console.log('Products fetched successfully:', products);

    // Call to render product details after products are loaded
    const productId = getProductIdFromURL();
    const product = products.find((p) => p.id === productId);
    renderProductDetails(product);
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });



  const orderSummaryContainer = document.querySelector('.js-order-summary');

if (orderSummaryContainer) {
  orderSummaryContainer.innerHTML = cartSummaryHTML;
} else {
  console.error("Error: .js-order-summary element not found in the HTML.");
}



function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  console.log('Product ID from URL:', id); // Debugging
  return id;
}

function renderProductDetails(product) {
  const container = document.querySelector('.js-product-details-container');

  if (!product) {
    container.innerHTML = `<p>Product not found.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name}" class="product-detail-image">
      <h1 class="product-detail-name">${product.name}</h1>
      <div class="product-detail-price">$${formatCurrency(product.priceCents)}</div>
      <p class="product-detail-description">${product.description || 'No description available.'}</p>
      <button class="js-add-to-cart button-primary add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `;

  // Attach the event listener after rendering the product details
  document.querySelector('.js-add-to-cart').addEventListener('click', () => {
    addToCart(product.id, 1); // Default quantity is 1
    updateCartQuantity();
  });
}

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

updateCartQuantity();


console.log('Product ID from URL:', window.location.search);