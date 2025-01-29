document.addEventListener("DOMContentLoaded", () => {
    // Fetch the JSON data
    fetch('../backend/electronics.js') // Adjust the path if necessary
      .then(response => response.json())
      .then(data => {
        const productsGrid = document.querySelector('.js-products-grid');
        let productsHTML = '';
  
        // Loop through the products in the JSON
        data.forEach(product => {
          productsHTML += `
            <div class="product-container">
              <div class="product-image-container">
                <img class="product-image" src="${product.image}" alt="${product.name}">
              </div>
  
              <div class="product-name">${product.name}</div>
  
              <div class="product-rating-container">
                <img class="product-rating-stars" src="images/ratings/rating-${Math.round(product.rating.stars * 10)}.png" alt="rating stars">
                <div class="product-rating-count">${product.rating.count}</div>
              </div>
  
              <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
  
              <button class="add-to-cart-button">Add to Cart</button>
            </div>
          `;
        });
  
        // Inject the products into the grid
        productsGrid.innerHTML = productsHTML;
      })
      .catch(error => {
        console.error('Error loading products:', error);
      });
  });