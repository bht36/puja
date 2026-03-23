from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import User, OTP

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'address', 'city', 'postal_code', 'gender', 'profile_image')

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
