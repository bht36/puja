import uuid
import hmac as _hmac
import hashlib
import base64
import json as _json
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import Order


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_esewa_initiate(request):
    order = get_object_or_404(Order, id=request.data.get('order_id'), user=request.user)

    transaction_uuid = str(uuid.uuid4())
    order.payment_ref = transaction_uuid
    order.save(update_fields=['payment_ref'])

    product_code = settings.ESEWA_PRODUCT_CODE
    secret_key = settings.ESEWA_SECRET_KEY
    total_amount = str(order.total_amount)

    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    signature = base64.b64encode(
        _hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).digest()
    ).decode()

    return Response({
        'amount': total_amount,
        'tax_amount': '0',
        'total_amount': total_amount,
        'transaction_uuid': transaction_uuid,
        'product_code': product_code,
        'product_service_charge': '0',
        'product_delivery_charge': '0',
        'success_url': settings.ESEWA_SUCCESS_URL,
        'failure_url': settings.ESEWA_FAILURE_URL,
        'signed_field_names': 'total_amount,transaction_uuid,product_code',
        'signature': signature,
        'gateway_url': settings.ESEWA_GATEWAY_URL,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_esewa_verify(request):
    encoded = request.data.get('data', '')

    try:
        decoded = _json.loads(base64.b64decode(encoded).decode())
        transaction_uuid = decoded.get('transaction_uuid', '')

        order = get_object_or_404(Order, payment_ref=transaction_uuid, user=request.user)

        # Re-verify HMAC signature from eSewa response
        signed_field_names = decoded.get('signed_field_names', '')
        received_signature = decoded.get('signature', '')
        message = ','.join(
            f"{field}={decoded.get(field, '')}"
            for field in signed_field_names.split(',')
            if field != 'signature'
        )
        expected_signature = base64.b64encode(
            _hmac.new(
                settings.ESEWA_SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256,
            ).digest()
        ).decode()

        if not _hmac.compare_digest(received_signature, expected_signature):
            return Response({'error': 'Invalid payment signature'}, status=status.HTTP_400_BAD_REQUEST)

        if decoded.get('status') == 'COMPLETE':
            order.payment_status = 'paid'
            order.payment_ref = decoded.get('transaction_code', '')
            order.save(update_fields=['payment_status', 'payment_ref'])
            return Response({'message': 'Payment verified', 'order_id': order.id})

        return Response({'error': 'Payment not complete'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
