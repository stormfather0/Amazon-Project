import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
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

// Get userId from localStorage (assuming the user is logged in and the userId is stored after login)
const userId = localStorage.getItem('userId');
if (!userId) {
  console.error('User not logged in');
}

const favourite = JSON.parse(localStorage.getItem('favourite')) || [];
function getUserIdFromServer() {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log('Token:', token);  // Log the token to check if it's stored properly
  
    if (!token) {
      console.error("No token found, user not authenticated.");
      return Promise.resolve(null); // Return a resolved promise with null if no token
    }
  
    return fetch('https://amazon-project-sta4.onrender.com/api/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to get user ID');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data from server:', data); // Log the response data
        return data.userId; // Assuming userId is returned in the response
      })
      .catch(error => {
        console.error('Error fetching user ID:', error);
        return null; // Return null if there's an error
      });
  }
  
  export function addFavourite(productId) {
    getUserIdFromServer().then(userId => {
      console.log('User ID:', userId); // Log the userId here to check what is returned
  
      if (!userId) {
        console.error("User ID is missing, can't add favourite.");
        return; // Exit the function if there's no userId
      }
  
      const favourite = JSON.parse(localStorage.getItem('favourite')) || [];
      if (!favourite.includes(productId)) {
        favourite.push(productId);
        localStorage.setItem('favourite', JSON.stringify(favourite));
  
        // Send favourite to backend with userId
        fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId }), // Include userId here
        })
          .then(response => response.json())
          .then(data => console.log('Favourite added:', data))
          .catch(error => console.error('Error adding favourite:', error));
      }
    }).catch(error => {
      console.error("Error in getUserIdFromServer:", error);
    });
  }
export function removeFavourite(productId) {
  const index = favourite.indexOf(productId);
  if (index > -1) {
    favourite.splice(index, 1);
    localStorage.setItem('favourite', JSON.stringify(favourite));
  }

  // Optionally, you can remove the favourite from the backend as well
  fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId }),  // Send userId and productId to remove from backend
  })
    .then(response => response.json())
    .then(data => console.log('Favourite removed:', data))
    .catch(error => console.error('Error removing favourite:', error));
}

export function isFavourite(productId) {
  return favourite.includes(productId);
}

window.onload = async function () {
  if (document.location.pathname.includes('favourites.html')) {
    const favouriteProductsContainer = document.getElementById('favourite-products-container');
    if (!favouriteProductsContainer) {
      console.error('favourite-products-container not found!');
      return;
    }

    try {
      const response = await fetch('https://amazon-project-sta4.onrender.com/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      products = await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return;
    }

    const favouriteIds = JSON.parse(localStorage.getItem('favourite')) || [];
    const favouriteProducts = products.filter(product => favouriteIds.includes(product.id));

    if (favouriteProducts.length === 0) {
      favouriteProductsContainer.innerHTML = `
        <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
        <button class="button-primary shop-now-button">
            <a href="amazon.html">Shop Now</a>
        </button>`;
    } else {
      favouriteProductsContainer.innerHTML = '';
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
            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>`;
        favouriteProductsContainer.innerHTML += productHTML;
      });
    }

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
      icon.classList.toggle('favourite-active');

      if (icon.classList.contains('favourite-active')) {
        addFavourite(productId);
      } else {
        removeFavourite(productId);
        const productContainer = icon.closest('.product-container');
        if (productContainer) {
          productContainer.remove();
        }
      }

      const remainingProducts = document.querySelectorAll('.product-container');
      if (remainingProducts.length === 0) {
        const favouriteProductsContainer = document.getElementById('favourite-products-container');
        favouriteProductsContainer.innerHTML = '<div class="empty-cart-container"><img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"></div> <button class="button-primary shop-now-button"><a href="amazon.html">Shop Now</a></button>';
      }
      localStorage.setItem('favourite', JSON.stringify(favourite));
    });
  });
}