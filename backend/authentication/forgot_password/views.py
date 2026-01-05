from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import User, OTP

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email, is_verified=True)
        otp = OTP.objects.create(user=user)
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
    email = request.data.get('email')
    otp_code = request.data.get('otp_code')
    
    if not email or not otp_code:
        return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        otp = OTP.objects.filter(user=user, code=otp_code, is_used=False).first()
        
        if not otp or not otp.is_valid():
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        otp.is_used = True
        otp.save()
        return Response({'message': 'OTP verified', 'email': email, 'verified': True})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get('email')
    password = request.data.get('password')
    password_confirm = request.data.get('password_confirm')
    
    if not all([email, password, password_confirm]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if password != password_confirm:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
        return Response({'message': 'Password reset successful'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
