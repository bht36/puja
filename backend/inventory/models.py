from django.db import models
from authentication.models import User

class ProductGrid(models.Model):
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.title

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, default='🙏', help_text='Emoji icon')
    color = models.CharField(max_length=50, default='from-blue-400 to-purple-500', help_text='Tailwind gradient classes')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    product_grid = models.ForeignKey(ProductGrid, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Bundle(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class BundleImage(models.Model):
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='bundles/')
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']

class BundleItem(models.Model):
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.name} in {self.bundle.name}"

class ScrapSubmission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    description = models.TextField()
    weight = models.DecimalField(max_digits=10, decimal_places=2, help_text='Weight in grams')
    image = models.ImageField(upload_to='scrap/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    offered_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.item_name} - {self.user.email}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        item = self.product or self.bundle
        return f"{item.name} x {self.quantity}"
