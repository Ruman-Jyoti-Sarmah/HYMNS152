// Frontend Integration Examples for HYMNS Website Backend
// Use these examples to integrate with the FastAPI backend

// Base URL - change this to your deployed backend URL
const API_BASE_URL = 'http://localhost:8000'; // For local development
// const API_BASE_URL = 'https://your-backend-url.vercel.app'; // For production

// 1. Contact Page - Send Message Button
async function sendContactMessage(name, email, subject, message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('Contact message sent successfully');
      // Show success message to user
    } else {
      console.error('Failed to send contact message');
      // Show error message to user
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle network errors
  }
}

// Example usage for Contact form:
// const contactForm = document.getElementById('contact-form');
// contactForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const formData = new FormData(contactForm);
//   sendContactMessage(
//     formData.get('name'),
//     formData.get('email'),
//     formData.get('subject'),
//     formData.get('message')
//   );
// });

// 2. Checkout Page - Place Order Button
async function placeOrder(customerName, phone, email, address, products, totalAmount, paymentMethod) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        phone,
        email,
        address,
        products, // String format: "Product1 (x2) - $10, Product2 (x1) - $5"
        total_amount: totalAmount,
        payment_method: paymentMethod
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('Order placed successfully');
      // Redirect to success page or show confirmation
    } else {
      console.error('Failed to place order');
      // Show error message to user
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle network errors
  }
}

// Example usage for Checkout form:
// const checkoutForm = document.getElementById('checkout-form');
// checkoutForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const cartItems = getCartItems(); // Your cart logic
//   const productsString = cartItems.map(item =>
//     `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`
//   ).join(', ');
//
//   await placeOrder(
//     document.getElementById('customer-name').value,
//     document.getElementById('phone').value,
//     document.getElementById('email').value,
//     document.getElementById('address').value,
//     productsString,
//     calculateTotal(),
//     document.getElementById('payment-method').value
//   );
// });

// 3. Booking Page - Confirm Booking Button
async function confirmBooking(customerName, email, phone, bookingType, dateTime, notes) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_name: customerName,
        email,
        phone,
        booking_type: bookingType, // "Music", "Studio", or "Service"
        date_time: dateTime, // Format: "2024-01-15 14:30"
        notes
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('Booking confirmed successfully');
      // Show success message and redirect
    } else {
      console.error('Failed to confirm booking');
      // Show error message to user
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle network errors
  }
}

// Example usage for Booking form:
// const bookingForm = document.getElementById('booking-form');
// bookingForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const formData = new FormData(bookingForm);
//   confirmBooking(
//     formData.get('customer-name'),
//     formData.get('email'),
//     formData.get('phone'),
//     formData.get('booking-type'),
//     formData.get('date-time'),
//     formData.get('notes')
//   );
// });

// Axios examples (if you prefer Axios over fetch):
/*
import axios from 'axios';

async function sendContactMessageAxios(name, email, subject, message) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/contact`, {
      name,
      email,
      subject,
      message
    });
    console.log('Contact message sent:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Similar functions can be created for order and booking with axios
*/