import random
import logging
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password as django_validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.cache import cache
from authentication.models import User
from .utils import send_otp_email, normalize_email_input

logger = logging.getLogger(__name__)


class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    def validate_email(self, value):
        normalized_email = normalize_email_input(value)
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError("Email already exists")
        return normalized_email

    def validate_password(self, value):
        try:
            django_validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        if not any(c.isupper() for c in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords don't match"})
        return attrs

    def save(self):
        validated_data = self.validated_data.copy()
        validated_data.pop('password_confirm')
        email = validated_data['email']

        cache.set(f"pending_user_{email}", validated_data, timeout=600)
        otp_code = str(random.randint(100000, 999999))
        cache.set(f"pending_otp_{email}", otp_code, timeout=600)

        try:
            send_otp_email(email, otp_code, is_resend=False)
            logger.info(f"Registration initiated for {email}")
        except Exception as e:
            cache.delete(f"pending_user_{email}")
            cache.delete(f"pending_otp_{email}")
            logger.error(f"Registration failed for {email}: {str(e)}")
            raise serializers.ValidationError("Failed to send verification email. Please try again.")

        return {'email': email}


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

    def validate_email(self, value):
        return normalize_email_input(value)

    def validate(self, attrs):
        email = attrs['email']
        user_data = cache.get(f"pending_user_{email}")
        if not user_data:
            raise serializers.ValidationError({'email': 'Registration expired. Please register again.'})
        stored_otp = cache.get(f"pending_otp_{email}")
        if not stored_otp or stored_otp != attrs['otp_code']:
            raise serializers.ValidationError({'otp_code': 'Invalid or expired OTP'})
        attrs['user_data'] = user_data
        return attrs
