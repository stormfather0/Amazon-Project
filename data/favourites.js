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
export function addFavourite(productId) {
  // Add product ID to the array if not already in the list
  if (!favourite.includes(productId)) {
    favourite.push(productId);
    // Save updated array to localStorage
    localStorage.setItem('favourite', JSON.stringify(favourite));
  }
}

// Function to remove a product from the favourite array
export function removeFavourite(productId) {
  const index = favourite.indexOf(productId);
  if (index > -1) {
    favourite.splice(index, 1);
    // Save updated array to localStorage
    localStorage.setItem('favourite', JSON.stringify(favourite));
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
        if (!favouriteProductsContainer) {
            console.error('favourite-products-container not found!');
            return;
        }

        // Fetch products first
        let products = [];
        try {
            const response = await fetch('https://amazon-project-sta4.onrender.com/api/products'); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            products = await response.json();
            console.log('Products fetched successfully:', products);
        } catch (error) {
            console.error('Error fetching products:', error);
            return;
        }

        // Fetch favorite product IDs from backend
        let favouriteIds = [];
        try {
            const userId = localStorage.getItem('userId'); // Ensure userId is available
            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }

            const favResponse = await fetch(`https://amazon-project-sta4.onrender.com/api/favourites/${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (!favResponse.ok) {
                throw new Error('Failed to fetch favourite product IDs');
            }

            const favData = await favResponse.json();
            favouriteIds = favData.favourites || []; // Assuming API returns { favourites: [id1, id2] }
            console.log('Favourite product IDs fetched from backend:', favouriteIds);
        } catch (error) {
            console.error('Error fetching favourite product IDs:', error);
            return;
        }

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