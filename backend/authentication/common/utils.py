from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import random
from datetime import timedelta
import os

def user_profile_image_path(instance, filename):
    return f'profile_images/{instance.id}/{filename}'
