import { formatCurrency } from '../scripts/utils/money.js';

// Fetch products data from backend
let products = [];
fetch('https://amazon-project-sta4.onrender.com/api/products')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then(data => {
    products = data;
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

// Initialize favourite array (this will hold product IDs or product objects)
const favourite = JSON.parse(localStorage.getItem('favourite')) || [];

// Function to add a product to the favourite array and send it to the backend
export function addFavourite(productId) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('You need to log in to add favourites.');
    return;
  }

  // Add product ID to the array if not already in the list
  if (!favourite.includes(productId)) {
    favourite.push(productId);
    // Save updated array to localStorage
    localStorage.setItem('favourite', JSON.stringify(favourite));

    // Send updated favourites to the backend
    updateFavouritesInBackend(userId, favourite);
  }
}

// Function to remove a product from the favourite array and update the backend
export function removeFavourite(productId) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('You need to log in to remove favourites.');
    return;
  }

  const index = favourite.indexOf(productId);
  if (index > -1) {
    favourite.splice(index, 1);
    // Save updated array to localStorage
    localStorage.setItem('favourite', JSON.stringify(favourite));

    // Send updated favourites to the backend
    updateFavouritesInBackend(userId, favourite);
  }
}

// Function to check if a product is in the favourite array
export function isFavourite(productId) {
  return favourite.includes(productId);
}

// Function to update the user's favourites in the backend (MongoDB)
function updateFavouritesInBackend(userId, favourite) {
  fetch('https://amazon-project-sta4.onrender.com/api/user/favourites', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Use token for authentication
    },
    body: JSON.stringify({ userId, favourite }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update favourites on backend');
    }
    console.log('Favourites updated successfully');
  })
  .catch(error => {
    console.error('Error updating favourites on backend:', error);
  });
}

window.onload = async function () {
  if (document.location.pathname.includes('favourites.html')) {
    const favouriteProductsContainer = document.getElementById('favourite-products-container');
    if (!favouriteProductsContainer) {
      console.error('favourite-products-container not found!');
      return;
    }

    // Fetch products first
    try {
      const response = await fetch('https://amazon-project-sta4.onrender.com/api/products'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      products = await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return;
    }

    // Get favourite product IDs from localStorage
    const favouriteIds = JSON.parse(localStorage.getItem('favourite')) || [];

    // Filter the products that are marked as favourites
    const favouriteProducts = products.filter(product => favouriteIds.includes(product.id));

    // Render favourite products
    if (favouriteProducts.length === 0) {
      favouriteProductsContainer.innerHTML = `
        <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
        <button class="button-primary shop-now-button">
          <a href="amazon.html">Shop Now</a>
        </button>`;
    } else {
      favouriteProductsContainer.innerHTML = ''; // Clear existing content
      favouriteProducts.forEach(product => {
        const productHTML = `
          <div class="product-container">
            <svg class="favourites-style js-favourites-${product.id} favourite-active" 
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
          </div>`;
        favouriteProductsContainer.innerHTML += productHTML;
      });
    }

    // Call favouritesListener after the products are rendered
    favouritesListener();
  }
};

function favouritesListener() {
  const favouriteIcons = document.querySelectorAll('.favourites-style');

  favouriteIcons.forEach((icon) => {
    const productId = icon.dataset.favouritesId;
    if (!productId) {
      console.error("Missing data-favourites-id for icon:", icon);
      return;
    }

    icon.addEventListener('click', () => {
      console.log(`Clicked Product ID: ${productId}`);

      // Toggle 'favourite-active' class
      icon.classList.toggle('favourite-active');

      if (icon.classList.contains('favourite-active')) {
        addFavourite(productId);
      } else {
        removeFavourite(productId);

        // Remove the product from the page
        const productContainer = icon.closest('.product-container');
        if (productContainer) {
          productContainer.remove();
        }
      }

      const remainingProducts = document.querySelectorAll('.product-container');
      if (remainingProducts.length === 0) {
        // Update the container to show No Items picture
        const favouriteProductsContainer = document.getElementById('favourite-products-container');
        favouriteProductsContainer.innerHTML = '<div class="empty-cart-container"><img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"></div> <button class="button-primary shop-now-button"><a href="amazon.html">Shop Now</button>';
      }
      localStorage.setItem('favourite', JSON.stringify(favourite));
      console.log('Updated Favourites:', JSON.parse(localStorage.getItem('favourite')));
    });
  });
}