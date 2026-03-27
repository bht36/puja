import json
from datetime import timedelta
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Sum, Q
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from authentication.models import User
from ..models import Product, ProductGrid, Category, Bundle, BundleImage, ScrapSubmission, Order, Review
from .decorators import staff_required


@staff_required
def dashboard(request):
    today = timezone.now().date()
    sales_data = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        daily_sales = Order.objects.filter(created_at__date=date).aggregate(total=Sum('total_amount'))['total'] or 0
        sales_data.append({'date': date.strftime('%b %d'), 'amount': float(daily_sales)})

    return render(request, 'admin_panel/dashboard.html', {
        'total_products': Product.objects.count(),
        'total_orders': Order.objects.count(),
        'pending_scrap': ScrapSubmission.objects.filter(status='pending').count(),
        'total_users': User.objects.count(),
        'recent_orders': Order.objects.select_related('user').order_by('-created_at')[:5],
        'sales_data': json.dumps(sales_data),
    })


@staff_required
def products_list(request):
    return render(request, 'admin_panel/products.html', {
        'products': Product.objects.select_related('product_grid').all(),
        'grids': ProductGrid.objects.all(),
    })


@staff_required
def grid_create(request):
    if request.method == 'POST':
        try:
            ProductGrid.objects.create(title=request.POST['title'], order=request.POST.get('order', 0))
            messages.success(request, 'Product Grid created successfully!')
            return redirect('admin_panel:products')
        except Exception as e:
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/grid_form.html', {'action': 'Create'})


@staff_required
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
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/grid_form.html', {'grid': grid, 'action': 'Edit'})


@staff_required
def grid_delete(request, grid_id):
    grid = get_object_or_404(ProductGrid, id=grid_id)
    if request.method == 'POST':
        grid.delete()
        messages.success(request, 'Product Grid deleted successfully!')
        return redirect('admin_panel:products')
    return render(request, 'admin_panel/grid_confirm_delete.html', {'grid': grid})


@staff_required
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
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/product_form.html', {'action': 'Create', 'grids': ProductGrid.objects.all()})


@staff_required
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
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/product_form.html', {'product': product, 'action': 'Edit', 'grids': ProductGrid.objects.all()})


@staff_required
def product_delete(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    if request.method == 'POST':
        product.delete()
        messages.success(request, 'Product deleted successfully!')
        return redirect('admin_panel:products')
    return render(request, 'admin_panel/product_confirm_delete.html', {'product': product})


@staff_required
def categories_list(request):
    return render(request, 'admin_panel/categories.html', {
        'categories': Category.objects.all(),
        'bundles': Bundle.objects.all(),
    })


@staff_required
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
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/category_form.html', {'action': 'Create'})


@staff_required
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
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/category_form.html', {'category': category, 'action': 'Edit'})


@staff_required
def category_delete(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    if request.method == 'POST':
        category.delete()
        messages.success(request, 'Category deleted successfully!')
        return redirect('admin_panel:categories')
    return render(request, 'admin_panel/category_confirm_delete.html', {'category': category})


@staff_required
def bundle_create(request):
    if request.method == 'POST':
        try:
            bundle = Bundle.objects.create(
                name=request.POST['name'],
                description=request.POST.get('description', ''),
            )
            for i, img in enumerate(request.FILES.getlist('images')[:5]):
                BundleImage.objects.create(bundle=bundle, image=img, order=i)
            bundle.products.set(request.POST.getlist('products'))
            messages.success(request, 'Bundle created successfully!')
            return redirect('admin_panel:categories')
        except Exception as e:
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/bundle_form.html', {'action': 'Create', 'products': Product.objects.filter(is_active=True)})


@staff_required
def bundle_edit(request, bundle_id):
    bundle = get_object_or_404(Bundle, id=bundle_id)
    if request.method == 'POST':
        try:
            bundle.name = request.POST['name']
            bundle.description = request.POST.get('description', '')
            bundle.save()
            new_images = request.FILES.getlist('images')
            if new_images:
                bundle.images.all().delete()
                for i, img in enumerate(new_images[:5]):
                    BundleImage.objects.create(bundle=bundle, image=img, order=i)
            bundle.products.set(request.POST.getlist('products'))
            messages.success(request, 'Bundle updated successfully!')
            return redirect('admin_panel:categories')
        except Exception as e:
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/bundle_form.html', {'bundle': bundle, 'action': 'Edit', 'products': Product.objects.filter(is_active=True)})


@staff_required
def bundle_delete(request, bundle_id):
    bundle = get_object_or_404(Bundle, id=bundle_id)
    if request.method == 'POST':
        bundle.delete()
        messages.success(request, 'Bundle deleted successfully!')
        return redirect('admin_panel:categories')
    return render(request, 'admin_panel/bundle_confirm_delete.html', {'bundle': bundle})


@staff_required
def scrap_review(request):
    return render(request, 'admin_panel/scrap.html', {
        'scraps': ScrapSubmission.objects.select_related('user').order_by('-submitted_at')
    })


@staff_required
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

            if scrap.status == 'approved':
                send_mail(
                    'Your Scrap Submission Has Been Approved – Puja Pasal',
                    f"Dear {scrap.user.first_name},\n\nYour scrap submission \"{scrap.item_name}\" has been approved.\n\nOffered Price: Rs. {scrap.offered_price}\n"
                    + (f"Admin Notes: {scrap.admin_notes}\n" if scrap.admin_notes else "")
                    + "\nOur team will contact you shortly.\n\nThank you,\nPuja Pasal Team",
                    settings.DEFAULT_FROM_EMAIL, [scrap.user.email], fail_silently=True,
                )
            elif scrap.status == 'rejected':
                send_mail(
                    'Update on Your Scrap Submission – Puja Pasal',
                    f"Dear {scrap.user.first_name},\n\nYour scrap submission \"{scrap.item_name}\" could not be accepted.\n"
                    + (f"Reason: {scrap.admin_notes}\n" if scrap.admin_notes else "")
                    + "\nFeel free to submit again.\n\nThank you,\nPuja Pasal Team",
                    settings.DEFAULT_FROM_EMAIL, [scrap.user.email], fail_silently=True,
                )

            messages.success(request, f'Scrap submission {scrap.status}!')
            return redirect('admin_panel:scrap')
        except Exception as e:
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/scrap_review_form.html', {'scrap': scrap})


@staff_required
def users_list(request):
    return render(request, 'admin_panel/users.html', {'users': User.objects.all().order_by('-date_joined')})


@staff_required
def user_create(request):
    if request.method == 'POST':
        try:
            user = User.objects.create_user(
                username=request.POST['email'].split('@')[0],
                email=request.POST['email'],
                password=request.POST['password'],
                first_name=request.POST.get('first_name', ''),
                last_name=request.POST.get('last_name', ''),
                phone=request.POST.get('phone', ''),
            )
            user.is_active = request.POST.get('is_active') == 'on'
            user.save()
            messages.success(request, 'User created successfully!')
            return redirect('admin_panel:users')
        except Exception as e:
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/user_form.html', {'action': 'Create'})


@staff_required
def user_edit(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        try:
            user.email = request.POST['email']
            user.username = user.email.split('@')[0]
            user.first_name = request.POST.get('first_name', '')
            user.last_name = request.POST.get('last_name', '')
            user.phone = request.POST.get('phone', '')
            user.is_active = request.POST.get('is_active') == 'on'
            user.is_verified = request.POST.get('is_verified') == 'on'
            if request.POST.get('password'):
                user.set_password(request.POST['password'])
            user.save()
            messages.success(request, 'User updated successfully!')
            return redirect('admin_panel:users')
        except Exception as e:
            messages.error(request, f'Error: {e}')
    return render(request, 'admin_panel/user_form.html', {'user': user, 'action': 'Edit'})


@staff_required
def user_delete(request, user_id):
    user = get_object_or_404(User, id=user_id)
    if request.method == 'POST':
        user.delete()
        messages.success(request, 'User deleted successfully!')
        return redirect('admin_panel:users')
    return render(request, 'admin_panel/user_confirm_delete.html', {'user': user})


@staff_required
def user_view(request, user_id):
    return render(request, 'admin_panel/user_detail.html', {'user': get_object_or_404(User, id=user_id)})


@staff_required
def orders_list(request):
    orders = Order.objects.select_related('user').prefetch_related('items').filter(
        Q(payment_method='cod') | Q(payment_status='paid')
    ).order_by('-created_at')
    return render(request, 'admin_panel/orders.html', {'orders': orders})


@staff_required
def order_update_status(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if request.method == 'POST':
        order.status = request.POST['status']
        order.save(update_fields=['status'])
        messages.success(request, f'Order #{order.id} status updated.')
    return redirect('admin_panel:orders')


@staff_required
def reviews_list(request):
    return render(request, 'admin_panel/reviews.html', {
        'reviews': Review.objects.select_related('user', 'order').order_by('-created_at')
    })


@staff_required
def review_delete(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    if request.method == 'POST':
        review.delete()
        messages.success(request, 'Review deleted.')
    return redirect('admin_panel:reviews')
