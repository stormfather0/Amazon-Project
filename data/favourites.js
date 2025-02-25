import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
import { formatCurrency } from '../scripts/utils/money.js';

// The rest of your code...

// Fetch products data from backend (Ensuring it's fully loaded before use)
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://amazon-project-sta4.onrender.com/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        products = await response.json();
        return products; // Ensure the function returns the products
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Return an empty array in case of failure
    }
}

// Get stored favourites from localStorage
const favourite = JSON.parse(localStorage.getItem('favourite')) || [];

// Function to add a favourite
export function addFavourite(productId) {
    if (!favourite.includes(productId)) {
        favourite.push(productId);
        localStorage.setItem('favourite', JSON.stringify(favourite));
    }

    // Send the favourite to the backend and MongoDB
    fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Favourite added:', data);
    })
    .catch(error => console.error('Error adding favourite:', error));
}

// Function to remove a favourite
export function removeFavourite(productId) {
    const index = favourite.indexOf(productId);
    if (index !== -1) {
        favourite.splice(index, 1);
        localStorage.setItem('favourite', JSON.stringify(favourite));
    }

    // Remove the favourite from the backend and MongoDB
    fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Favourite removed:', data);
    })
    .catch(error => console.error('Error removing favourite:', error));
}

export function isFavourite(productId) {
    return favourite.includes(productId);
}

// Event Listener for Favourite Icons
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
                favouriteProductsContainer.innerHTML = `
                    <div class="empty-cart-container">
                        <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image">
                    </div> 
                    <button class="button-primary shop-now-button">
                        <a href="amazon.html">Shop Now</a>
                    </button>`;
            }
            localStorage.setItem('favourite', JSON.stringify(favourite));
        });
    });
}

// On window load, display favourites if on favourites.html
window.onload = async function () {
    if (document.location.pathname.includes('favourites.html')) {
        const favouriteProductsContainer = document.getElementById('favourite-products-container');
        if (!favouriteProductsContainer) {
            console.error('favourite-products-container not found!');
            return;
        }

        await fetchProducts(); // Ensure products are fetched before filtering

        const favouriteIds = JSON.parse(localStorage.getItem('favourite')) || [];
        const favouriteProducts = products.filter(product => favouriteIds.includes(product._id)); // Use _id if required

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
                    <svg class="favourites-style js-favourites-${product._id} favourite-active" 
                         data-favourites-id="${product._id}" 
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
                        <a href="product.html?id=${product._id}">
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
                    <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product._id}">
                        Add to Cart
                    </button>
                </div>`;
                favouriteProductsContainer.innerHTML += productHTML;
            });
        }

        favouritesListener(); // Ensure listeners are attached
    }
};