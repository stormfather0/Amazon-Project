import { cart, addToCart, calculateCartQuantity, updateCartQuantity } from '../data/cart.js';

// Fetch and display user favorites
async function loadFavoritesAndDisplay() {
    const favouriteProductsContainer = document.getElementById('favourite-products-container');
    if (!favouriteProductsContainer) {
        console.error('❌ favourite-products-container element not found!');
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('❌ No authToken found!');
            window.location.href = 'login.html';
            return;
        }

        favouriteProductsContainer.innerHTML = '<p>Loading favorites...</p>';

        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites', { headers });

        if (!response.ok) throw new Error(`❌ Server error: ${response.status}`);
        const data = await response.json();
        console.log('✅ Fetched Favorite Products:', data);

        displayFavoriteProducts(data.favorites || []);
        favouritesListener();

    } catch (error) {
        console.error('❌ Error loading favorites:', error);
        favouriteProductsContainer.innerHTML = `
            <div class="empty-cart-container">
                <p>Error loading favorites. Please try again later.</p>
            </div>`;
    }
}

// Display favorite products
function displayFavoriteProducts(favoriteProducts) {
    const favouriteProductsContainer = document.getElementById('favourite-products-container');

    if (favoriteProducts.length === 0) {
        favouriteProductsContainer.innerHTML = `
            <div class="empty-cart-container">
                <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
                <button class="shop-now-button">
                    <a href="amazon.html">Shop Now</a>
                </button>
            </div>`;
        return;
    }

    favouriteProductsContainer.innerHTML = '';

    favoriteProducts.forEach(product => {
        const productHTML = `
            <div class="product-container" data-product-id="${product.id}">
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
                    $${(product.priceCents / 100).toFixed(2)}
                </div>
                <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>`;
        favouriteProductsContainer.innerHTML += productHTML;
    });
}

// Function to listen for clicks on favorite icons
function favouritesListener() {
    const favouriteIcons = document.querySelectorAll('.favourites-style');

    favouriteIcons.forEach((icon) => {
        const productId = icon.dataset.favouritesId;

        icon.addEventListener('click', async () => {
            console.log(`🖱️ Clicked Product ID: ${productId}`);
            icon.classList.toggle('favourite-active');

            if (icon.classList.contains('favourite-active')) {
                await addFavourite(productId);
            } else {
                await removeFavourite(productId);
                const productContainer = icon.closest('.product-container');
                if (productContainer) {
                    productContainer.remove();

                    // Check if container is empty
                    const remainingProducts = document.querySelectorAll('.product-container');
                    if (remainingProducts.length === 0) {
                        document.getElementById('favourite-products-container').innerHTML = `
                            <div class="empty-cart-container">
                                <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image">
                                <button class="shop-now-button">
                                    <a href="amazon.html">Shop Now</a>
                                </button>
                            </div>`;
                    }
                }
            }
        });
    });
}

// Function to add a product to user's favorites
async function addFavourite(productId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('❌ No authToken found!');

        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) throw new Error(`❌ Failed to add favorite: ${response.status}`);
        console.log(`✅ Product ${productId} added to favorites!`);
    } catch (error) {
        console.error('❌ Error adding favorite:', error);
    }
}

// Function to remove a product from user's favorites
async function removeFavourite(productId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('❌ No authToken found!');

        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites/remove', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) throw new Error(`❌ Failed to remove favorite: ${response.status}`);
        console.log(`✅ Product ${productId} removed from favorites!`);
    } catch (error) {
        console.error('❌ Error removing favorite:', error);
    }
}

// Check if a product is a favorite
export async function isFavourite(productId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('❌ No authToken found!');

        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data = await response.json();
        return data.favorites.includes(String(productId));
    } catch (error) {
        console.error('❌ Error checking favorite:', error);
        return false;
    }
}

// Add to cart event listener
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-add-to-cart')) {
        const button = event.target;
        const productId = button.dataset.productId;
        const quantity = 1; // Default quantity since no select element is present

        addToCart(productId, quantity);
        updateCartQuantity();

        const popup = document.getElementById('cart-popup');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 3000);
    }
});

// Run on page load
window.onload = loadFavoritesAndDisplay;