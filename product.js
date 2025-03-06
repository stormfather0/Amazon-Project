import {cart, addToCart, calculateCartQuantity, updateCartQuantity } from './data/cart.js'; 
import { addFavourite, removeFavourite, favouritesListenerPages } from 'data/favourites.js';
// import { API_BASE_URL } from "../config.js";


 function formatCurrency(priceCents) {
  return (priceCents / 100).toFixed(2);
}



// Fetch products data from backend
let products = [];
fetch('https://amazon-project-sta4.onrender.com/api/products')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then((data) => {
    products = data;
    console.log('Products fetched successfully:', products);

    // Get product ID after fetching data
    const productId = getProductIdFromURL();
    const product = products.find((p) => p.id === productId);

    renderProductDetails(product);
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });




let categoryName;
let categoryNameFromURL; // Variable to store the category name from the URL (digital-content, clothing, etc.)
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const category = params.get('category');

  categoryName = category;
 categoryNameFromURL = category;

  
  console.log('Product ID from URL:', id); 
  return id;
}


getProductIdFromURL();
console.log(categoryName); 

  





const product = products.find((p) => p.id === Number(productId));


function renderProductDetails(product) {
  const container = document.querySelector('.js-product-details-container');

  if (!product) {
    container.innerHTML = `<p>Product not found.</p>`;
    return;
  }
  const categoryMapping = {
    'electronics': 'Electronics',
    'digital-content': 'Digital Content',
    'clothing': 'Clothing',
    'personal-care': 'Personal Care',
    'fashion': 'Fashion',
    'gift-cards': 'Gift Cards'
  };
  
  categoryName = categoryMapping[categoryName] || categoryName;
 

// Ensure images array exists
const images = product.images && product.images.length > 0 ? product.images : [product.image];



  // Check if the product has free delivery
 let price = product.priceCents;
 checkFreeDelivery(price); 


  container.innerHTML = `
<div class="page-navigation">
  <a class="page-navigation-link" href="amazon.html" class="link-primary">Home</a>
  <span> > </span>
  <a class="page-navigation-link" href="filtered-products.html?category=${categoryName}" class="link-primary">${categoryName}</a>
  <span> > </span>
  <a class="page-navigation-link" href="#" class="link-primary">${product.name}</a>

 </div>

    <div class="product-detail">
    
      <div class="product-detail-left">
       
        <div class="slider-container">
        
          <div class="slider">
            ${images.map(img => `<img src="${img}" alt="${product.name}" class="product-detail-image">`).join('')}
          </div>
      
          
        </div>
     <button class="slider-btn prev-btn" style="display: ${images.length > 1 ? 'block' : 'none'};">‹</button>
    <button class="slider-btn next-btn" style="display: ${images.length > 1 ? 'block' : 'none'};">›</button>
      </div>
      
          <div class="thumbnails">
      ${images.map((img, index) => `
        <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" alt="Thumbnail">
      `).join('')}
    </div>

      
      
  
      

          
    <div class="product-detail-right">
          <h1 class="product-detail-name">${product.name}</h1> 

            <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count} <span> reviews </span>
          </div>
        </div>


    <div class="product-detail-right-bottom"> 
    <div class="product-seller-container"> 
    <p>Seller:</p>
      <img src="images/seller-amazon-3.png" alt="Amazon" class="product-seller-image">
    </div>
 <p class="product-detail-in-stock">In Stock</p>
          


<div class="product-detail-purchase">
      <div class="product-detail-price">$${formatCurrency(product.priceCents)}   
      <p class="free-delivery"></p>
      </div>
    



      <button class="js-add-to-cart button-primary add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>

  <svg class="favourites-style js-favourites-${product.id}" 
             data-favourites-id="${product.id}" 
             width="50px" 
             height="40px" 
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

    </div>


<div class="financing">
  <p>Or split in 4 payments of USD <strong> ${formatCurrency(product.priceCents / 4)}</strong> - No late fees, Sharia compliant! Learn more
    <img src="images/financing-tamara.svg" alt="Financing" class="financing-image">
  </p>
</div>

<div class="store-benefits"> 
<div class="store-benefit">
  <img src="images/benefit-1.avif" alt="Truck" class="store-benefit-image">
  <p>Cash On Delivery</p>
</div>

<div class="store-benefit">
  <img src="images/benefit-2.avif" alt="Truck" class="store-benefit-image">
  <p>Free Delivery over $50</p>
</div>

<div class="store-benefit">
  <img src="images/benefit-3.svg" alt="Truck" class="store-benefit-image">
  <p>100% Original Product</p>
</div>

</div>


<div class="limited-special-offers">
<img class="limited-special-offers-img" src="images/spring-sale.webp">
</div>


</div>

     </div>
     </div>

     <section class="review-container">
        <!-- Review Form -->
        <div class="review-form">
            <h2>Leave a Review</h2>
            <form>
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" required></textarea>
                <button class="button-primary"  >Submit Review</button>
            </form>
        </div>

        <!-- No Reviews Message on the Right -->
        <div class="no-reviews-container">
            <p class="no-reviews">No reviews yet. Be the first to leave a review!</p>
        </div>
    </section>

  `;
  // Slider logic
  if (images.length > 1) {
    let currentIndex = 0;
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const thumbnails = document.querySelectorAll('.thumbnail');
  
    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      thumbnails[currentIndex].classList.add('active');
    }
  
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
      updateSlider();
    });
  
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      updateSlider();
    });
  
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        currentIndex = parseInt(e.target.dataset.index);
        updateSlider();
      })}) }

  // Attach the event listener after rendering the product details
  document.querySelector('.js-add-to-cart').addEventListener('click', () => {
    addToCart(product.id, 1); // Default quantity is 1
    updateCartQuantity();
  });
}

// function updateCartQuantity() {
//   const cartQuantity = calculateCartQuantity();
//   document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
// }

// updateCartQuantity();







// document.addEventListener("DOMContentLoaded", () => {
//   favouritesListenerPages();
// });


//check if free delivery applies
export async function checkFreeDelivery(productPrice) {
  try {
      const response = await fetch('https://amazon-project-sta4.onrender.com/api/delivery-threshold');
      const data = await response.json();
      const threshold = data.threshold;

      if (productPrice >= threshold) {
          console.log('✅ Free delivery applies!');
          document.querySelector('.free-delivery').textContent = "Free Delivery";
      } else {
          console.log('🚚 Standard delivery applies.');
          document.querySelector('.free-delivery').textContent = "";
      }
  } catch (error) {
      console.log('error', error);
  }
}





  