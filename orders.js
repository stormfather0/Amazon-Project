// Frontend JavaScript (e.g., in a file called orders.js)

// Function to fetch orders
async function fetchOrders() {
    const token = localStorage.getItem('authToken'); // Fix token name
    console.log("Token being used:", token); // Debugging

    if (!token) {
        document.getElementById('orders-container').innerHTML = '<p class="no-orders">Please log in to view orders.</p>';
        return;
    }

    try {
        const response = await fetch('https://amazon-project-sta4.onrender.com/api/user-orders', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Response status:", response.status); // Debugging

        if (!response.ok) {
            throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }

        const orders = await response.json();
        console.log("Orders received:", orders); // Debugging
    } catch (error) {
        console.error('Error:', error);
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