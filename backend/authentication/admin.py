from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_verified', 'is_active', 'last_login')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_verified', 'gender')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)

    fieldsets = (
        ('Account', {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'gender')}),
        ('Address', {'fields': ('address', 'city', 'postal_code'), 'classes': ('collapse',)}),
        ('Profile', {'fields': ('profile_image',)}),
        ('Roles & Status', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')}),
        ('Permissions', {'fields': ('groups', 'user_permissions'), 'classes': ('collapse',)}),
        ('Dates', {'fields': ('last_login', 'date_joined'), 'classes': ('collapse',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__email', 'code')
    readonly_fields = ('created_at', 'expires_at')
    ordering = ('-created_at',)
