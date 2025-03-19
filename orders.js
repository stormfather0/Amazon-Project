// Frontend JavaScript (e.g., in a file called orders.js)

// Function to fetch orders
async function fetchOrders() {
    try {
        // Get the token from wherever it's stored (e.g., localStorage)
        const authToken = localStorage.getItem('authToken');
        
        // Make the API request with the authorization header
        const response = await fetch('https://amazon-project-sta4.onrender.com/api/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const orders = await response.json();
        
        // Log to console
        console.log('User Orders:', orders);
        
        // Display in HTML
        displayOrders(orders);
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        displayError(error.message);
    }
}

// Function to display orders in HTML
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    
    if (!ordersContainer) {
        console.error('Orders container not found in HTML');
        return;
    }

    // Clear existing content
    ordersContainer.innerHTML = '';

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders found.</p>';
        return;
    }

    // Create a simple table to display orders
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${orders.map(order => `
                <tr>
                    <td>${order._id || 'N/A'}</td>
                    <td>${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                    <td>${order.total || 'N/A'}</td>
                    <td>${order.status || 'N/A'}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    ordersContainer.appendChild(table);
}

// Function to display errors
function displayError(message) {
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer) {
        ordersContainer.innerHTML = `<p class="error">Error: ${message}</p>`;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);