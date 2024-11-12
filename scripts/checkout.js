import { cart, removeFromCart, calculateCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';



// Using external library DayJS to get current date and set delivery options 
const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
const threeDays = dayjs().add(3, 'day');
const fiveDays  = dayjs().add(5, 'day');

// Function to format the date
function formateDate1(date) {
  return date.format('dddd, MMMM D');
}

// Generate the cart summary HTML

let cartSummaryHTML = '';
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct = products.find(product => product.id === productId);
  if (!matchingProduct) return;

  // Calculate the total price based on the quantity
  const totalPrice = (matchingProduct.priceCents * cartItem.quantity) / 100; // Convert cents to dollars

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${formateDate1(fiveDays)} <!-- Default delivery date -->
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price js-product-price data-product-id="${matchingProduct.id}">$${formatCurrency(totalPrice * 100)}</div> <!-- Show total price in cents -->
          <div class="product-quantity">
            <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
            
            <input class="quantity-input" style="display:none;" type="number" min="1" value="${cartItem.quantity}"> 
            <span class="save-quantity-link link-primary js-save-quantity" style="display:none;">Save</span>

            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input delivery-option-one" name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${formateDate1(fiveDays)} </div>
              <div class="delivery-option-price">FREE Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input delivery-option-two" name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${formateDate1(threeDays)}</div>
              <div class="delivery-option-price">$4.99 - Shipping</div>
            </div> 
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input delivery-option-three" name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${formateDate1(tomorrow)} </div>
              <div class="delivery-option-price">$9.99 - Shipping</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  `;


  
});



// Select the payment summary container in the HTML
const paymentSummaryContainer = document.querySelector('.payment-summary');

// Create the HTML structure for the payment summary
paymentSummaryContainer.innerHTML = `
  <div class="payment-summary-title">Order Summary</div>

  <div class="payment-summary-row">
    <div class="payment-quantity">Items ():</div>
    <div class="payment-summary-money"></div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money total-delivery-cost"></div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money js-total-before-tax"></div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money js-estimated-tax"></div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
     <div class="payment-summary-money js-payment-summary"></div>
  </div>

  <button class="place-order-button button-primary">
    Place your order
  </button>
`;




// Insert the cart summary into the page
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


// Function to check if the cart is empty
function checkEmptyCart() {
  const cartItems = document.querySelectorAll('.cart-item'); // Adjust this selector based on your cart item structure
  return cartItems.length === 0;  // Return true if no items are left in the cart
}

// Delete item from cart
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    // Remove item from the cart logic (based on your custom removeFromCart function)
    removeFromCart(productId);

    // Remove the cart item container from the DOM
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) container.remove();

    // Update the cart quantity display after removal
    updateCartQuantity(); // Call this to refresh the displayed quantity

    monitorDeliveryOptions();
    UpdateCartPrice();

    // If the cart is empty, reload the page
    if (checkEmptyCart()) {
      location.reload(); // Refresh the page if the cart is empty
    }
  });
});

// Function to update the cart quantity display
function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.return-to-home-link').innerHTML = `${cartQuantity}`;
  document.querySelector('.payment-quantity').innerHTML = `Items (${cartQuantity})`;
 
  
  return cartQuantity
}

updateCartQuantity(); 

// Update quantity handler
document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    if (container) {
      const input = container.querySelector('.quantity-input');
      const saveLink = container.querySelector('.save-quantity-link');
      const updateLink = container.querySelector('.js-update-link');

      if (input && saveLink) {
        input.style.display = 'inline';
        saveLink.style.display = 'inline';
        updateLink.style.display = 'none'; // Hide the Update link
        input.focus(); // Focus on the input field for user convenience
      }
    } else {
      console.error(`Container for product ${productId} not found`);
    }

    
  });
});

// Save updated quantity
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('save-quantity-link')) {
    const link = event.target;
    const container = link.closest('.cart-item-container');
    const input = container.querySelector('.quantity-input');
    const quantityLabel = container.querySelector('.quantity-label');
    const priceLabel = container.querySelector('.js-product-price');
    const updateLink = container.querySelector('.js-update-link');

    if (input && quantityLabel && priceLabel) {
      let inputValue = input.value;

      // Update the displayed quantity
      quantityLabel.textContent = inputValue;

      // Update the cart array with the new quantity
      const productId = container.className.match(/js-cart-item-container-(.*)/)[1];
      const cartItem = cart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = Number(inputValue);

        UpdateCartPrice()
      }

      // Optionally hide input and save link after saving
      input.style.display = 'none';
      link.style.display = 'none';
      updateLink.style.display = 'inline'; // Show the Update link again

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      console.error('Input or quantity label not found.');
    }
  }

  updateCartQuantity(); 
});

// Select all radio buttons
const deliveryOptions = document.querySelectorAll('.delivery-option-input');

deliveryOptions.forEach(option => {
option.addEventListener('change', (event) => {
  const selectedClass = event.target.classList[1]; //delivery-option-one
  const container = event.target.closest('.cart-item-container'); // search parerent of delivery-option-one
  const deliveryDateElement = container.querySelector('.delivery-date'); //searching delivery option for the whole block 

  let deliveryDate;

  if(selectedClass === 'delivery-option-one') { //matched delivery-option-one with the function with appropriate parameter
    deliveryDate = formateDate1(fiveDays)
  } else if (selectedClass === 'delivery-option-two')
  {
    deliveryDate = formateDate1(threeDays);

  } else if (selectedClass === 'delivery-option-three') {
    deliveryDate = formateDate1(tomorrow);
  }

  if(deliveryDateElement) {
    deliveryDateElement.textContent = `Delivery date: ${deliveryDate}` // update time for container 
  }
});
});








let totalPriceCents = 0; // Declare totalPriceCents in the global scope

function UpdateCartPrice() {
  // Reset totalPriceCents to ensure it's calculated fresh each time the function runs
  totalPriceCents = 0; 

  // Assuming `cart` and `products` are defined and accessible here
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    // Find the product in the products array by its id
    const matchingProduct = products.find(product => product.id === productId);

    if (matchingProduct) {
      // Multiply priceCents by the quantity of the cartItem
      totalPriceCents += matchingProduct.priceCents * cartItem.quantity;

      document.querySelector('.payment-summary-money').innerHTML = `$${formatCurrency(totalPriceCents)}`;
      // You can also update other elements as needed
      // document.querySelector('.js-total-before-tax').innerHTML = `$${formatCurrency(totalPriceCents) + b}`;
    }
  });
  monitorDeliveryOptions()
  return totalPriceCents; // Optional: return totalPriceCents if needed
}

// Call the function to update the cart price
UpdateCartPrice();

// Now you can access totalPriceCents outside the function
console.log(`Total Price in Cents: ${formatCurrency(totalPriceCents)}`); // This will log the value of totalPriceCents



//
function monitorDeliveryOptions() {
  // Select all radio buttons for delivery options
  const deliveryOptions = document.querySelectorAll('input[type="radio"][name^="delivery-option-"]');
  
  // Object to store shipping costs associated with delivery options
  const deliveryOptionPrices = {
    'delivery-option-one': 0,     // Free Shipping
    'delivery-option-two': 4.99,  // $4.99 Shipping
    'delivery-option-three': 9.99 // $9.99 Shipping
  };

 

  // Function to calculate total delivery cost
  function calculateTotalDeliveryCost() {
    let totalShippingCost = 0;
     // Assign value to 'a'

    // Calculate total shipping cost for selected delivery options
    deliveryOptions.forEach(option => {
      if (option.checked) {
        totalShippingCost += deliveryOptionPrices[option.classList[1]];
       
      }
    });
    

    // Log the total delivery cost to the console
    function formatCurrency(amount) {
      return `$${amount.toFixed(2)}`; 
    }
    
    function calculateEstimatedTax(amount, taxRate) {
      return ((amount * taxRate) / 100).toFixed(2); 
    }
    
    // Log and update the total delivery cost
    console.log(`Total Delivery Cost: ${formatCurrency(totalShippingCost)}`);
    document.querySelector('.total-delivery-cost').innerHTML = formatCurrency(totalShippingCost);
    
    // Calculate combined total
    const combinedTotal = (totalPriceCents + totalShippingCost * 100) / 100;
    console.log(combinedTotal);
    
    // Update total before tax
    const totalBeforeTax = formatCurrency(combinedTotal);
    document.querySelector('.js-total-before-tax').innerHTML = totalBeforeTax;
    
    // Calculate estimated tax and order total
    const estimatedTax = Number(calculateEstimatedTax(combinedTotal, 10)).toFixed(2); 
    const orderTotal = Number((combinedTotal * 100) + (estimatedTax * 100)) / 100; 


document.querySelector('.js-estimated-tax').innerHTML = `$${estimatedTax}`;
document.querySelector('.js-payment-summary').innerHTML = `$${orderTotal}`;


   
    
  
  }

  // Add event listeners to each delivery option
  deliveryOptions.forEach(option => {
    option.addEventListener('change', () => {
      calculateTotalDeliveryCost();  // Call the function on change
    });
  });

  // Initial calculation to log the total delivery cost based on current selections
  calculateTotalDeliveryCost();

   // Return 'a' from monitorDeliveryOptions
}




document.querySelector('.place-order-button').addEventListener('click', async () => {
  // Prepare order data
  const orderData = {
    items: cart.map(item => {
      // Find the matching product from products.js by productId
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        image: product.image, // Include product image
        priceCents: product.priceCents,
        quantity: item.quantity,
      };
    }),
    total: totalPriceCents, // Total price in cents
    deliveryOptions: [...document.querySelectorAll('.delivery-option-input:checked')].map(option => {
      let deliveryDate;
      if (option.classList.contains('delivery-option-one')) {
        deliveryDate = formateDate1(fiveDays); // 5-day delivery
      } else if (option.classList.contains('delivery-option-two')) {
        deliveryDate = formateDate1(threeDays); // 3-day delivery
      } else if (option.classList.contains('delivery-option-three')) {
        deliveryDate = formateDate1(tomorrow); // 1-day delivery
      }

      return {
        deliveryType: option.classList[1],
        deliveryDate: deliveryDate,
      };
    }),
  };

  // Send the order data to the server
  try {
    const response = await fetch('http://localhost:3000/api/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const createdOrder = await response.json();
      console.log('Order placed successfully:', createdOrder);

      localStorage.clear();
      location.reload(); 

    } else {
      console.error('Failed to place order:', response.statusText);
    }
  } catch (error) {
    console.error('Error placing order:', error);
  }
});


// Display message when cart is empty 
document.addEventListener("DOMContentLoaded", () => {

  const pageTitle = document.querySelector(".page-title");
  const checkoutGrid = document.querySelector(".checkout-grid");
  const mainContainer = document.querySelector(".main");

  if (cart.length === 0) {
    pageTitle.style.display = "none";
    checkoutGrid.style.display = "none";

    // Create and display the "cart is empty" message
    const emptyMessage = document.createElement("div");
    emptyMessage.classList.add("empty-cart-message");
    emptyMessage.textContent = "Your cart is empty. Please add products to place an order!";

    // Create and add an image below the empty message
    const emptyCartImage = document.createElement("img");
    emptyCartImage.src = "images/cart.png"; 
    emptyCartImage.alt = "Empty Cart";
    emptyCartImage.classList.add("empty-cart-image");

    // Append the message and image to the main container
    emptyMessage.appendChild(emptyCartImage);
    mainContainer.appendChild(emptyMessage);
  } else {
    pageTitle.style.display = "block";
    checkoutGrid.style.display = "grid";
  }
});




document.addEventListener('DOMContentLoaded', async () => {
  try {
      // Fetch products data from the backend
      const response = await fetch('http://localhost:3000/api/products');
      if (!response.ok) {
          throw new Error('Failed to fetch products');
      }

      const products = await response.json();
      displayProducts(products); // Call function to display the products

  } catch (error) {
      console.error('Error loading products:', error);
  }
});

// Function to display products in the container
function displayProducts(products) {
  const productsContainer = document.querySelector('.products-container');
  productsContainer.innerHTML = ''; // Clear the container

  products.forEach(product => {
      // Create the HTML for each product
      const productElement = document.createElement('div');
      productElement.classList.add('product');

      productElement.innerHTML = `
          <h3>${product.name}</h3>
          <img src="${product.image}" alt="${product.name}" /> <!-- Product Image -->
          <p>Price: $${(product.priceCents / 100).toFixed(2)}</p>
          <p>Rating: ${product.rating.stars} stars (${product.rating.count} reviews)</p>
          <p>Product ID: ${product.id}</p>
      `;

      // Append the product element to the products container
      productsContainer.appendChild(productElement);
  });
}




















