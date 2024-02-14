from fastapi import APIRouter, Depends, HTTPException
from app.utils.api import get_current_api_user
from app.utils.prisma import prisma

from app.models.request import ApiPayment as ApiPaymentRequest

from app.models.response import GetPyment as GetPaymentResponse


router = APIRouter()

@router.post(
    "/payment",
    name="create",
    description="Create a new payment",
    response_model=GetPaymentResponse,
)
async def create(body: ApiPaymentRequest, api_user=Depends(get_current_api_user)):
    # Crear un nuevo pago en la base de datos
    try:
        payment_data = {
          'apiUserId': api_user.id,
          'stripeCustomerId': body.user_customer_id,
          'tier': body.nickname
        }
        await prisma.subscription.create(data=payment_data)
        response_data = {
            'success': True,
            'message': "El pago fue exitoso"
        }
        return GetPaymentResponse(**response_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get(
    "/payment",
    name="get_payment",
    description="Get a payment",
    response_model=GetPaymentResponse,
)
async def get_payment(api_user=Depends(get_current_api_user)):
    # Retrieve a payment from the database
    payment = await prisma.subscription.find_first(
        where={'apiUserId': api_user.id}
    )
    if not payment:
        response_data = {
            'success': False,
            'message': "Payment not found",
            'data': None
        }
    else:
        response_data = {
            'success': True,
            'message': "El pago fue recuperado exitosamente",
            'data': payment
        }
    return GetPaymentResponse(**response_data)
