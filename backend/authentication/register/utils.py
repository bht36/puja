import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def normalize_email_input(email):
    """Consistently normalize email across the app"""
    if not email:
        return ''
    return email.strip().lower()


def send_otp_email(email, otp_code, is_resend=False):
    """Send OTP verification email"""
    subject = 'Verify Your Account' + (' - New Code' if is_resend else '')
    expiry_minutes = 10  # 600 seconds / 60

    message = f'''Hello,

Your verification code is: {otp_code}

This code will expire in {expiry_minutes} minutes.

If you didn't request this code, please ignore this email.

Thanks,
Puja Pasal Team
'''

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        logger.info(f"OTP email sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}: {str(e)}")
        raise
