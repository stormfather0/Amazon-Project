import { formatCurrency } from './scripts/utils/money.js';
import { addFavourite, removeFavourite, isFavourite } from './data/favourites.js';

// Fetch Products from API
export async function fetchProducts() {
  try {
    const response = await fetch('https://amazon-project-sta4.onrender.com/api/products');
  
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
  
    const products = await response.json();
    console.log('Fetched products:', products); // Debug log
  
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Filter products based on category
    const filteredProducts = category 
      ? products.filter(product => product.type && product.type.toLowerCase() === category.toLowerCase())
      : products; // If no category is provided, show all products
  
    console.log(`Filtered products for category: ${category}`, filteredProducts); // Debug log
    
    // Generate and insert HTML for filtered products
    const productsGrid = document.querySelector('.js-products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = generateProductHTML(filteredProducts);
      favouritesListener(filteredProducts, productsGrid);
    } else {
      console.error('Products grid container not found');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

fetchProducts();

export function generateProductHTML(products) {
  let productsHTML = '';
  
  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <svg class="favourites-style js-favourites-${product.id}" 
             data-favourites-id="${product.id}" 
             width="30px" 
             height="20px" 
             viewBox="0 0 24 24" 
             role="img" 
             xmlns="http://www.w3.org/2000/svg" 
             aria-labelledby="favouriteIconTitle" 
             stroke="#000000" 
             stroke-width="2" 
             stroke-linecap="round" 
             stroke-linejoin="round" 
             fill="none" 
             color="#000000">
          <title id="favouriteIconTitle">Favourite</title> 
          <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"/> 
        </svg>

        <div class="product-image-container">
          <a href="product.html?id=${product.id}">
            <img class="product-image" src="${product.image}">
          </a>
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select>
            ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png"> Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });
  
  return productsHTML;
}

// Favourites Icon Listener
export function favouritesListener() {
    const favouriteIcons = document.querySelectorAll('.favourites-style');
  
    favouriteIcons.forEach((icon) => {
      const productId = icon.dataset.favouritesId;
  
      // Check if the product is already in the favourites list from localStorage
      if (isFavourite(productId)) {
        icon.classList.add('favourite-active');
      }
  
      icon.addEventListener('click', () => {
        // Toggle 'favourite-active' class
        icon.classList.toggle('favourite-active');
  
        // Add or remove product from favourites based on the state of the icon
        if (icon.classList.contains('favourite-active')) {
          addFavourite(productId); // Add product to favourites
        } else {
          removeFavourite(productId); // Remove product from favourites
        }
  
        console.log(`Favourite clicked for Product ID: ${productId}`);
        console.log('Favourites:', JSON.parse(localStorage.getItem('favourite')));
      });
    });
}