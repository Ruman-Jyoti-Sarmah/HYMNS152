from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, EmailStr, ValidationError
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")  # Gmail App Password
RECIPIENT_EMAIL = "rumanjyotisarmah@gmail.com"

# Pydantic models for validation
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class OrderForm(BaseModel):
    customer_name: str
    phone: str
    email: EmailStr
    address: str
    products: str
    total_amount: float
    payment_method: str

class BookingForm(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    booking_type: str
    date_time: str
    notes: str

def send_email(subject: str, body: str) -> bool:
    """Send email using Gmail SMTP"""
    if not EMAIL_USER or not EMAIL_PASS:
        print("Email credentials not configured")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        text = msg.as_string()
        server.sendmail(EMAIL_USER, RECIPIENT_EMAIL, text)
        server.quit()
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()
        form = ContactForm(**data)
        body = f"""
New Contact Message from HYMNS Website

Name: {form.name}
Email: {form.email}
Subject: {form.subject}
Message: {form.message}
"""
        if send_email("New Contact Message – HYMNS Website", body):
            return jsonify({"success": True, "message": "Email sent successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to send email"}), 500
    except ValidationError as e:
        return jsonify({"success": False, "message": "Invalid input", "errors": e.errors()}), 400
    except Exception as e:
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/api/order", methods=["POST"])
def order():
    try:
        data = request.get_json()
        form = OrderForm(**data)
        body = f"""
New Order Placed – HYMNS Store

Customer Name: {form.customer_name}
Phone: {form.phone}
Email: {form.email}
Address: {form.address}
Products: {form.products}
Total Amount: {form.total_amount}
Payment Method: {form.payment_method}
"""
        if send_email("New Order Placed – HYMNS Store", body):
            return jsonify({"success": True, "message": "Email sent successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to send email"}), 500
    except ValidationError as e:
        return jsonify({"success": False, "message": "Invalid input", "errors": e.errors()}), 400
    except Exception as e:
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/api/booking", methods=["POST"])
def booking():
    try:
        data = request.get_json()
        form = BookingForm(**data)
        body = f"""
New Booking Confirmed – HYMNS

Customer Name: {form.customer_name}
Email: {form.email}
Phone: {form.phone}
Booking Type: {form.booking_type}
Date & Time: {form.date_time}
Notes: {form.notes}
"""
        if send_email("New Booking Confirmed – HYMNS", body):
            return jsonify({"success": True, "message": "Email sent successfully"})
        else:
            return jsonify({"success": False, "message": "Failed to send email"}), 500
    except ValidationError as e:
        return jsonify({"success": False, "message": "Invalid input", "errors": e.errors()}), 400
    except Exception as e:
        return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
