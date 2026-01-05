from django.urls import path, include

urlpatterns = [
    path('', include('authentication.register.urls')),
    path('', include('authentication.login.urls')),
    path('', include('authentication.profile.urls')),
    path('', include('authentication.forgot_password.urls')),
]
