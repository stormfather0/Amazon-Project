// Define products globally for accessibility
let products = [];

// Fetch products from backend API
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products data.');
    }
    products = await response.json(); // Assign globally
    renderProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Format price
function formatCurrency(cents) {
  return (cents / 100).toFixed(2);
}

// Generate product HTML
function generateProductHTML(products) {
  let productsHTML = '';

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <img class="close-button" src="images/close.svg" data-product-id="${product.id}">
        <img class="edit-button" src="images/icons/edit.svg" data-product-id="${product.id}">
        <div class="product-image-container">
          <a href="product.html?id=${product.id}">
            <img class="product-image" src="${product.image}" alt="${product.name}">
          </a>
        </div>
        <div class="product-name limit-text-to-2-lines">${product.name}</div>
        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png" alt="${product.rating.stars} stars">
          <div class="product-rating-count link-primary">${product.rating.count}</div>
        </div>
        <div class="product-price">$${formatCurrency(product.priceCents)}</div>
        <div class="product-spacer"></div>
        <div class="added-to-cart">
          <img src="images/icons/checkmark.png" alt="Added to cart"> Added
        </div>
      </div>
    `;
  });

  return productsHTML;
}

// Render products
function renderProducts(products) {
  const productsGrid = document.querySelector('.js-products-grid');
  if (productsGrid) {
    productsGrid.innerHTML = generateProductHTML(products);
  } else {
    console.error('Element .js-products-grid not found in the DOM.');
  }
}

// Handle events (Delete, Edit, Popup Confirm/Cancel)
document.addEventListener('click', async (event) => {
  // Delete product
  if (event.target.classList.contains('close-button')) {
    const productId = event.target.getAttribute('data-product-id');
    const popup = document.getElementById('confirmation-popup');
    popup.classList.remove('custom-popup-hidden');
    popup.setAttribute('data-product-id', productId);
  }

  if (event.target.classList.contains('custom-popup-confirm-button')) {
    const popup = document.getElementById('confirmation-popup');
    const productId = popup.getAttribute('data-product-id');
  
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Refresh product list after successful deletion
        await fetchProducts();
        popup.classList.add('custom-popup-hidden');
      } else {
        alert('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  }

  if (event.target.classList.contains('custom-popup-cancel-button')) {
    const popup = document.getElementById('confirmation-popup');
    popup.classList.add('custom-popup-hidden');
  }

  // Edit product
 // Edit product
if (event.target.classList.contains('edit-button')) {
  const productId = event.target.getAttribute('data-product-id');
  const product = products.find((item) => item.id === productId);

  if (product) {
    // Populate popup fields
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.priceCents / 100;
    document.getElementById('edit-rating').value = product.rating.stars;
    document.getElementById('edit-count').value = product.count;  // Populate count field

    const popup = document.getElementById('edit-popup');
    popup.setAttribute('data-product-id', productId);
    popup.classList.remove('custom-popup-hidden');
  }
}});
// Save edited product
document.getElementById('save-button').addEventListener('click', async () => {
  const popup = document.getElementById('edit-popup');
  const productId = popup.getAttribute('data-product-id');

  const updatedName = document.getElementById('edit-name').value;
  const updatedPrice = document.getElementById('edit-price').value * 100; // Convert to cents
  const updatedRating = parseFloat(document.getElementById('edit-rating').value);
  const updatedCount = parseInt(document.getElementById('edit-count').value, 10);  // Get updated count

  try {
    // Send PUT request to update product
    await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedName,
        priceCents: updatedPrice,
        rating: { stars: updatedRating },
        count: updatedCount,  // Include count in the update request
      }),
    });

    // Refresh product list
    await fetchProducts();
    popup.classList.add('custom-popup-hidden');
  } catch (error) {
    console.error('Error saving product:', error);
  }
});

// Cancel editing
document.getElementById('cancel-button').addEventListener('click', () => {
  const popup = document.getElementById('edit-popup');
  popup.classList.add('custom-popup-hidden');
});

// Fetch and render products on load
fetchProducts();





// app.options('*', cors(corsOptions)); // Handle OPTIONS requests
// res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');  // Frontend origin
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
// res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allowed headers

// app.delete('/api/products/:id', (req, res) => {
//   const productId = req.params.id;

//   // Manually set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');  // Allow your frontend URL
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow necessary methods
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow the necessary headers

//   // Your logic to handle the DELETE request
//   fs.readFile(productsFilePath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to read products file' });
//     }

//     let products = JSON.parse(data);
//     const productIndex = products.findIndex((product) => product.id === productId);

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     products.splice(productIndex, 1); // Delete the product from the array

//     // Write the updated products back to products.json
//     fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to save updated product' });
//       }
//       res.status(200).json({ message: 'Product deleted successfully' });
//     });
//   });
// });


// Delete product function
async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove product from the global array
      products = products.filter((product) => product.id !== productId);

      // Update UI
      renderProducts(products);
      alert('Product deleted successfully.');
    } else {
      alert('Failed to delete the product.');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product. Please try again.');
  }
}

// Handle delete button click
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('close-button')) {
    const productId = event.target.getAttribute('data-product-id');

    const popup = document.getElementById('confirmation-popup');
    popup.classList.remove('custom-popup-hidden');
    popup.setAttribute('data-product-id', productId);
  }

  // Confirm delete
  if (event.target.classList.contains('custom-popup-confirm-button')) {
    const popup = document.getElementById('confirmation-popup');
    const productId = popup.getAttribute('data-product-id');

    deleteProduct(productId);

    // Hide confirmation popup
    popup.classList.add('custom-popup-hidden');
  }

  // Cancel delete
  if (event.target.classList.contains('custom-popup-cancel-button')) {
    const popup = document.getElementById('confirmation-popup');
    popup.classList.add('custom-popup-hidden');
  }
});












