from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('products/', views.products_list, name='products'),
    path('products/create/', views.product_create, name='product_create'),
    path('products/<int:product_id>/edit/', views.product_edit, name='product_edit'),
    path('products/<int:product_id>/delete/', views.product_delete, name='product_delete'),
    path('grids/create/', views.grid_create, name='grid_create'),
    path('grids/<int:grid_id>/edit/', views.grid_edit, name='grid_edit'),
    path('grids/<int:grid_id>/delete/', views.grid_delete, name='grid_delete'),
    path('categories/', views.categories_list, name='categories'),
    path('categories/create/', views.category_create, name='category_create'),
    path('categories/<int:category_id>/edit/', views.category_edit, name='category_edit'),
    path('categories/<int:category_id>/delete/', views.category_delete, name='category_delete'),
    path('bundles/create/', views.bundle_create, name='bundle_create'),
    path('bundles/<int:bundle_id>/edit/', views.bundle_edit, name='bundle_edit'),
    path('bundles/<int:bundle_id>/delete/', views.bundle_delete, name='bundle_delete'),
    path('scrap/', views.scrap_review, name='scrap'),
    path('scrap/<int:scrap_id>/review/', views.scrap_update, name='scrap_update'),
    path('users/', views.users_list, name='users'),
    path('users/create/', views.user_create, name='user_create'),
    path('users/<int:user_id>/edit/', views.user_edit, name='user_edit'),
    path('users/<int:user_id>/delete/', views.user_delete, name='user_delete'),
    path('users/<int:user_id>/', views.user_view, name='user_view'),
    path('orders/', views.orders_list, name='orders'),
    path('orders/<int:order_id>/status/', views.order_update_status, name='order_status'),
    path('reviews/', views.reviews_list, name='reviews'),
    path('reviews/<int:review_id>/approve/', views.review_approve, name='review_approve'),
]
