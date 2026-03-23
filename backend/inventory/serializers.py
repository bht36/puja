from rest_framework import serializers
from .models import ProductGrid, Category, Product, Bundle, BundleImage, ScrapSubmission, Order, OrderItem, Review

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
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    images = BundleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Bundle
        fields = ['id', 'name', 'description', 'images', 'items', 'total_price', 'is_active']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True, default=None)
    bundle_name = serializers.CharField(source='bundle.name', read_only=True, default=None)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'bundle', 'product_name', 'bundle_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    class Meta:
        model = Order
        fields = ['id', 'user_name', 'total_amount', 'status', 'delivery_address',
                  'delivery_city', 'delivery_phone', 'payment_method', 'payment_status',
                  'items', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
