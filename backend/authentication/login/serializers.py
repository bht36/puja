from rest_framework import serializers
from django.contrib.auth import authenticate
from authentication.models import User

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Email or password invalid')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            if not user.is_verified:
                raise serializers.ValidationError('Please verify your email first')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        return attrs

class UserSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'address', 'city', 'postal_code', 'gender', 'profile_image', 'profile_image_url', 'is_verified', 'created_at')
        read_only_fields = ('id', 'created_at', 'profile_image_url')
    
    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None
