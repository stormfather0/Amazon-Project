// ✅ Fetch and display user favorites when page loads
async function loadFavoritesAndDisplay() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('❌ No authToken found in localStorage!');
            return;
        }

        const headers = { 'Authorization': token };
        console.log('🔍 Sending Headers:', headers);

        // Fetch user favorites
        const favResponse = await fetch('https://amazon-project-sta4.onrender.com/api/favorites', { headers });

        if (!favResponse.ok) {
            throw new Error(`❌ Server error: ${favResponse.status}`);
        }

        const favData = await favResponse.json();
        console.log('✅ Fetched Favorites:', favData);

        if (!favData.favorites || favData.favorites.length === 0) {
            console.warn("⚠️ User has no favorites.");
            displayFavoriteProducts([]); // Display empty cart UI
            return;
        }

        // Fetch all products
        const prodResponse = await fetch('https://amazon-project-sta4.onrender.com/api/products');
        if (!prodResponse.ok) {
            throw new Error('❌ Failed to fetch products');
        }

        const products = await prodResponse.json();
        console.log('✅ Products fetched successfully:', products);

        // Ensure product IDs are compared correctly
        const favoriteProducts = products.filter(product =>
            favData.favorites.includes(String(product.id)) // Convert product.id to string for comparison
        );

        console.log('🎯 User’s Favorite Products:', favoriteProducts);

        // ✅ Call function to display favorite products
        displayFavoriteProducts(favoriteProducts);
        favouritesListener(); // Attach event listeners

    } catch (error) {
        console.error('❌ Error loading favorites and products:', error);
    }
}

// ✅ Function to display favorite products
function displayFavoriteProducts(favouriteProducts) {
    const favouriteProductsContainer = document.getElementById('favourite-products-container');

    if (!favouriteProductsContainer) {
        console.error('❌ favourite-products-container element not found!');
        return;
    }

    if (favouriteProducts.length === 0) {
        favouriteProductsContainer.innerHTML = `
           <div class="empty-cart-container">
    <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
    <button class="shop-now-button">
        <a href="amazon.html">Shop Now</a>
    </button>
</div>
`;
        return;
    }

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
                    $${(product.priceCents / 100).toFixed(2)}
                </div>
                <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>`;

        favouriteProductsContainer.innerHTML += productHTML;
    });

    favouritesListener(); // Reattach event listeners
}

// ✅ Function to listen for clicks on favorite icons
function favouritesListener() {
    const favouriteIcons = document.querySelectorAll('.favourites-style');

    favouriteIcons.forEach((icon) => {
        const productId = icon.dataset.favouritesId;
        if (!productId) {
            console.error("❌ Missing data-favourites-id for icon:", icon);
            return;
        }

        icon.addEventListener('click', async () => {
            console.log(`🖱️ Clicked Product ID: ${productId}`);

            // Toggle 'favourite-active' class
            icon.classList.toggle('favourite-active');

            if (icon.classList.contains('favourite-active')) {
                await addFavourite(productId);
            } else {
                await removeFavourite(productId);

                // Remove the product from the page if it's no longer a favorite
                const productContainer = icon.closest('.product-container');
                if (productContainer) {
                    productContainer.remove();
                }
            }

            // Check if there are any remaining favorite products
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
        });
    });
}

// ✅ Function to add a product to user's favorites in MongoDB
async function addFavourite(productId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('❌ No authToken found in localStorage!');
            return;
        }

        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites/add', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to add favorite: ${response.status}`);
        }

        console.log(`✅ Product ${productId} added to favorites!`);
    } catch (error) {
        console.error('❌ Error adding favorite:', error);
    }
}

// ✅ Function to remove a product from user's favorites in MongoDB
async function removeFavourite(productId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('❌ No authToken found in localStorage!');
            return;
        }

        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites/remove', {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to remove favorite: ${response.status}`);
        }

        console.log(`✅ Product ${productId} removed from favorites!`);
    } catch (error) {
        console.error('❌ Error removing favorite:', error);
    }
}

// ✅ Ensure this function runs when the page loads
window.onload = loadFavoritesAndDisplay;



//===========NEXT

export async function isFavourite(productId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('❌ No authToken found!');
            return false;
        }

        const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites', {
            headers: { 'Authorization': token }
           
            
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();

        // Check if the product ID exists in the user's favorites
        return data.favorites.includes(productId);
    } catch (error) {
        console.error('❌ Error checking favorite:', error);
        return false;
    }
}