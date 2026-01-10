from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
from config import SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL

app = Flask(__name__)
CORS(app, origins=["https://hymns-152.vercel.app", "http://localhost:5000"])

def send_email(subject, body):
    """Send email using Gmail SMTP"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = subject

        # Add body to email
        msg.attach(MIMEText(body, 'html'))

        # Create server object with SSL option
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()

        # Login to the email account
        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        # Send email
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, text)

        # Close the server
        server.quit()

        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

@app.route('/api/order', methods=['POST'])
def handle_order():
    try:
        data = request.get_json()

        # Extract order details
        customer_name = data.get('customer_name', '')
        phone = data.get('phone', '')
        email = data.get('email', '')
        address = data.get('address', '')
        products = data.get('products', '')
        total_amount = data.get('total_amount', 0)
        payment_method = data.get('payment_method', '')

        # Create email content
        subject = f"New Order Received - {customer_name}"

        body = f"""
        <html>
        <body>
            <h2>New Order Received</h2>
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> {customer_name}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Email:</strong> {email}</p>

            <h3>Delivery Address:</h3>
            <p>{address}</p>

            <h3>Order Details:</h3>
            <p><strong>Products:</strong> {products}</p>
            <p><strong>Total Amount:</strong> ₹{total_amount}</p>
            <p><strong>Payment Method:</strong> {payment_method}</p>

            <p><strong>Order Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </body>
        </html>
        """

        # Send email
        if send_email(subject, body):
            return jsonify({'success': True, 'message': 'Order email sent successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to send order email'}), 500

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error processing order: {str(e)}'}), 500

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()

        # Extract contact details
        name = data.get('name', '')
        email = data.get('email', '')
        subject = data.get('subject', 'Contact Form Submission')
        message = data.get('message', '')

        # Create email content
        email_subject = f"Contact Form: {subject}"

        body = f"""
        <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>

            <h3>Message:</h3>
            <p>{message}</p>

            <p><strong>Received on:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </body>
        </html>
        """

        # Send email
        if send_email(email_subject, body):
            return jsonify({'success': True, 'message': 'Contact email sent successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to send contact email'}), 500

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error processing contact: {str(e)}'}), 500

@app.route('/api/booking', methods=['POST'])
def handle_booking():
    try:
        data = request.get_json()

        # Extract booking details
        customer_name = data.get('customer_name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        booking_type = data.get('booking_type', '')
        date_time = data.get('date_time', '')
        notes = data.get('notes', '')

        # Create email content
        subject = f"New Studio Booking - {customer_name}"

        body = f"""
        <html>
        <body>
            <h2>New Studio Booking Received</h2>
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> {customer_name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>

            <h3>Booking Details:</h3>
            <p><strong>Booking Type:</strong> {booking_type}</p>
            <p><strong>Date & Time:</strong> {date_time}</p>
            <p><strong>Notes:</strong> {notes}</p>

            <p><strong>Booking Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </body>
        </html>
        """

        # Send email
        if send_email(subject, body):
            return jsonify({'success': True, 'message': 'Booking email sent successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to send booking email'}), 500

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error processing booking: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'HYMNS Backend API is running', 'endpoints': ['/api/order', '/api/contact', '/api/booking']})

# if __name__ == '__main__':
#     port = int(os.environ.get('PORT', 5000))
#     app.run(host='0.0.0.0', port=port, debug=False)