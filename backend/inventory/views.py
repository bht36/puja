import json
from datetime import timedelta
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.db.models import Sum
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ProductGrid, Category, Product, Bundle, BundleItem, BundleImage, ScrapSubmission, Order, OrderItem
from authentication.models import User
from .serializers import ProductGridSerializer, CategorySerializer, ProductSerializer, BundleSerializer

@staff_member_required
def dashboard(request):
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    pending_scrap = ScrapSubmission.objects.filter(status='pending').count()
    total_users = User.objects.count()
    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
    
    # Sales data for last 7 days
    today = timezone.now().date()
    sales_data = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        daily_sales = Order.objects.filter(created_at__date=date).aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        sales_data.append({'date': date.strftime('%b %d'), 'amount': float(daily_sales)})
    
    return render(request, 'admin_panel/dashboard.html', {
        'total_products': total_products,
        'total_orders': total_orders,
        'pending_scrap': pending_scrap,
        'total_users': total_users,
        'recent_orders': recent_orders,
        'sales_data': json.dumps(sales_data),
    })

@staff_member_required
def products_list(request):
    products = Product.objects.select_related('product_grid').all()
    grids = ProductGrid.objects.all()
    return render(request, 'admin_panel/products.html', {'products': products, 'grids': grids})

@staff_member_required
def grid_create(request):
    if request.method == 'POST':
        try:
            ProductGrid.objects.create(
                title=request.POST['title'],
                order=request.POST.get('order', 0),
            )
            messages.success(request, 'Product Grid created successfully!')
            return redirect('admin_panel:products')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/grid_form.html', {'action': 'Create'})

@staff_member_required
def grid_edit(request, grid_id):
    grid = get_object_or_404(ProductGrid, id=grid_id)
    if request.method == 'POST':
        try:
            grid.title = request.POST['title']
            grid.order = request.POST.get('order', 0)
            grid.save()
            messages.success(request, 'Product Grid updated successfully!')
            return redirect('admin_panel:products')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/grid_form.html', {'grid': grid, 'action': 'Edit'})

@staff_member_required
def grid_delete(request, grid_id):
    grid = get_object_or_404(ProductGrid, id=grid_id)
    if request.method == 'POST':
        grid.delete()
        messages.success(request, 'Product Grid deleted successfully!')
        return redirect('admin_panel:products')
    return render(request, 'admin_panel/grid_confirm_delete.html', {'grid': grid})

@staff_member_required
def product_create(request):
    if request.method == 'POST':
        try:
            product = Product.objects.create(
                name=request.POST['name'],
                description=request.POST.get('description', ''),
                price=request.POST['price'],
                product_grid_id=request.POST.get('product_grid') or None,
                stock=request.POST.get('stock', 0),
            )
            if request.FILES.get('image'):
                product.image = request.FILES['image']
                product.save()
            messages.success(request, 'Product created successfully!')
            return redirect('admin_panel:products')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    grids = ProductGrid.objects.all()
    return render(request, 'admin_panel/product_form.html', {'action': 'Create', 'grids': grids})

@staff_member_required
def product_edit(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        try:
            product.name = request.POST['name']
            product.description = request.POST.get('description', '')
            product.price = request.POST['price']
            product.product_grid_id = request.POST.get('product_grid') or None
            product.stock = request.POST.get('stock', 0)
            if request.FILES.get('image'):
                product.image = request.FILES['image']
            product.save()
            messages.success(request, 'Product updated successfully!')
            return redirect('admin_panel:products')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    grids = ProductGrid.objects.all()
    return render(request, 'admin_panel/product_form.html', {'product': product, 'action': 'Edit', 'grids': grids})

@staff_member_required
def product_delete(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        product.delete()
        messages.success(request, 'Product deleted successfully!')
        return redirect('admin_panel:products')
    return render(request, 'admin_panel/product_confirm_delete.html', {'product': product})

@staff_member_required
def categories_list(request):
    categories = Category.objects.all()
    bundles = Bundle.objects.all()
    return render(request, 'admin_panel/categories.html', {'categories': categories, 'bundles': bundles})

@staff_member_required
def scrap_review(request):
    scraps = ScrapSubmission.objects.select_related('user').order_by('-submitted_at')
    return render(request, 'admin_panel/scrap.html', {'scraps': scraps})

@staff_member_required
def scrap_update(request, scrap_id):
    scrap = get_object_or_404(ScrapSubmission, id=scrap_id)
    if request.method == 'POST':
        try:
            scrap.status = request.POST['status']
            scrap.offered_price = request.POST.get('offered_price') or None
            scrap.admin_notes = request.POST.get('admin_notes', '')
            if scrap.status in ['approved', 'rejected']:
                scrap.reviewed_at = timezone.now()
            scrap.save()
            messages.success(request, f'Scrap submission {scrap.status}!')
            return redirect('admin_panel:scrap')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/scrap_review_form.html', {'scrap': scrap})

@staff_member_required
def users_list(request):
    users = User.objects.all().order_by('-date_joined')
    return render(request, 'admin_panel/users.html', {'users': users})

@staff_member_required
def user_create(request):
    if request.method == 'POST':
        try:
            user = User.objects.create_user(
                username=request.POST['username'],
                email=request.POST['email'],
                password=request.POST['password'],
                first_name=request.POST.get('first_name', ''),
                last_name=request.POST.get('last_name', ''),
                phone=request.POST.get('phone', ''),
            )
            user.is_staff = request.POST.get('is_staff') == 'on'
            user.is_active = request.POST.get('is_active') == 'on'
            user.save()
            messages.success(request, 'User created successfully!')
            return redirect('admin_panel:users')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/user_form.html', {'action': 'Create'})

@staff_member_required
def user_edit(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        try:
            user.username = request.POST['username']
            user.email = request.POST['email']
            user.first_name = request.POST.get('first_name', '')
            user.last_name = request.POST.get('last_name', '')
            user.phone = request.POST.get('phone', '')
            user.is_staff = request.POST.get('is_staff') == 'on'
            user.is_active = request.POST.get('is_active') == 'on'
            user.is_verified = request.POST.get('is_verified') == 'on'
            if request.POST.get('password'):
                user.set_password(request.POST['password'])
            user.save()
            messages.success(request, 'User updated successfully!')
            return redirect('admin_panel:users')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/user_form.html', {'user': user, 'action': 'Edit'})

@staff_member_required
def user_delete(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        user.delete()
        messages.success(request, 'User deleted successfully!')
        return redirect('admin_panel:users')
    return render(request, 'admin_panel/user_confirm_delete.html', {'user': user})

@staff_member_required
def user_view(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return render(request, 'admin_panel/user_detail.html', {'user': user})

@staff_member_required
def category_create(request):
    if request.method == 'POST':
        try:
            category = Category.objects.create(
                name=request.POST['name'],
                description=request.POST.get('description', ''),
                icon=request.POST.get('icon', '🙏'),
                color=request.POST.get('color', 'from-blue-400 to-purple-500'),
            )
            if request.FILES.get('image'):
                category.image = request.FILES['image']
                category.save()
            messages.success(request, 'Category created successfully!')
            return redirect('admin_panel:categories')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/category_form.html', {'action': 'Create'})

@staff_member_required
def category_edit(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    if request.method == 'POST':
        try:
            category.name = request.POST['name']
            category.description = request.POST.get('description', '')
            category.icon = request.POST.get('icon', '🙏')
            category.color = request.POST.get('color', 'from-blue-400 to-purple-500')
            if request.FILES.get('image'):
                category.image = request.FILES['image']
            category.save()
            messages.success(request, 'Category updated successfully!')
            return redirect('admin_panel:categories')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/category_form.html', {'category': category, 'action': 'Edit'})

@staff_member_required
def category_delete(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    if request.method == 'POST':
        category.delete()
        messages.success(request, 'Category deleted successfully!')
        return redirect('admin_panel:categories')
    return render(request, 'admin_panel/category_confirm_delete.html', {'category': category})

@staff_member_required
def bundle_create(request):
    if request.method == 'POST':
        try:
            bundle = Bundle.objects.create(
                name=request.POST['name'],
                description=request.POST.get('description', ''),
            )
            images = request.FILES.getlist('images')
            for idx, img in enumerate(images):
                BundleImage.objects.create(bundle=bundle, image=img, order=idx)
            
            item_count = int(request.POST.get('item_count', 0))
            for i in range(item_count):
                name = request.POST.get(f'item_name_{i}')
                desc = request.POST.get(f'item_desc_{i}', '')
                price = request.POST.get(f'item_price_{i}')
                if name and price:
                    BundleItem.objects.create(bundle=bundle, name=name, description=desc, price=price, order=i)
            
            messages.success(request, 'Bundle created successfully!')
            return redirect('admin_panel:categories')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/bundle_form.html', {'action': 'Create'})

@staff_member_required
def bundle_edit(request, bundle_id):
    bundle = get_object_or_404(Bundle, id=bundle_id)
    if request.method == 'POST':
        try:
            bundle.name = request.POST['name']
            bundle.description = request.POST.get('description', '')
            bundle.save()
            
            if request.POST.get('clear_images'):
                bundle.images.all().delete()
            images = request.FILES.getlist('images')
            if images:
                bundle.images.all().delete()
                for idx, img in enumerate(images):
                    BundleImage.objects.create(bundle=bundle, image=img, order=idx)
            
            bundle.items.all().delete()
            item_count = int(request.POST.get('item_count', 0))
            for i in range(item_count):
                name = request.POST.get(f'item_name_{i}')
                desc = request.POST.get(f'item_desc_{i}', '')
                price = request.POST.get(f'item_price_{i}')
                if name and price:
                    BundleItem.objects.create(bundle=bundle, name=name, description=desc, price=price, order=i)
            
            messages.success(request, 'Bundle updated successfully!')
            return redirect('admin_panel:categories')
        except Exception as e:
            messages.error(request, f'Error: {str(e)}')
    return render(request, 'admin_panel/bundle_form.html', {'bundle': bundle, 'action': 'Edit'})

@staff_member_required
def bundle_delete(request, bundle_id):
    bundle = get_object_or_404(Bundle, id=bundle_id)
    if request.method == 'POST':
        bundle.delete()
        messages.success(request, 'Bundle deleted successfully!')
        return redirect('admin_panel:categories')
    return render(request, 'admin_panel/bundle_confirm_delete.html', {'bundle': bundle})

# API Endpoints
@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_grids(request):
    grids = ProductGrid.objects.filter(is_active=True)
    return Response(ProductGridSerializer(grids, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_categories(request):
    categories = Category.objects.all()
    return Response(CategorySerializer(categories, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_products(request):
    grid_id = request.GET.get('grid')
    products = Product.objects.filter(is_active=True, product_grid_id=grid_id) if grid_id else Product.objects.filter(is_active=True)
    return Response(ProductSerializer(products, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_active=True)
    return Response(ProductSerializer(product).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_bundles(request):
    bundles = Bundle.objects.filter(is_active=True)
    return Response(BundleSerializer(bundles, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_bundle_detail(request, bundle_id):
    bundle = get_object_or_404(Bundle, id=bundle_id, is_active=True)
    return Response(BundleSerializer(bundle).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_scrap_submit(request):
    try:
        scrap = ScrapSubmission.objects.create(
            user=request.user,
            item_name=request.data.get('item_name'),
            description=request.data.get('description'),
            weight=request.data.get('weight'),
            image=request.FILES.get('image'),
        )
        return Response({'message': 'Scrap submitted successfully', 'id': scrap.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
