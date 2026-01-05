from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import User, OTP

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    new_email = serializers.EmailField(required=False, write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'phone', 'address', 
                 'city', 'postal_code', 'date_of_birth', 'gender', 'profile_image', 'new_email')
    
    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_new_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def update(self, instance, validated_data):
        new_email = validated_data.pop('new_email', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle email change
        if new_email and new_email != instance.email:
            # Send OTP to new email
            otp = OTP.objects.create(user=instance)
            send_mail(
                'Verify Your New Email',
                f'Your email verification code is: {otp.code}',
                settings.DEFAULT_FROM_EMAIL,
                [new_email],
                fail_silently=False,
            )
            # Store new email temporarily (you might want to add a field for this)
            instance.temp_email = new_email
            instance.save()
            
        return instance

class EmailChangeVerificationSerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6)
    new_email = serializers.EmailField()
    
    def validate(self, attrs):
        user = self.context['request'].user
        otp = OTP.objects.filter(user=user, code=attrs['otp_code'], is_used=False).first()
        
        if not otp or not otp.is_valid():
            raise serializers.ValidationError('Invalid or expired OTP')
        
        attrs['user'] = user
        attrs['otp'] = otp
        return attrs
