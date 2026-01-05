from django.contrib import admin
from .models import ProductGrid, Category, Product, Bundle, BundleItem, BundleImage, ScrapSubmission, Order, OrderItem

@admin.register(ProductGrid)
class ProductGridAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('title',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_grid', 'price', 'stock', 'is_active', 'created_at')
    list_filter = ('product_grid', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('price', 'stock', 'is_active')

@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)

@admin.register(BundleItem)
class BundleItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'bundle', 'price', 'order')
    list_filter = ('bundle',)
    search_fields = ('name',)

@admin.register(BundleImage)
class BundleImageAdmin(admin.ModelAdmin):
    list_display = ('bundle', 'order')
    list_filter = ('bundle',)

@admin.register(ScrapSubmission)
class ScrapSubmissionAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'user', 'weight', 'status', 'offered_price', 'submitted_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('item_name', 'user__email')
    list_editable = ('status', 'offered_price')
    readonly_fields = ('submitted_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'id')
    list_editable = ('status',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'bundle', 'quantity', 'price')
    list_filter = ('order__status',)
