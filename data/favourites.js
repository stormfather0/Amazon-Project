import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
import { formatCurrency } from '../scripts/utils/money.js';

let products = [];

// Fetch products from backend
async function fetchProducts() {
    try {
        const response = await fetch('https://amazon-project-sta4.onrender.com/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch user favourites from backend
async function fetchAndStoreFavourites() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. User might not be logged in.");
            return;
        }

        const response = await fetch("https://amazon-project-sta4.onrender.com/api/favorites", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch favorites");

        const data = await response.json();
        console.log("✅ Fetched favorites:", data.favorites);

        localStorage.setItem("favorites", JSON.stringify(data.favorites));
    } catch (error) {
        console.error("❌ Error fetching favourites:", error);
    }
}

// Add to favourites
export function addFavourite(productId) {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
        alert('You need to log in to add favorites.');
        return;
    }

    fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ userId, productId }),
    })
    .then(response => response.json())
    .then(data => console.log('Favourite added:', data))
    .catch(error => console.error('Error adding favourite:', error));
}

// Remove from favourites
export function removeFavourite(productId) {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
        alert('You need to log in to remove favorites.');
        return;
    }

    fetch('https://amazon-project-sta4.onrender.com/api/favourites', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ userId, productId }),
    })
    .then(response => response.json())
    .then(data => console.log('Favourite removed:', data))
    .catch(error => console.error('Error removing favourite:', error));
}

// Check if product is in favourites
export function isFavourite(productId, favourites) {
    return favourites.includes(productId);
}

// Load favourite products on page load
window.onload = async function () {
    if (document.location.pathname.includes('favourites.html')) {
        const favouriteProductsContainer = document.getElementById('favourite-products-container');
        if (!favouriteProductsContainer) {
            console.error('favourite-products-container not found!');
            return;
        }

        await fetchProducts();
        const favouriteIds = await fetchUserFavourites();
        const favouriteProducts = products.filter(product => favouriteIds.includes(product.id));

        if (favouriteProducts.length === 0) {
            favouriteProductsContainer.innerHTML = `
                <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
                <button class="button-primary shop-now-button">
                    <a href="amazon.html">Shop Now</a>
                </button>`;
        } else {
            favouriteProductsContainer.innerHTML = favouriteProducts.map(product => createProductHTML(product)).join('');
        }

        setupFavouriteListeners();
    }
};

// Create HTML for favourite products
function createProductHTML(product) {
    return `
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
            <div class="product-name limit-text-to-2-lines">${product.name}</div>
            <div class="product-rating-container">
                <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">${product.rating.count}</div>
            </div>
            <div class="product-price">$${formatCurrency(product.priceCents)}</div>
            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>`;
}

// Set up event listeners for favourite icons
function setupFavouriteListeners() {
    document.querySelectorAll('.favourites-style').forEach(icon => {
        const productId = icon.dataset.favouritesId;

        icon.addEventListener('click', async () => {
            icon.classList.toggle('favourite-active');

            if (icon.classList.contains('favourite-active')) {
                addFavourite(productId);
            } else {
                removeFavourite(productId);
                const productContainer = icon.closest('.product-container');
                if (productContainer) productContainer.remove();
            }

            const remainingProducts = document.querySelectorAll('.product-container');
            if (remainingProducts.length === 0) {
                document.getElementById('favourite-products-container').innerHTML = `
                    <div class="empty-cart-container">
                        <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image">
                    </div> 
                    <button class="button-primary shop-now-button">
                        <a href="amazon.html">Shop Now</a>
                    </button>`;
            }
        });
    });
}