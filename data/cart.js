export let cart = JSON.parse(localStorage.getItem('cart')) || []; 


// Save cart back to LocalStorage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  console.log("Adding to cart:", productId, quantity);  
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
    });
  }

  saveToStorage();
  calculateCartQuantity();

}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
  calculateCartQuantity();
}

// Clear the cart array and remove items from LocalStorage
export function removeFromCartAll() {
  cart = [];
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

calculateCartQuantity();




// Add to cart event listener.==================================================================
document.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('js-add-to-cart')) {
    const button = event.target;
    const productId = button.dataset.productId;
    const quantitySelect = button.closest('.product-container').querySelector('.product-quantity-container select');
    const quantity = parseInt(quantitySelect.value, 10);

    addToCart(productId, quantity);
    updateCartQuantity();

    // Show the popup
    const popup = document.getElementById('cart-popup');
    popup.classList.add('show');

    // Hide the popup after 3 seconds
    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000);
  }
});
//================================================================================================















export function updateCartQuantity() {
  let totalQuantity = 0;
    // Loop through the cart to calculate total quantity
    cart.forEach(item => {
      totalQuantity += item.quantity; // Add quantity to total
    });
  
    const cartQuantityElement = document.querySelector('.js-cart-quantity');
  
    if (!cartQuantityElement) {
      console.warn("Warning: .js-cart-quantity element not found. Skipping update.");
      return;
    }
  
    cartQuantityElement.innerHTML = totalQuantity;
    return cartQuantityElement;
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCartQuantity();
  });

  console.log('Cart is loaded');
  