import re
from rest_framework import serializers
from authentication.models import User

ALLOWED_IMAGE_TYPES = ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone', 'address', 'city', 'postal_code', 'gender', 'profile_image')

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("First name is required.")
        if len(value) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters.")
        if re.search(r'[^a-zA-Z\s]', value):
            raise serializers.ValidationError("First name must contain letters only.")
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if value and len(value) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters.")
        if value and re.search(r'[^a-zA-Z\s]', value):
            raise serializers.ValidationError("Last name must contain letters only.")
        return value

    def validate_city(self, value):
        value = value.strip()
        if value and re.search(r'[^a-zA-Z\s]', value):
            raise serializers.ValidationError("City must contain letters only.")
        return value

    def validate_address(self, value):
        return value.strip()

    def validate_phone(self, value):
        if value and not re.match(r'^(97|98)\d{8}$', value):
            raise serializers.ValidationError("Enter a valid Nepal phone number (e.g. 98XXXXXXXX).")
        return value

    def validate_postal_code(self, value):
        if value and not re.match(r'^\d{5}$', value):
            raise serializers.ValidationError("Postal code must be exactly 5 digits.")
        return value

    def validate_gender(self, value):
        if value and value not in ('male', 'female', 'other'):
            raise serializers.ValidationError("Gender must be male, female, or other.")
        return value

    def validate_profile_image(self, value):
        if value:
            content_type = getattr(value, 'content_type', '')
            if content_type not in ALLOWED_IMAGE_TYPES:
                raise serializers.ValidationError("Only JPEG, PNG, or WebP images are allowed.")
            if value.size > MAX_IMAGE_SIZE:
                raise serializers.ValidationError("Image must be under 5MB.")
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
