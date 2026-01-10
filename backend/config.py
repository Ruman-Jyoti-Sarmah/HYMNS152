import os

# Email Configuration
# Use environment variables for production, defaults for local development
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "rumanjyotisarmah@gmail.com")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "avdbdhimbonqbjca")  # App password for Gmail
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", "rumanjyotisarmah@gmail.com")

# For production deployment on Render, set these environment variables:
# SMTP_SERVER=smtp.gmail.com
# SMTP_PORT=587
# SENDER_EMAIL=your-gmail@gmail.com
# SENDER_PASSWORD=your-16-char-app-password
# RECEIVER_EMAIL=recipient@gmail.com
