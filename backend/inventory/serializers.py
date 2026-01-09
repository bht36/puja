from rest_framework import serializers
from .models import ProductGrid, Category, Product, Bundle, BundleImage, ScrapSubmission, Order, OrderItem

class ProductGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGrid
        fields = ['id', 'title', 'order', 'is_active']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'color', 'image']

class ProductSerializer(serializers.ModelSerializer):
    grid_title = serializers.CharField(source='product_grid.title', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'product_grid', 'grid_title', 'stock', 'image', 'is_active']

class BundleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image']

class BundleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BundleImage
        fields = ['id', 'image', 'order']

class BundleSerializer(serializers.ModelSerializer):
    items = BundleItemSerializer(source='products', many=True, read_only=True)
    images = BundleImageSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Bundle
        fields = ['id', 'name', 'description', 'items', 'images', 'total_price', 'is_active']
