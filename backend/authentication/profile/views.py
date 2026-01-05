from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserProfileUpdateSerializer, EmailChangeVerificationSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    # Import here to avoid circular import
    from authentication.login.serializers import UserSerializer
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    # Import here to avoid circular import
    from authentication.login.serializers import UserSerializer
    
    serializer = UserProfileUpdateSerializer(
        request.user, 
        data=request.data, 
        partial=True
    )
    if serializer.is_valid():
        user = serializer.save()
        
        # Check if email change was requested
        new_email = request.data.get('new_email')
        if new_email and new_email != user.email:
            return Response({
                'message': 'Profile updated. Please check your new email for verification code.',
                'user': UserSerializer(user, context={'request': request}).data,
                'email_verification_required': True,
                'new_email': new_email
            })
        
        return Response({
            'message': 'Profile updated successfully',
            'user': UserSerializer(user, context={'request': request}).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_email_change(request):
    # Import here to avoid circular import
    from authentication.login.serializers import UserSerializer
    
    serializer = EmailChangeVerificationSerializer(
        data=request.data,
        context={'request': request}
    )
    if serializer.is_valid():
        user = serializer.validated_data['user']
        otp = serializer.validated_data['otp']
        new_email = serializer.validated_data['new_email']
        
        # Update email
        user.email = new_email
        user.save()
        
        # Mark OTP as used
        otp.is_used = True
        otp.save()
        
        return Response({
            'message': 'Email updated successfully',
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
