from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from ..models import ProductGrid, Category, Product, Bundle, ScrapSubmission
from ..serializers import ProductGridSerializer, CategorySerializer, ProductSerializer, BundleSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_grids(request):
    return Response(ProductGridSerializer(ProductGrid.objects.filter(is_active=True), many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_categories(request):
    return Response(CategorySerializer(Category.objects.all(), many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_products(request):
    grid_id = request.GET.get('grid')
    qs = Product.objects.filter(is_active=True, product_grid_id=grid_id) if grid_id else Product.objects.filter(is_active=True)
    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(qs, request)
    return paginator.get_paginated_response(ProductSerializer(page, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_detail(request, product_id):
    return Response(ProductSerializer(get_object_or_404(Product, id=product_id, is_active=True)).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_bundles(request):
    qs = Bundle.objects.filter(is_active=True)
    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(qs, request)
    return paginator.get_paginated_response(BundleSerializer(page, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_bundle_detail(request, bundle_id):
    return Response(BundleSerializer(get_object_or_404(Bundle, id=bundle_id, is_active=True)).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_scrap_submit(request):
    for field in ['item_name', 'description', 'weight']:
        if not request.data.get(field):
            return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        weight = float(request.data['weight'])
    except (ValueError, TypeError):
        return Response({'error': 'Weight must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)
    if weight <= 0:
        return Response({'error': 'Weight must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)
    description = request.data.get('description', '').strip()
    if len(description) < 10:
        return Response({'error': 'Description must be at least 10 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    image = request.FILES.get('image')
    if not image:
        return Response({'error': 'image is required'}, status=status.HTTP_400_BAD_REQUEST)
    if image.size > 10 * 1024 * 1024:
        return Response({'error': 'Image must be under 10MB.'}, status=status.HTTP_400_BAD_REQUEST)
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if image.content_type not in allowed_types:
        return Response({'error': 'Only JPEG, PNG, or WebP images are allowed.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        scrap = ScrapSubmission.objects.create(
            user=request.user,
            item_name=request.data['item_name'],
            description=description,
            weight=weight,
            image=image,
            latitude=request.data.get('latitude'),
            longitude=request.data.get('longitude'),
            address=request.data.get('address', ''),
        )
        return Response({'message': 'Scrap submitted successfully', 'id': scrap.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_search(request):
    q = request.GET.get('q', '').strip()
    if not q:
        return Response([])
    products = Product.objects.filter(name__icontains=q, is_active=True).values('id', 'name', 'price')[:8]
    bundles = Bundle.objects.filter(name__icontains=q, is_active=True).prefetch_related('products')[:4]
    results = [{'id': p['id'], 'name': p['name'], 'price': str(p['price']), 'type': 'product'} for p in products]
    results += [{'id': b.id, 'name': b.name, 'price': str(b.total_price()), 'type': 'bundle'} for b in bundles]
    return Response(results)
