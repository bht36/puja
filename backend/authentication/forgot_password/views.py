from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import User, OTP

MAX_OTP_ATTEMPTS = 5


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email', '').strip()
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email, is_verified=True)
        # Invalidate any previous unused OTPs
        OTP.objects.filter(user=user, is_used=False).update(is_used=True)
        otp = OTP.objects.create(user=user)
        cache.delete(f"reset_otp_attempts_{email}")
        send_mail(
            'Password Reset OTP',
            f'Your password reset code is: {otp.code}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return Response({'message': 'OTP sent to your email', 'email': email})
    except User.DoesNotExist:
        return Response({'error': 'No verified account found with this email'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    email = request.data.get('email', '').strip()
    otp_code = request.data.get('otp_code', '').strip()
    if not email or not otp_code:
        return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

    attempts_key = f"reset_otp_attempts_{email}"
    attempts = cache.get(attempts_key, 0)
    if attempts >= MAX_OTP_ATTEMPTS:
        # Invalidate all OTPs for this user
        try:
            user = User.objects.get(email=email)
            OTP.objects.filter(user=user, is_used=False).update(is_used=True)
        except User.DoesNotExist:
            pass
        cache.delete(attempts_key)
        return Response(
            {'error': 'Too many incorrect attempts. Please request a new OTP.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    try:
        user = User.objects.get(email=email)
        otp = OTP.objects.filter(user=user, code=otp_code, is_used=False).first()
        if not otp or not otp.is_valid():
            cache.set(attempts_key, attempts + 1, timeout=600)
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        import secrets
        reset_token = secrets.token_urlsafe(32)
        otp.is_used = True
        otp.code = 'RESET_' + reset_token
        otp.save()
        cache.delete(attempts_key)
        return Response({'message': 'OTP verified', 'email': email, 'reset_token': reset_token, 'verified': True})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()
    password_confirm = request.data.get('password_confirm', '').strip()
    reset_token = request.data.get('reset_token', '').strip()
    if not all([email, password, password_confirm, reset_token]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
    if password != password_confirm:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)
    if not any(ch.isupper() for ch in password):
        return Response({'error': 'Password must contain at least one uppercase letter'}, status=status.HTTP_400_BAD_REQUEST)
    if not any(ch.isdigit() for ch in password):
        return Response({'error': 'Password must contain at least one number'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
        otp = OTP.objects.filter(user=user, code='RESET_' + reset_token, is_used=False).first()
        if not otp or not otp.is_valid():
            return Response({'error': 'Invalid or expired reset token. Please restart the process.'}, status=status.HTTP_400_BAD_REQUEST)
        otp.is_used = True
        otp.save()
        user.set_password(password)
        user.save()
        return Response({'message': 'Password reset successful'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
