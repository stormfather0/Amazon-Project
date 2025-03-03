// // import { favouritesListener } from '../scripts/amazon.js';



// // import { products } from '../data/products.js'; 
// import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
// import {formatCurrency} from '../scripts/utils/money.js';


// // Fetch products data from backend==================================================================
// let products = [];


// fetch('https://amazon-project-sta4.onrender.com/api/products') 
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Failed to fetch products');
//     }
//     return response.json();
//   })
//   .then(data => {
//     products = data; // Assign fetched data to products
//     // console.log('Products fetched successfully:', products);
//   })
//   .catch(error => {
//     console.error('Error fetching products:', error);
//   });
// //=================================================================================================

// // Initialize favourite array (this will hold product IDs or product objects)
// const favourite = JSON.parse(localStorage.getItem('favourite')) || [];

// // Function to add a product to the favourite array
// export function addFavourite(productId) {
//   // Add product ID to the array if not already in the list
//   if (!favourite.includes(productId)) {
//     favourite.push(productId);
//     // Save updated array to localStorage
//     localStorage.setItem('favourite', JSON.stringify(favourite));
//   }
// }

// // Function to remove a product from the favourite array
// export function removeFavourite(productId) {
//   const index = favourite.indexOf(productId);
//   if (index > -1) {
//     favourite.splice(index, 1);
//     // Save updated array to localStorage
//     localStorage.setItem('favourite', JSON.stringify(favourite));
//   }
// }

// // Function to check if a product is in the favourite array
// export function isFavourite(productId) {
//   return favourite.includes(productId);
// }

// // Export functions for use in other files
// // export { addFavourite, removeFavourite, isFavourite, favourite };




// window.onload = async function () {
//     if (document.location.pathname.includes('favourites.html')) {
//         const favouriteProductsContainer = document.getElementById('favourite-products-container');
//         if (!favouriteProductsContainer) {
//             console.error('favourite-products-container not found!');
//             return;
//         }

//         // Fetch products first
//         try {
//             const response = await fetch('https://amazon-project-sta4.onrender.com/api/products'); // Replace with your API endpoint
//             if (!response.ok) {
//                 throw new Error('Failed to fetch products');
//             }
//             products = await response.json(); // Assign fetched data to products
//             console.log('Products fetched successfully:', products);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             return;
//         }

//         // Get favourite product IDs from localStorage
//         const favouriteIds = JSON.parse(localStorage.getItem('favourite')) || [];

//         // Filter the products that are marked as favourites
//         const favouriteProducts = products.filter(product => favouriteIds.includes(product.id));

//         // Render favourite products
//         if (favouriteProducts.length === 0) {
//             favouriteProductsContainer.innerHTML = `
//                 <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
//                 <button class="button-primary shop-now-button">
//                     <a href="amazon.html">Shop Now</a>
//                 </button>`;
//         } else {
//             favouriteProductsContainer.innerHTML = ''; // Clear existing content
//             favouriteProducts.forEach(product => {
//                 const productHTML = `
//                 <div class="product-container">
//                     <svg class="favourites-style js-favourites-${product.id} favourite-active" 
//                          data-favourites-id="${product.id}" 
//                          width="30px" 
//                          height="20px" 
//                          viewBox="0 0 24 24" 
//                          role="img" 
//                          xmlns="http://www.w3.org/2000/svg" 
//                          aria-labelledby="favouriteIconTitle" 
//                          stroke="#000000" 
//                          stroke-width="2" 
//                          stroke-linecap="round" 
//                          stroke-linejoin="round" 
//                          fill="none" 
//                          color="#000000">
//                         <title id="favouriteIconTitle">Favourite</title> 
//                         <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"/> 
//                     </svg>
//                     <div class="product-image-container">
//                         <a href="product.html?id=${product.id}">
//                         <img class="product-image" src="${product.image}">
//                         </a>
//                     </div>
//                     <div class="product-name limit-text-to-2-lines">
//                         ${product.name}
//                     </div>
//                     <div class="product-rating-container">
//                         <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
//                         <div class="product-rating-count link-primary">
//                             ${product.rating.count}
//                         </div>
//                     </div>
//                     <div class="product-price">
//                         $${formatCurrency(product.priceCents)}
//                     </div>
//                     <div class="product-quantity-container">
//                         <select>
//                             ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
//                         </select>
//                     </div>
//                     <div class="product-spacer"></div>
//                     <div class="added-to-cart">
//                         <img src="images/icons/checkmark.png"> Added
//                     </div>
//                     <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
//                         Add to Cart
//                     </button>
//                 </div>`;
//                 favouriteProductsContainer.innerHTML += productHTML;
//             });
//         }

//         // Call favouritesListener after the products are rendered
//         favouritesListener();
//     }
// };
// function favouritesListener() {

//     const favouriteIcons = document.querySelectorAll('.favourites-style');
  
//     favouriteIcons.forEach((icon) => {
  

//         const productId = icon.dataset.favouritesId;
//         if (!productId) {
//             console.error("Missing data-favourites-id for icon:", icon);
//             return;
//         }

//         icon.addEventListener('click', () => {
//             console.log(`Clicked Product ID: ${productId}`);

//             // Toggle 'favourite-active' class
//             icon.classList.toggle('favourite-active');

//             if (icon.classList.contains('favourite-active')) {
//                 addFavourite(productId);
//             } else {
//                 removeFavourite(productId);

//                 // Remove the product from the page
//                 const productContainer = icon.closest('.product-container');
//                 if (productContainer) {
//                     productContainer.remove();
//                 }
//             }
            
//             const remainingProducts = document.querySelectorAll('.product-container');
//         if (remainingProducts.length === 0) {
//             // Update the container to show No Items picture
//             const favouriteProductsContainer = document.getElementById('favourite-products-container');
//             favouriteProductsContainer.innerHTML = '<div class="empty-cart-container"><img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"></div> <button class="button-primary shop-now-button"><a href="amazon.html">Shop Now</button>';
//         }
//             localStorage.setItem('favourite', JSON.stringify(favourite));
//             console.log('Updated Favourites:', JSON.parse(localStorage.getItem('favourite')));
//         });
//     });
// }




// // document.addEventListener('click', (event) => {
// //     if (event.target && event.target.classList.contains('js-add-to-cart')) {
// //       const button = event.target;
// //       const productId = button.dataset.productId;
// //       const quantitySelect = button.closest('.product-container').querySelector('.product-quantity-container select');
// //       const quantity = parseInt(quantitySelect.value, 10);
  
// //       addToCart(productId, quantity);
// //       updateCartQuantity();
// //     }
// //   });

// //    function updateCartQuantity() {
// //     const cartQuantity = calculateCartQuantity();
// //     document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
// //   }










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
        console.warn('❌ favourite-products-container element not found!');
        return;
    }

    if (favouriteProducts.length === 0) {
        favouriteProductsContainer.innerHTML = `
            <img src="images/cart.png" alt="Empty Cart" class="empty-cart-image"> 
            <button class="button-primary shop-now-button">
                <a href="amazon.html">Shop Now</a>
            </button>`;
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

document.addEventListener("DOMContentLoaded", () => {
    favouritesListener();
  });



// ✅ Function to add a product to user's favorites in MongoDB
export async function addFavourite(productId) {
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
export async function removeFavourite(productId) {
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

// export async function isFavourite(productId) {
//     try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             console.error('❌ No authToken found!');
//             return false;
//         }

//         const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites', {
//             headers: { 'Authorization': token }
           
            
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch favorites');
//         }

//         const data = await response.json();

//         // Check if the product ID exists in the user's favorites
//         return data.favorites.includes(productId);
//     } catch (error) {
//         console.error('❌ Error checking favorite:', error);
//         return false;
//     }
// }





export async function favouritesListenerPages() {
    try {
        const token = localStorage.getItem('authToken');
  
        // Fetch user favorites only if logged in
        let userFavorites = new Set();
        if (token) {
            const response = await fetch('https://amazon-project-sta4.onrender.com/api/favorites', {
                headers: { 'Authorization': token }
            });
  
            if (response.ok) {
                const data = await response.json();
                console.log('📝 API Response:', data);
  
                const favoritesArray = Array.isArray(data.favorites) ? data.favorites : []; 
                userFavorites = new Set(favoritesArray.map(String));
            } else {
                throw new Error('❌ Failed to fetch user favorites');
            }
        }
  
        console.log('✅ User favorites:', userFavorites);
  
        setTimeout(() => {
            document.querySelectorAll('.favourites-style').forEach((icon) => {
                const productId = String(icon.dataset.favouritesId);
  
                // Apply favorite-active class
                if (userFavorites.has(productId)) {
                    icon.classList.add('favourite-active');
                } else {
                    icon.classList.remove('favourite-active');
                }
  
                // Clone and replace to remove previous event listeners
                const newIcon = icon.cloneNode(true);
                icon.replaceWith(newIcon);
  
                newIcon.addEventListener('click', async () => {
                    const token = localStorage.getItem('authToken'); // Re-check auth on click
  
                    if (!token) {
                        console.warn('⚠️ No authToken found! Opening login popup...');
                        openLoginPopup(); 
                        return;
                    }
  
                    newIcon.classList.toggle('favourite-active');
  
                    try {
                        if (newIcon.classList.contains('favourite-active')) {
                            await addFavourite(productId);
                        } else {
                            await removeFavourite(productId);
                        }
                    } catch (error) {
                        console.error('❌ Error updating favorite:', error);
                    }
                });
            });
        }, 300);
    } catch (error) {
        console.error('❌ Error loading favorites:', error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    favouritesListenerPages();
  });
  











