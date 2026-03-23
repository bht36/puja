from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserProfileUpdateSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    from authentication.login.serializers import UserSerializer
    return Response(UserSerializer(request.user, context={'request': request}).data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    from authentication.login.serializers import UserSerializer
    serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'Profile updated successfully', 'user': UserSerializer(user, context={'request': request}).data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
