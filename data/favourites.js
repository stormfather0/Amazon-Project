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

// Get userId from localStorage
const userId = localStorage.getItem('userId');
if (!userId) {
  console.error('User not logged in');
}

const favourite = JSON.parse(localStorage.getItem('favourite')) || [];
const token = localStorage.getItem('authToken');
if (!token) {
    console.error("No token found, user not authenticated.");
    // You can handle this case by redirecting to login or showing a message
}

function getUserIdFromServer() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("No token found, user not authenticated.");
        return;
    }
    return fetch('https://amazon-project-sta4.onrender.com/api/account', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to get user ID');
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched User ID:', data.userId);
        return data.userId;
    })
    .catch(error => {
        console.error('Error fetching user ID:', error);
        return null;
    });
}


export function addFavourite(productId) {
    getUserIdFromServer()
    .then(userId => {
        console.log('User ID from server:', userId); // Debugging

        if (!userId) {
            alert("User not authenticated. Please log in to add favourites.");
            console.error("User ID is missing, can't add favourite.");
            return;
        }

        // Send request to backend to save favourite
        fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Send token
            },
            body: JSON.stringify({ userId, productId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add favourite');
            }
            return response.json();
        })
        .then(data => {
            console.log('Favourite added:', data);
            // Optionally, update the UI here if needed
        })
        .catch(error => console.error('Error adding favourite:', error));
    })
    .catch(error => {
        console.error("Error in getUserIdFromServer:", error);
    });
}

export function removeFavourite(productId) {
  const index = favourite.indexOf(productId);
  if (index > -1) {
    favourite.splice(index, 1);
    localStorage.setItem('favourite', JSON.stringify(favourite));
  }
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
        favouriteProductsContainer.innerHTML += `
        <div class="product-container">
            <svg class="favourites-style js-favourites-${product.id} favourite-active" 
                 data-favourites-id="${product.id}" width="30px" height="20px" 
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>`;
      });
    }
    favouritesListener();
  }
};

function favouritesListener() {
  document.querySelectorAll('.favourites-style').forEach(icon => {
    const productId = icon.dataset.favouritesId;
    if (!productId) return;
    icon.addEventListener('click', () => {
      icon.classList.toggle('favourite-active');
      if (icon.classList.contains('favourite-active')) {
        addFavourite(productId);
      } else {
        removeFavourite(productId);
        icon.closest('.product-container')?.remove();
      }
      if (!document.querySelectorAll('.product-container').length) {
        document.getElementById('favourite-products-container').innerHTML = `
          <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image">
          <button class="button-primary shop-now-button"><a href="amazon.html">Shop Now</a></button>`;
      }
    });
  });
}


console.log("Received Token:", token);