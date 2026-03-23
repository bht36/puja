from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from inventory import views as v

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('admin/', include('inventory.urls')),
    path('api/auth/', include('authentication.urls')),

    # Catalog
    path('api/product-grids/', v.api_product_grids),
    path('api/categories/', v.api_categories),
    path('api/products/', v.api_products),
    path('api/products/<int:product_id>/', v.api_product_detail),
    path('api/bundles/', v.api_bundles),
    path('api/bundles/<int:bundle_id>/', v.api_bundle_detail),
    path('api/scrap/submit/', v.api_scrap_submit),
    path('api/search/', v.api_search),

    # Orders
    path('api/orders/', v.api_create_order),
    path('api/orders/my/', v.api_my_orders),
    path('api/orders/<int:order_id>/', v.api_order_detail),
    path('api/orders/<int:order_id>/cancel/', v.api_cancel_order),

    # Payment
    path('api/payment/esewa/initiate/', v.api_esewa_initiate),
    path('api/payment/esewa/verify/', v.api_esewa_verify),

    # Reviews
    path('api/reviews/', v.api_reviews),
    path('api/reviews/submit/', v.api_submit_review),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
