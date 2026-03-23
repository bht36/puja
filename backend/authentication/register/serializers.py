from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from authentication.models import User
import random

class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def save(self):
        validated_data = self.validated_data.copy()
        validated_data.pop('password_confirm')
        # username required by AbstractUser — use email prefix
        validated_data['username'] = validated_data['email'].split('@')[0]
        email = validated_data['email']

        cache.set(f"pending_user_{email}", validated_data, timeout=600)
        otp_code = str(random.randint(100000, 999999))
        cache.set(f"pending_otp_{email}", otp_code, timeout=600)

        send_mail(
            'Verify Your Account',
            f'Your verification code is: {otp_code}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return {'email': email}

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs['email']
        user_data = cache.get(f"pending_user_{email}")
        if not user_data:
            raise serializers.ValidationError('Registration expired. Please register again.')
        stored_otp = cache.get(f"pending_otp_{email}")
        if not stored_otp or stored_otp != attrs['otp_code']:
            raise serializers.ValidationError('Invalid or expired OTP')
        attrs['user_data'] = user_data
        return attrs
