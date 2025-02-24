// import { favouritesListener } from '../scripts/amazon.js';



// import { products } from '../data/products.js'; 
import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {formatCurrency} from '../scripts/utils/money.js';


// Fetch products data from backend==================================================================
let products = [];
fetch('https://amazon-project-sta4.onrender.com/api/products') 
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then(data => {
    products = data; // Assign fetched data to products
    // console.log('Products fetched successfully:', products);
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });
//=================================================================================================

// Initialize favourite array (this will hold product IDs or product objects)
const favourite = JSON.parse(localStorage.getItem('favourite')) || [];

// Function to add a product to the favourite array
async function addFavourite(productId) {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      alert('Please log in to add favourites.');
      window.location.href = 'login.html'; // Redirect to login page
      return;
    }
  
    try {
      const response = await fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) throw new Error('Failed to add favourite');
  
      const data = await response.json();
      console.log('Favourite added:', data.favourites);
    } catch (error) {
      console.error(error);
    }
  }

// Function to remove a product from the favourite array
async function removeFavourite(productId) {
    try {
      const response = await fetch(`https://amazon-project-sta4.onrender.com/api/favourites/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error('Failed to remove favourite');
  
      const data = await response.json();
      console.log('Favourite removed:', data.favourites);
    } catch (error) {
      console.error(error);
    }
  }

// Function to check if a product is in the favourite array
export function isFavourite(productId) {
  return favourite.includes(productId);
}

// Export functions for use in other files
// export { addFavourite, removeFavourite, isFavourite, favourite };




window.onload = async function () {
    if (document.location.pathname.includes('favourites.html')) {
      const favouriteProductsContainer = document.getElementById('favourite-products-container');
  
      try {
        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favourites', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch favourites');
  
        const favouriteIds = await response.json();
  
        // Fetch products
        const productsResponse = await fetch('https://amazon-project-sta4.onrender.com/api/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const products = await productsResponse.json();
  
        const favouriteProducts = products.filter(product => favouriteIds.includes(product.id));
  
        // Render favourite products
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
                     data-favourites-id="${product.id}" width="30px" height="20px">
                </svg>
                <div class="product-name">${product.name}</div>
                <img class="product-image" src="${product.image}">
                <button class="remove-favourite" data-product-id="${product.id}">Remove</button>
              </div>`;
          });
        }
  
        favouritesListener();
      } catch (error) {
        console.error('Error loading favourites:', error);
      }
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




// document.addEventListener('click', (event) => {
//     if (event.target && event.target.classList.contains('js-add-to-cart')) {
//       const button = event.target;
//       const productId = button.dataset.productId;
//       const quantitySelect = button.closest('.product-container').querySelector('.product-quantity-container select');
//       const quantity = parseInt(quantitySelect.value, 10);
  
//       addToCart(productId, quantity);
//       updateCartQuantity();
//     }
//   });

//    function updateCartQuantity() {
//     const cartQuantity = calculateCartQuantity();
//     document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
//   }