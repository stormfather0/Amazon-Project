import { cart, removeFromCart, calculateCartQuantity } from '../data/cart.js';
import { formatCurrency } from './utils/money.js';
import { openLoginPopup,isUserLoggedIn,  getAuthToken, getUserEmail,  } from '../login.js'
// import {checkFreeDelivery} from '../product.js';




let freeDelivery = false;
let totalPriceCents = 0; 
let products = []; 
// Using external library DayJS to get current date and set delivery options 
const today = dayjs();
const tomorrow = dayjs().add(1, 'day');
const threeDays = dayjs().add(3, 'day');
const fiveDays  = dayjs().add(5, 'day');

// Function to format the date
function formateDate1(date) {
  return date.format('dddd, MMMM D');
}



//==================================================================================================
// Fetch products data from backend
fetch('https://amazon-project-sta4.onrender.com/api/products') 
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then(data => {
    products = data; // Assign fetched data to products
    console.log('Products fetched successfully:', products);

    // Call the functions that depend on `products` here
    initializeCartSummary();
    monitorDeliveryOptions();
    UpdateCartPrice();
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

// Function to initialize the cart summary



function initializeCartSummary() {
  let cartSummaryHTML = '';
  
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    // Find the matching product
    const matchingProduct = products.find(product => product.id === productId);
    if (!matchingProduct) return;

    // Calculate the total price
    const totalPrice = (matchingProduct.priceCents * cartItem.quantity) / 100;
 

    // Generate the HTML for each cart item
    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${formateDate1(fiveDays)} 
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price js-product-price" data-product-id="${matchingProduct.id}">$${formatCurrency(totalPrice * 100)}</div> <!-- Show total price in cents -->
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

  // Insert the cart summary into the page
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
}


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
// document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


// Function to check if the cart is empty
function checkEmptyCart() {
  const cartItems = document.querySelectorAll('.cart-item'); // Adjust this selector based on your cart item structure
  return cartItems.length === 0;  // Return true if no items are left in the cart
}

// Event delegation for dynamically added delete buttons
document.addEventListener('click', function (event) {
  // Check if the clicked element is a delete button
  if (event.target && event.target.matches('.js-delete-link')) {
    const productId = event.target.dataset.productId;

    console.log('Deleting item with productId:', productId);

    // Remove item from the cart logic
    removeFromCart(productId);

    // Remove the cart item container from the DOM
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) {
      console.log('Removing container for productId:', productId);
      container.remove();  // Remove the cart item from the page
    } else {
      console.log(`No container found for productId: ${productId}`);
    }

    // Update the cart quantity display after removal
    updateCartQuantity(); // Refresh cart quantity
    console.log('Updated cart quantity');

    // Update the total price
    UpdateCartPrice();
    console.log('Updated cart price');

    // If the cart is empty, reload the page
    if (checkEmptyCart()) {
      console.log('Cart is empty, reloading page...');
      location.reload(); // Refresh the page if the cart is empty
    }
  }
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
// Update quantity handler
// Update quantity handler
document.addEventListener('click', (event) => {
  // Check if the clicked element is a .js-update-link button
  if (event.target && event.target.classList.contains('js-update-link')) {
    const link = event.target;
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    if (container) {
      const input = container.querySelector('.quantity-input');
      const saveLink = container.querySelector('.js-save-quantity');
      const updateLink = container.querySelector('.js-update-link');

      if (input && saveLink) {
        input.style.display = 'inline'; // Show the quantity input field
        saveLink.style.display = 'inline'; // Show the save button
        updateLink.style.display = 'none'; // Hide the update link
        input.focus(); // Focus on the input field for user convenience
      }
    } else {
      console.error(`Container for product ${productId} not found`);
    }
  }

  // Check if the clicked element is a .js-save-quantity button
  if (event.target && event.target.classList.contains('js-save-quantity')) {
    const link = event.target;
    const container = link.closest('.cart-item-container');
    const input = container.querySelector('.quantity-input');
    const quantityLabel = container.querySelector('.quantity-label');
    const productId = container.querySelector('.js-product-price').dataset.productId;

    const inputValue = input.value;

    // Update the displayed quantity
    quantityLabel.textContent = inputValue;

    // Update the cart array with the new quantity
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
      cartItem.quantity = Number(inputValue);

      // Calculate the new total price
      const matchingProduct = products.find(product => product.id === productId);
      const newTotalPrice = (matchingProduct.priceCents * cartItem.quantity) / 100;

      // Update the price label
      const priceLabel = container.querySelector('.js-product-price');
      priceLabel.textContent = `$${formatCurrency(newTotalPrice * 100)}`;

      UpdateCartPrice();
    }

    // Optionally hide input and save link after saving
    input.style.display = 'none';
    link.style.display = 'none';
    container.querySelector('.js-update-link').style.display = 'inline'; // Show the update link again

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }
});










// Select all radio buttons
// Select all add-to-cart buttons
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM Loaded');

  // Add event listener for changes on radio inputs (for delivery options)
  document.addEventListener('change', function (event) {
    if (event.target && event.target.classList.contains('delivery-option-input')) {
      const selectedRadio = event.target;
      console.log('Radio Button Selected:', selectedRadio);

      // Find the parent product container using the closest method
      const productContainer = selectedRadio.closest('.cart-item-container');
      
      if (productContainer) {
        // Find the corresponding delivery date div within the product container
        const deliveryDateElement = productContainer.querySelector('.delivery-date');

        if (deliveryDateElement) {
          let deliveryDate = '';

          // Determine the delivery date based on the selected option
          if (selectedRadio.classList.contains('delivery-option-one')) {
            deliveryDate = formateDate1(fiveDays); // 5-day delivery option
          } else if (selectedRadio.classList.contains('delivery-option-two')) {
            deliveryDate = formateDate1(threeDays); // 3-day delivery option
          } else if (selectedRadio.classList.contains('delivery-option-three')) {
            deliveryDate = formateDate1(tomorrow); // 1-day delivery option
          }

          // Update the inner text of the .delivery-date div for the specific product
          deliveryDateElement.innerText = `Delivery date: ${deliveryDate}`;
          console.log(`Updated Delivery Date: ${deliveryDate}`);
        } else {
          console.log('No delivery date element found for this product.');
        }
      } else {
        console.log('No product container found for this radio button.');
      }
    }
  });
});
console.log('Script is running!');

// Select all radio buttons
// Select all radio buttonslet previousSelectedOption;

























// document.addEventListener('DOMContentLoaded', function () {
//   // Initial delivery date setup (default option)
//   const selectedDeliveryDate = document.querySelector('.delivery-option-input:checked + div .delivery-option-date').textContent;
//   const deliveryDateDisplay = document.getElementById('delivery-date');
//   deliveryDateDisplay.textContent = selectedDeliveryDate;

//   // Listen for changes on delivery option radios
//   const deliveryOptions = document.querySelectorAll('.delivery-option-input');
  
//   deliveryOptions.forEach(option => {
//     option.addEventListener('change', function () {
//       // Get the corresponding delivery date text when this radio is selected
//       const selectedDate = this.closest('.delivery-option').querySelector('.delivery-option-date').textContent;
      
//       // Update the displayed delivery date
//       deliveryDateDisplay.textContent = selectedDate;
      
//       console.log('Selected Delivery Date:', selectedDate);
//     });
//   });
// });



















// let totalPriceCents = 0; // Declare totalPriceCents in the global scope

export function UpdateCartPrice() {
  // Reset totalPriceCents to ensure it's calculated fresh each time the function runs
  totalPriceCents = 0; 


  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    // Find the product in the products array by its id
    const matchingProduct = products.find(product => product.id === productId);

    if (matchingProduct) {
      // Multiply priceCents by the quantity of the cartItem
      totalPriceCents += matchingProduct.priceCents * cartItem.quantity;

      document.querySelector('.payment-summary-money').innerHTML = `$${formatCurrency(totalPriceCents)}`;
    }
  });
  monitorDeliveryOptions()

  checkFreeDelivery(totalPriceCents);
  return totalPriceCents; // Optional
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
// Function to calculate total delivery cost
function calculateTotalDeliveryCost() {
  let totalShippingCost = 0;

  // Calculate total shipping cost for selected delivery options
  deliveryOptions.forEach(option => {
    if (option.checked) {
      totalShippingCost += deliveryOptionPrices[option.classList[1]];
    }
  });

  // Function to format currency to 2 decimal places
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  // Function to calculate estimated tax
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
  const estimatedTax = parseFloat(calculateEstimatedTax(combinedTotal, 10)); // Convert to float to ensure proper calculation
  const orderTotal = (combinedTotal + estimatedTax).toFixed(2); // Calculate order total and ensure two decimal places

  // Display estimated tax and order total
  document.querySelector('.js-estimated-tax').innerHTML = `$${estimatedTax.toFixed(2)}`; // Ensure 2 decimal places
  document.querySelector('.js-payment-summary').innerHTML = `$${orderTotal}`; // Ensure 2 decimal places
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
  const authToken = localStorage.getItem('authToken');

  console.log('Auth Token:', authToken); // Debugging

  if (!authToken) {
    console.error('No token found. User might not be authenticated.');
    return; // Stop execution if no token
  }

  const user = {
    // userName: localStorage.getItem('userName'), 
    // userSurname: localStorage.getItem('userSurname'), 
    email: localStorage.getItem('userEmail'), 
    id: localStorage.getItem('userId')
  };

  // Prepare order data
  const orderData = {
    items: cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        image: product.image,
        priceCents: product.priceCents,
        quantity: item.quantity,
        // userName: user.userName,
        // userSurname: user.userSurname,
        email: user.email,
        id: user.id
      };
    }),
    total: totalPriceCents,
    deliveryOptions: [...document.querySelectorAll('.delivery-option-input:checked')].map(option => {
      let deliveryDate;
      if (option.classList.contains('delivery-option-one')) {
        deliveryDate = formateDate1(fiveDays);
      } else if (option.classList.contains('delivery-option-two')) {
        deliveryDate = formateDate1(threeDays);
      } else if (option.classList.contains('delivery-option-three')) {
        deliveryDate = formateDate1(tomorrow);
      }

      return {
        deliveryType: option.classList[1],
        deliveryDate: deliveryDate,
      };
    }),
  };

  // Send the order data to the server with JWT token
  try {
    const response = await fetch('https://amazon-project-sta4.onrender.com/api/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authToken}` 
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const createdOrder = await response.json();
      console.log('Order placed successfully:', createdOrder);

     //Remove cart and totalPrice
localStorage.removeItem('cart'); 
localStorage.removeItem('totalPrice'); 

location.reload(); 
    } else {
      const errorData = await response.json();
      console.error('Failed to place order:', errorData.message || response.statusText);
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











//
// Function to check if user is verified
   // Function to check if user is logged in

//    document.addEventListener('DOMContentLoaded', () => {
//     checkVerificationStatus();
// });

// function checkVerificationStatus() {
//     try {
//         const token = getAuthToken();
//         console.log(`Checking verification status. Token: ${token}`);

//         if (!token) {
//             console.error('🚫 User is not logged in. No authToken found!');
//             openLoginPopup(); // ✅ Show login popup if user isn't logged in
//         } else {
//             console.log('✅ User is logged in! Hiding login popup...');
//             closeLoginPopup(); // ✅ Hide login popup if user is logged in
//         }
//     } catch (error) {
//         console.error('❌ Error checking verification status:', error);
//     }
// }

//     // checkVerificationStatus();



//LOGIN CHECKOUT



document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('authToken');
  const loginContainer = document.querySelector('.login-container');
  const loginInfo = document.querySelector('.login-info');
  const welcomeMessage = document.querySelector('.welcome');

  console.log('Auth Token:', authToken); // Debugging

  if (authToken) {
      console.log('✅ User is logged in.');

      // Hide the login container
      if (loginContainer) {
          loginContainer.classList.add('hidden');
          welcomeMessage.classList.remove('hidden');
          
          
          console.log('✅ .login-container is now hidden.');
      } else {
          console.error('❌ .login-container not found.');
      }

      // Show the login-info div
      if (loginInfo) {
          loginInfo.classList.remove('hidden');
         
          
          console.log('✅ .login-info is now visible.');
      } else {
          console.warn('⚠️ .login-info element not found.');
      }
  } else {
      console.warn('⚠️ No Auth Token found. User is not logged in.');
  }
});



//























document.addEventListener('DOMContentLoaded', async () => {
  console.log("✅ DOM fully loaded");

  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email'); // ✅ Get email element
  console.log("🔍 Checking user-name element:", userNameElement);
  console.log("🔍 Checking user-email element:", userEmailElement);

  if (!userNameElement || !userEmailElement) {
      console.error("❌ Required elements not found!");
      return;
  }

  const authToken = localStorage.getItem('authToken');
  console.log("🔑 Auth Token:", authToken);


  try {
      const response = await fetch('https://amazon-project-sta4.onrender.com/api/user', {
          method: 'GET',
          headers: { 'Authorization':  authToken } // ✅ Fixed missing "Bearer "
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        console.log('👤 User is not verifeid')

          // const errorText = await response.text();
          // console.error("❌ Fetch failed:", errorText);
          // throw new Error(errorText);
      
      }

      const data = await response.json(); // ✅ Properly parse JSON
      console.log("👤 User data:", data);

      userNameElement.textContent = `${data.firstName} ${data.lastName}`;
      userEmailElement.textContent = data.email; // ✅ Set user email

  } catch (error) {
      console.error('❌ Error fetching user data:', error);
      userNameElement.textContent = 'Guest';
      userEmailElement.textContent = 'No email found';
  }
});



document.addEventListener('DOMContentLoaded', () => {
  let a = checkFreeDelivery(totalPriceCents);
  console.log(totalPriceCents);
  
  console.log(`Here is ${a}`);
  
})


//check free delivery
export async function checkFreeDelivery(productPrice) {
  try {
      const response = await fetch('https://amazon-project-sta4.onrender.com/api/delivery-threshold');
      const data = await response.json();
      const threshold = data.threshold;

      if (productPrice >= threshold) {
        freeDelivery = true;
          console.log('✅ Free delivery applies!');
          // document.querySelector('.free-delivery').textContent = "Free Delivery";
      } else {
          console.log('🚚 Standard delivery applies.');
          // document.querySelector('.free-delivery').textContent = "";
      }
  } catch (error) {
      console.log('error', error);
  }
console.log(freeDelivery);

  return freeDelivery;
}

if (freeDelivery) {
  // Select all non-free delivery options and hide them
  document.querySelectorAll('.delivery-option-one, .delivery-option-two').forEach(option => {
    option.style.display = 'none';
  });
}

  

