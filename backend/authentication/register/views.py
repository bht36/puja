import random
import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.db import transaction, IntegrityError
from .serializers import UserRegistrationSerializer, OTPVerificationSerializer
from .utils import send_otp_email, normalize_email_input
from authentication.models import User

logger = logging.getLogger(__name__)

MAX_OTP_ATTEMPTS = 5


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            result = serializer.save()
            return Response({
                'message': 'Registration initiated. Please check your email for verification code.',
                'email': result['email']
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({'error': 'Registration failed. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = normalize_email_input(request.data.get('email', ''))
    otp_code = request.data.get('otp_code', '').strip()

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    attempts_key = f"otp_attempts_{email}"
    attempts = cache.get(attempts_key, 0)

    if attempts >= MAX_OTP_ATTEMPTS:
        cache.delete(f"pending_user_{email}")
        cache.delete(f"pending_otp_{email}")
        cache.delete(attempts_key)
        logger.warning(f"Max OTP attempts exceeded for {email}")
        return Response(
            {'error': 'Too many incorrect attempts. Please register again.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    serializer = OTPVerificationSerializer(data={'email': email, 'otp_code': otp_code})
    if serializer.is_valid():
        user_data = serializer.validated_data['user_data']
        email_val = serializer.validated_data['email']

        try:
            with transaction.atomic():
                user = User.objects.create_user(**user_data)
                user.is_verified = True
                user.save()

            cache.delete(f"pending_user_{email_val}")
            cache.delete(f"pending_otp_{email_val}")
            cache.delete(attempts_key)
            logger.info(f"User {email_val} registered successfully")

            from authentication.login.serializers import UserSerializer
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Registration completed successfully',
                'user': UserSerializer(user).data,
                'tokens': {'refresh': str(refresh), 'access': str(refresh.access_token)},
            }, status=status.HTTP_200_OK)

        except IntegrityError as e:
            logger.error(f"Integrity error creating user for {email_val}: {str(e)}")
            return Response(
                {'error': 'This email is already registered. Please try logging in.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error during user creation for {email_val}: {str(e)}")
            return Response({'error': 'Registration failed. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    cache.set(attempts_key, attempts + 1, timeout=600)
    remaining = MAX_OTP_ATTEMPTS - (attempts + 1)
    logger.warning(f"Failed OTP attempt for {email}. Attempts: {attempts + 1}/{MAX_OTP_ATTEMPTS}")

    errors = serializer.errors.copy()
    if remaining > 0:
        errors['attempts_remaining'] = remaining
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    email = normalize_email_input(request.data.get('email', ''))

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    user_data = cache.get(f"pending_user_{email}")
    if not user_data:
        return Response(
            {'error': 'No pending registration found. Please register again.'},
            status=status.HTTP_404_NOT_FOUND
        )

    otp_code = str(random.randint(100000, 999999))
    cache.set(f"pending_otp_{email}", otp_code, timeout=600)
    cache.delete(f"otp_attempts_{email}")

    try:
        send_otp_email(email, otp_code, is_resend=True)
        logger.info(f"OTP resent to {email}")
        return Response({'message': 'New OTP sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Failed to resend OTP to {email}: {str(e)}")
        return Response({'error': 'Failed to send verification email. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
