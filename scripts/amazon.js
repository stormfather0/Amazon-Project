import { cart, addToCart, calculateCartQuantity, updateCartQuantity } from '../data/cart.js';
// import {products} from '../data/products.js';
// import { UpdateCartPrice } from '../';
import { formatCurrency } from './utils/money.js';
import { addFavourite, removeFavourite, } from '../data/favourites.js';
import { API_BASE_URL } from "../config.js";
import { openLoginPopup, isUserLoggedIn, getAuthToken } from '../login.js';




// Fetch Products from API
export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await response.json();
    
    // Store products globally for later use
    window.products = products; // Store products in a global variable
    


    //
    displaySpecialOfferProducts(products);

    // Get the current page from the URL or default to 1
    const pageFromURL = new URLSearchParams(window.location.search).get('page') || 1;
    currentPage = parseInt(pageFromURL, 10); // Set currentPage based on the URL
    
    // Display the products for the current page
    displayProducts();
    
    // Initialize favourites listener
    favouritesListener();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

fetchProducts();

// Generate Product HTML
export function generateProductHTML(products) {
  let productsHTML = '';

  products.forEach((product) => {

     // Check if the product has a 'madeIn' 
     let madeInImage = '';
     if (product.madeIn === "UAE") {
      madeInImage = '<img class="made-in-image" src="images/madeIn/uae.png" alt="Made in UAE" />';
    } else if (product.madeIn === "USA") {
      madeInImage = '<img class="made-in-image" src="images/madeIn/usa.avif" alt="Made in USA" />';
    }

  

    productsHTML += `
      <div class="product-container">
        <svg class="favourites-style js-favourites-${product.id}" 
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
          <a href="product.html?category=${product.type}&id=${product.id}">
          <div class="made-in">${madeInImage}</div>
            <img class="product-image" src="${product.image || product.images[0]}">
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
      </div>  
    `;
  });

  return productsHTML;
}




//Pages for products ==============================================================================================
let productsDisplayed = 0; // To keep track of how many products are displayed
const productsPerPage = 20; // Number of products to display per page
let currentPage = 1; // Keep track of the current page


// Function to display products with pagination logic
function displayProducts() {
  const products = window.products; // Access the global products array
  const productsToShow = products.slice(productsDisplayed, productsDisplayed + productsPerPage);
  
  // Clear the current product grid to prevent adding duplicates
  const productGrid = document.querySelector('.js-products-grid');
  productGrid.innerHTML = ''; 
  productGrid.insertAdjacentHTML('beforeend', generateProductHTML(productsToShow));
  
  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  // Update the pagination controls
  updatePagination(totalPages);
}

// Function to update pagination controls
function updatePagination(totalPages) {
  const paginationContainer = document.getElementById('pagination-container');
  
  // Clear existing pagination
  paginationContainer.innerHTML = '';




// Generate page numbers dynamically
for (let i = 1; i <= totalPages; i++) {
  const pageButton = document.createElement('button');
  pageButton.textContent = i;
  pageButton.classList.add('page-button');
  pageButton.classList.toggle('active', i === currentPage); // Highlight the active page

  pageButton.addEventListener('click', async function () {
    currentPage = i;
    productsDisplayed = (i - 1) * productsPerPage; // Update the products to display based on selected page
    displayProducts(); // Reload the products with the updated count

    // Update the URL with the new page number
    const url = new URL(window.location.href);
    url.searchParams.set('page', i);
    window.history.pushState({}, '', url);

    // Scroll to where .main starts
    const mainElement = document.querySelector('.main');
    if (mainElement) {
      const rect = mainElement.getBoundingClientRect();
      window.scrollTo({ top: rect.top + window.scrollY - 100, behavior: 'smooth' });
    }

    // ✅ Ensure favouritesListener() runs only after new products are loaded
    setTimeout(async () => {
        await favouritesListener();
    }, 300); // Small delay to ensure all products are in the DOM
});

  paginationContainer.appendChild(pageButton);
}
  }








// On click AD button
const navigateButton = document.querySelector('.ad-btn');

// Add an event listener to handle clicks
navigateButton.addEventListener('click', () => {
  window.location.href = 'https://amazon-project-sta4.onrender.com/product.html?id=54e0eccd-8f36-462b-b68a-8182611d9add'; 
});









export async function favouritesListener() {
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
// Update Cart Quantity

document.addEventListener("DOMContentLoaded", () => {
  updateCartQuantity();
});





// Image Slider =============================================================
let currentIndex = 0;
const slides = document.querySelectorAll('.promotion-slide');
const totalSlides = slides.length;
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const indicators = document.querySelectorAll('.indicator');
const slider = document.querySelector('.promotion-slider');
const slideInterval = 5000; 

// Function to move to the next slide
function moveToNextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
}

// Function to move to the previous slide
function moveToPrevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider();
}

// Function to update the slider position
function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateIndicators();
}

// Function to update the active indicator
function updateIndicators() {
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === currentIndex) {
      indicator.classList.add('active');
    }
  });
}

// Auto slide every 5 seconds
let autoSlide = setInterval(moveToNextSlide, slideInterval);

// Manual slide with buttons
prevButton.addEventListener('click', () => {
  clearInterval(autoSlide); 
  moveToPrevSlide();
  autoSlide = setInterval(moveToNextSlide, slideInterval); 
});

nextButton.addEventListener('click', () => {
  clearInterval(autoSlide);
  moveToNextSlide();
  autoSlide = setInterval(moveToNextSlide, slideInterval);
});

// Manual slide with indicators
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    clearInterval(autoSlide);
    currentIndex = index;
    updateSlider();
    autoSlide = setInterval(moveToNextSlide, slideInterval);
  });
});

// Enable dragging/swiping for touch devices
let isDragging = false;
let startX, endX;

slider.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX;
  clearInterval(autoSlide); 
});

slider.addEventListener('mousemove', (e) => {
  if (isDragging) {
    endX = e.pageX;
  }
});

slider.addEventListener('mouseup', () => {
  if (isDragging) {
    if (startX - endX > 50) {
      moveToNextSlide();
    } else if (endX - startX > 50) {
      moveToPrevSlide();
    }
    isDragging = false;
    autoSlide = setInterval(moveToNextSlide, slideInterval); 
  }
});

// Enable touch events for mobile devices
slider.addEventListener(
  'touchstart',
  (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
    clearInterval(autoSlide);
  },
  { passive: true }
);

slider.addEventListener(
  'touchmove',
  (e) => {
    if (isDragging) {
      endX = e.touches[0].pageX;
    }
  },
  { passive: true }
);

slider.addEventListener(
  'touchend',
  () => {
    if (isDragging) {
      if (startX - endX > 50) {
        moveToNextSlide();
      } else if (endX - startX > 50) {
        moveToPrevSlide();
      }
      isDragging = false;
      autoSlide = setInterval(moveToNextSlide, slideInterval); 
    }
  },
  { passive: true }
);



// Popup Message=====================================================================================
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("promotion-banner");
  const closeBtn = document.getElementById("close-promotion");

  // Check if the popup was recently closed
  const popupClosedTime = localStorage.getItem("popupClosedTime");
  const currentTime = new Date().getTime();

  if (!popupClosedTime || currentTime - popupClosedTime > 30 * 60 * 10000) {
    // Show the popup after 10 seconds
    setTimeout(() => {
      popup.classList.remove("hidden");
    }, 10000);
  }

  // Close the popup and set a timestamp in localStorage
  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    localStorage.setItem("popupClosedTime", new Date().getTime());
  });
});
// =================================================================================================





// Scroll to Top Button
document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // Show button after scrolling 100px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  // Scroll to the top when the button is clicked
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});

//Promotion Banner Popup ===============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const adBanner = document.getElementById("promotion-banner");
  const closeAdBtn = document.getElementById("close-promotion");
  const adDisplayDelay = 10 * 1000; // 10 seconds

  if (!adBanner || !closeAdBtn) return; // Prevent errors if elements are missing

  const isAdClosed = localStorage.getItem("adBannerClosed");

  if (!isAdClosed) {
    setTimeout(() => {
      adBanner.classList.remove("hidden");
    }, adDisplayDelay);
  } else {
    adBanner.classList.add("hidden"); // Keep it hidden permanently
  }

  closeAdBtn.addEventListener("click", () => {
    adBanner.classList.add("hidden");
    localStorage.setItem("adBannerClosed", "true"); // Store the permanent flag
  });
});






//Special offers===================================================================================
// Hardcorded special offer product IDs
const specialOfferIds = [
  'bc2847e9-5323-403f-b7cf-57fde044a955',
  'aaa65ef3-8d6f-4eb3-bc9b-a6ea49047d8f',
  '36c64692-677f-4f58-b5ec-0dc2cf109e27',
  '77a845b1-16ed-4eac-bdf9-5b591882113d',
  '10ed8504-57db-433c-b0a3-fc71a35c88a1',
  '8a53b080-6d40-4a65-ab26-b24ecf700bce',
  '02e3a47e-dd68-467e-9f71-8bf6f723fdae',
  '0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524',
  'd37a651a-d501-483b-aae6-a9659b0757a0',
  'd339adf3-e004-4c20-a120-40e8874c66cb',
];

// Function to display special offer products
function displaySpecialOfferProducts(products) {
  const container = document.getElementById('special-offers-container');
  container.innerHTML = ''; // Clear any existing products

  // Create a slider wrapper for horizontal sliding
  const sliderWrapper = document.createElement('div');
  sliderWrapper.className = 'slider-wrapper';

  // Filter products by special offer IDs
  const specialOfferProducts = products.filter(product =>
    specialOfferIds.includes(product.id)
  );

  // Add products to the slider
  specialOfferProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    productCard.innerHTML = `
      <div class="product-image-container">
        <a href="product.html?id=${product.id}">
          <img class="product-image" src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <div class="product-name limit-text-to-2-lines">${product.name}</div>
      <div class="product-rating-container">
        <img class="product-rating-stars product-rating-stars-best" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">${product.rating.count}</div>
      </div>
      <div class="product-in-stock">In stock </div>
  
       <a href="product.html?id=${product.id}">
       <img class="special-offers-buy-now-image" src="images/icons/buy-now.svg">
</a>
      <div class="product-price">$${formatCurrency(product.priceCents)}</div>

    
    `;
    sliderWrapper.appendChild(productCard);
  });

  // Add navigation buttons
  const leftButton = document.createElement('button');
  leftButton.className = 'slider-button left';
  leftButton.innerHTML = '&larr;';
  leftButton.addEventListener('click', () => {
    sliderWrapper.scrollBy({ left: -sliderWrapper.offsetWidth / 1.5, behavior: 'smooth' });
  });

  const rightButton = document.createElement('button');
  rightButton.className = 'slider-button right';
  rightButton.innerHTML = '&rarr;';
  rightButton.addEventListener('click', () => {
    sliderWrapper.scrollBy({ left: sliderWrapper.offsetWidth / 1.5, behavior: 'smooth' });
  });

  // Append elements to the container
  container.appendChild(leftButton);
  container.appendChild(sliderWrapper);
  container.appendChild(rightButton);
}





// ===================================================================================================

 function updateCartNotification() {
  const cartItemsNotification = document.getElementById('cart-items-notification'); // Select the notification container
  const quantityElement = document.getElementById('items-in-cart-count'); // Element to display item count
  const adSliderContainer = document.querySelector('.promotion-slider-container');

  let totalQuantity = 0;

  // Loop through the cart to calculate total quantity
  cart.forEach(item => {
    totalQuantity += item.quantity; // Add quantity to total
  });

  // Update the UI based on the cart's content
  if (totalQuantity > 1) {  
    cartItemsNotification.classList.add('visible'); 
    quantityElement.textContent = totalQuantity; 
    quantityElement.style.fontWeight = 'bold'; 
    console.log('Total Quantity:', totalQuantity);
    adSliderContainer.style.margin = "20px 0 0px 21px";
  } else {
    cartItemsNotification.classList.remove('visible'); 
  }
}

// Call the function to update cart notification
updateCartNotification();
