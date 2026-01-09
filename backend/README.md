# HYMNS Backend API

This is the Python Flask backend for the HYMNS website that handles email notifications for orders, contact forms, and studio bookings.

## Features

- **Order Notifications**: Sends email notifications when customers place orders
- **Contact Form**: Handles contact form submissions and sends notifications
- **Studio Booking**: Processes studio booking requests and sends confirmations
- **Gmail Integration**: Uses Gmail SMTP for sending emails

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Email Settings

Edit the `config.py` file with your Gmail credentials:

```python
# Replace these values with your actual Gmail credentials
SENDER_EMAIL = 'your-gmail@gmail.com'
SENDER_PASSWORD = 'your-app-password'  # 16-character app password
RECEIVER_EMAIL = 'rumanjyotisarmah@gmail.com'
```

### 3. Generate Gmail App Password

To send emails via Gmail, you need to generate an App Password:

1. Go to your Google Account settings
2. Enable 2-factor authentication if not already enabled
3. Go to **Security** > **App passwords**
4. Generate a new app password for "Mail"
5. Use the 16-character password in the `SENDER_PASSWORD` field
6. **Important**: Never use your regular Gmail password!

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### GET /
Returns server status and available endpoints.

### POST /api/order
Handles order notifications from the checkout process.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St, City, State - 123456",
  "products": "Product A x2 - ₹200, Product B x1 - ₹100",
  "total_amount": 300,
  "payment_method": "Cash on Delivery"
}
```

### POST /api/contact
Handles contact form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Hello, I have a question..."
}
```

### POST /api/booking
Handles studio booking requests.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "booking_type": "Music Recording",
  "date_time": "2024-01-15 14:00",
  "notes": "Need vocal recording session"
}
```

## Email Templates

The backend sends HTML-formatted emails with the following information:

- **Order Emails**: Customer details, delivery address, products, total amount, payment method
- **Contact Emails**: Sender details, subject, message content
- **Booking Emails**: Customer details, booking type, date/time, notes

All emails include timestamps and are sent to `rumanjyotisarmah@gmail.com`.

## Troubleshooting

### Common Issues

1. **SMTP Authentication Error**: Make sure you're using an App Password, not your regular Gmail password
2. **"Less secure app" error**: Enable 2FA and use App Passwords instead
3. **Connection timeout**: Check your internet connection and Gmail SMTP settings
4. **CORS errors**: The backend includes CORS headers to work with the React frontend

### Testing the API

You can test the endpoints using curl:

```bash
# Test order endpoint
curl -X POST http://localhost:5000/api/order \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","phone":"1234567890","email":"test@example.com","address":"Test Address","products":"Test Product","total_amount":100,"payment_method":"COD"}'
```

## Security Notes

- Email credentials are stored in a separate config file
- Never commit real credentials to version control
- Use environment variables in production
- Consider using OAuth2 for Gmail authentication in production