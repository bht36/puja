from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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
    return Response(ProductSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_detail(request, product_id):
    return Response(ProductSerializer(get_object_or_404(Product, id=product_id, is_active=True)).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_bundles(request):
    return Response(BundleSerializer(Bundle.objects.filter(is_active=True), many=True).data)


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
    if not request.FILES.get('image'):
        return Response({'error': 'image is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        scrap = ScrapSubmission.objects.create(
            user=request.user,
            item_name=request.data['item_name'],
            description=request.data['description'],
            weight=request.data['weight'],
            image=request.FILES['image'],
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
    bundles = Bundle.objects.filter(name__icontains=q, is_active=True).values('id', 'name')[:4]
    results = [{'id': p['id'], 'name': p['name'], 'price': str(p['price']), 'type': 'product'} for p in products]
    results += [{'id': b['id'], 'name': b['name'], 'type': 'bundle'} for b in bundles]
    return Response(results)
