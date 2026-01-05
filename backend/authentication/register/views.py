from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .serializers import UserRegistrationSerializer, OTPVerificationSerializer
from authentication.models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        result = serializer.save()
        return Response({
            'message': 'Registration initiated. Please check your email for verification code.',
            'email': result['email']
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    serializer = OTPVerificationSerializer(data=request.data)
    if serializer.is_valid():
        user_data = serializer.validated_data['user_data']
        email = serializer.validated_data['email']
        
        # Create user only after OTP verification
        user = User.objects.create_user(**user_data)
        user.is_verified = True
        user.save()
        
        # Clear cache
        cache.delete(f"pending_user_{email}")
        cache.delete(f"pending_otp_{email}")
        
        # Import here to avoid circular import
        from authentication.login.serializers import UserSerializer
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Registration completed successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if pending registration exists
    user_data = cache.get(f"pending_user_{email}")
    if not user_data:
        return Response({'error': 'No pending registration found. Please register again.'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    # Generate new OTP
    import random
    from django.core.mail import send_mail
    from django.conf import settings
    
    otp_code = str(random.randint(100000, 999999))
    cache.set(f"pending_otp_{email}", otp_code, timeout=600)  # 10 minutes
    
    # Send OTP email
    send_mail(
        'Verify Your Account - New Code',
        f'Your new verification code is: {otp_code}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
    
    return Response({'message': 'New OTP sent successfully'}, status=status.HTTP_200_OK)
