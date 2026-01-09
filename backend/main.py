from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = os.environ.get("EMAIL_USER")
EMAIL_PASS = os.environ.get("EMAIL_PASS")  # Gmail App Password
RECIPIENT_EMAIL = "rumanjyotisarmah@gmail.com"

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

@app.get("/")
async def health_check():
    return {"status": "Backend is running"}

@app.post("/api/contact")
async def contact(request: Request):
    try:
        data = await request.json()
        body = f"""
New Contact Message from HYMNS Website

Name: {data.get('name', '')}
Email: {data.get('email', '')}
Subject: {data.get('subject', '')}
Message: {data.get('message', '')}
"""
        if send_email("New Contact Message – HYMNS Website", body):
            return {"success": True, "message": "Email sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request data")

@app.post("/api/order")
async def order(request: Request):
    try:
        data = await request.json()
        body = f"""
New Order Placed – HYMNS Store

Customer Name: {data.get('customer_name', '')}
Phone: {data.get('phone', '')}
Email: {data.get('email', '')}
Address: {data.get('address', '')}
Products: {data.get('products', '')}
Total Amount: {data.get('total_amount', 0)}
Payment Method: {data.get('payment_method', '')}
"""
        if send_email("New Order Placed – HYMNS Store", body):
            return {"success": True, "message": "Email sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request data")

@app.post("/api/booking")
async def booking(request: Request):
    try:
        data = await request.json()
        body = f"""
New Booking Confirmed – HYMNS

Customer Name: {data.get('customer_name', '')}
Email: {data.get('email', '')}
Phone: {data.get('phone', '')}
Booking Type: {data.get('booking_type', '')}
Date & Time: {data.get('date_time', '')}
Notes: {data.get('notes', '')}
"""
        if send_email("New Booking Confirmed – HYMNS", body):
            return {"success": True, "message": "Email sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request data")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
