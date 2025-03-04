import { formatCurrency } from './scripts/utils/money.js';
import { addFavourite, removeFavourite } from './data/favourites.js';
import {cart, addToCart, calculateCartQuantity, updateCartQuantity} from './data/cart.js';



// Page Navigation =======================================
const urlParams = new URLSearchParams(window.location.search);

let categoryNameFromURL = urlParams.get("category");

const categoryMapping = {
  'electronics': 'Electronics',
  'digital-content': 'Digital Content',
  'clothing': 'Clothing',
  'personal-care': 'Personal Care',
  'fashion': 'Fashion',
  'gift-cards': 'Gift Cards'
};

categoryNameFromURL = categoryMapping[categoryNameFromURL] || categoryNameFromURL;
let categoryName = document.querySelector('.js-category')
categoryName.innerHTML = categoryNameFromURL;



// Fetch Products from API (with caching)========================================
export async function fetchProducts() {
  try {
    let products = JSON.parse(localStorage.getItem("products"));

    // Fetch from API only if products are not in localStorage
    if (!products) {
      const response = await fetch("https://amazon-project-sta4.onrender.com/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      products = await response.json();
      localStorage.setItem("products", JSON.stringify(products)); // Store in localStorage
    }

    console.log("Fetched products:", products);

    // Get category from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
   

    // Filter products by category (if specified)
    const filteredProducts = category
      ? products.filter((product) => product.type?.toLowerCase() === category.toLowerCase())
      : products;

    console.log("Filtered products:", filteredProducts);

    // Render products in the grid without fade-in/fade-out effect
    const productsGrid = document.querySelector(".js-products-grid");
    if (productsGrid) {
      productsGrid.innerHTML = generateProductHTML(filteredProducts);
    } else {
      console.error("Products grid container not found");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}



//  <a href="product.html?id=${product.id}">
// Generate Product Cards Efficiently
export function generateProductHTML(products) {
  return products
    .map(
      (product) => `

  

      <div class="product-container">
        <svg class="favourites-style js-favourites-${product.id}" 
             data-favourites-id="${product.id}"
             width="30px"
             height="20px"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
             stroke="#000000"
             stroke-width="2"
             fill="none">
          <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 
            C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 
            22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"/> 
        </svg>

        <div class="product-image-container">

         
          <a href="product.html?category=${product.type}&id=${product.id}">


            <img class="product-image" src="${product.image}" loading="lazy">
          </a>
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">${product.rating.count}</div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select>${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select>
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `
    )
    .join("");
}

// Optimized Favourites Listener (Using Event Delegation)
export function favouritesListener() {
  const productsGrid = document.querySelector(".js-products-grid");
  if (!productsGrid) return;

  productsGrid.addEventListener("click", (event) => {
    const icon = event.target.closest(".favourites-style");
    if (!icon) return;

    const productId = icon.dataset.favouritesId;
    icon.classList.toggle("favourite-active");

    // Add/remove from favourites
    if (icon.classList.contains("favourite-active")) {
      addFavourite(productId);
    } else {
      removeFavourite(productId);
    }

    console.log(`Favourite clicked for Product ID: ${productId}`);
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  favouritesListener();
  updateCartQuantity()
});











