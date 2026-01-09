import os

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")

# Email Configuration
# Replace these values with your actual Gmail credentials

# Sender email (your Gmail address)
SENDER_EMAIL = 'rumanjyotisarmah@gmail.com'

# Gmail App Password (NOT your regular password)
# To get an app password:
# 1. Go to your Google Account settings
# 2. Enable 2-factor authentication
# 3. Go to Security > App passwords
# 4. Generate a new app password for "Mail"
# 5. Use that 16-character password here
SENDER_PASSWORD = 'avdbdhimbonqbjca'

# Receiver email (where notifications will be sent)
RECEIVER_EMAIL = 'rumanjyotisarmah@gmail.com'

# SMTP Configuration (don't change these)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587