from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .serializers import UserLoginSerializer, UserSerializer

MAX_ATTEMPTS = 5
LOCKOUT_SECONDS = 300  # 5 minutes

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email', '').strip().lower()
    lock_key = f"login_lock_{email}"
    attempts_key = f"login_attempts_{email}"

    if cache.get(lock_key):
        return Response(
            {'error': 'Account temporarily locked due to too many failed attempts. Try again in 5 minutes.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        cache.delete(attempts_key)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)

    # Increment failed attempts
    attempts = cache.get(attempts_key, 0) + 1
    cache.set(attempts_key, attempts, timeout=LOCKOUT_SECONDS)
    if attempts >= MAX_ATTEMPTS:
        cache.set(lock_key, True, timeout=LOCKOUT_SECONDS)
        cache.delete(attempts_key)
        return Response(
            {'error': 'Account locked after 5 failed attempts. Try again in 5 minutes.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    return Response(
        {**serializer.errors, 'attempts_remaining': MAX_ATTEMPTS - attempts},
        status=status.HTTP_400_BAD_REQUEST
    )
