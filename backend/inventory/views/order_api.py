import re
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import models, transaction
from ..models import Order, OrderItem, Product, Bundle, Review
from ..serializers import OrderSerializer, ReviewSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_order(request):
    data = request.data
    items = data.get('items', [])
    if not items:
        return Response({'error': 'Order must contain at least one item.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        if not data.get('address', '').strip():
            return Response({'error': 'Delivery address is required.'}, status=status.HTTP_400_BAD_REQUEST)
        phone = data.get('phone', '').strip()
        if not phone:
            return Response({'error': 'Phone number is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(r'^(97|98)\d{8}$', phone):
            return Response({'error': 'Enter a valid Nepal phone number (97/98XXXXXXXX).'}, status=status.HTTP_400_BAD_REQUEST)
        payment_method = data.get('payment_method', 'cod')
        if payment_method not in ('cod', 'esewa', 'bank'):
            return Response({'error': 'Invalid payment method.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Recalculate total server-side — never trust client-supplied total
            computed_total = 0
            validated_items = []
            for item in items:
                pid = item.get('product_id')
                bid = item.get('bundle_id')
                qty = int(item.get('quantity', 1))
                if not pid and not bid:
                    raise ValueError('Each order item must have either a product_id or bundle_id.')
                if pid and bid:
                    raise ValueError('Each order item must have only one of product_id or bundle_id, not both.')
                if pid:
                    product = Product.objects.filter(id=pid, is_active=True).first()
                    if not product:
                        raise ValueError(f'Product {pid} not found.')
                    if product.stock < qty:
                        raise ValueError(f'Insufficient stock for {product.name}')
                    unit_price = product.price
                else:
                    bundle = Bundle.objects.filter(id=bid, is_active=True).first()
                    if not bundle:
                        raise ValueError(f'Bundle {bid} not found.')
                    unit_price = bundle.total_price()
                computed_total += unit_price * qty
                validated_items.append({'pid': pid, 'bid': bid, 'qty': qty, 'price': unit_price})

            order = Order.objects.create(
                user=request.user,
                total_amount=computed_total,
                delivery_address=data.get('address', ''),
                delivery_city=data.get('city', ''),
                delivery_phone=phone,
                payment_method=payment_method,
                latitude=data.get('latitude') or None,
                longitude=data.get('longitude') or None,
            )
            for vi in validated_items:
                OrderItem.objects.create(
                    order=order,
                    product_id=vi['pid'],
                    bundle_id=vi['bid'],
                    quantity=vi['qty'],
                    price=vi['price'],
                )
                if vi['pid']:
                    Product.objects.filter(id=vi['pid']).update(stock=models.F('stock') - vi['qty'])

        return Response({'order_id': order.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_my_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items').order_by('-created_at')
    paginator = PageNumberPagination()
    paginator.page_size = 10
    page = paginator.paginate_queryset(orders, request)
    return paginator.get_paginated_response(OrderSerializer(page, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return Response(OrderSerializer(order).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def api_cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    if order.status != 'pending':
        return Response({'error': 'Only pending orders can be cancelled'}, status=status.HTTP_400_BAD_REQUEST)
    order.status = 'cancelled'
    order.save(update_fields=['status'])
    return Response({'message': 'Order cancelled'})


@api_view(['GET'])
@permission_classes([AllowAny])
def api_reviews(request):
    reviews = Review.objects.select_related('user').order_by('-created_at')
    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(reviews, request)
    return paginator.get_paginated_response(ReviewSerializer(page, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_submit_review(request):
    order = get_object_or_404(Order, id=request.data.get('order_id'), user=request.user)
    if Review.objects.filter(user=request.user, order=order).exists():
        return Response({'error': 'Already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
    rating = request.data.get('rating')
    comment = request.data.get('comment', '').strip()
    if not rating:
        return Response({'error': 'Rating is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not comment or len(comment) < 10:
        return Response({'error': 'Comment must be at least 10 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    review = Review.objects.create(user=request.user, order=order, rating=rating, comment=comment)
    return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
