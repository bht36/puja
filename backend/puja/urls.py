from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),  # Django's built-in admin
    path('admin/', include('inventory.urls')),  # Your custom admin panel
    path('api/auth/', include('authentication.urls')),
]

# API URLs (without namespace to avoid conflict)
from inventory import views as inventory_views
urlpatterns += [
    path('api/product-grids/', inventory_views.api_product_grids, name='api_product_grids'),
    path('api/categories/', inventory_views.api_categories, name='api_categories'),
    path('api/products/', inventory_views.api_products, name='api_products'),
    path('api/products/<int:product_id>/', inventory_views.api_product_detail, name='api_product_detail'),
    path('api/bundles/', inventory_views.api_bundles, name='api_bundles'),
    path('api/bundles/<int:bundle_id>/', inventory_views.api_bundle_detail, name='api_bundle_detail'),
    path('api/scrap/submit/', inventory_views.api_scrap_submit, name='api_scrap_submit'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
