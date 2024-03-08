from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.api import get_current_api_user
from app.utils.prisma import prisma
from prisma.errors import TransactionError

from app.models.request import ApiPayment as ApiPaymentRequest
from app.models.response import GetPyment as GetPaymentResponse
from app.models.response import GetCredit as GetCreditResponse
from app.models.response import GetCount as GetCountResponse
from app.models.response import FreeResponse as PostFreeResponse


router = APIRouter()

@router.post(
    "/payment",
    name="create",
    description="Create a new payment",
    response_model=GetPaymentResponse,
)
async def create(body: ApiPaymentRequest, api_user=Depends(get_current_api_user)):
    valid_tiers = ["FREE","BASE", "STANDARD", "PREMIUM"]
    tier_name = body.nickname.upper()
    if tier_name not in valid_tiers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tier name must be one of {valid_tiers}."
        )

    tier_record = await prisma.tiercredit.find_unique(
        where={'tier': tier_name}
    )
    if not tier_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid tier name provided."
        )

    credits = tier_record.credits

    payment_data = {
        'apiUserId': api_user.id,
        'stripeCustomerId': body.user_customer_id,
        'tier': tier_name
    }

    credit_data = {
        'apiUserId': api_user.id,
        'credits': credits,
        'subscriptionId': None
    }

    try:
        subscription = await prisma.subscription.create(data=payment_data)
        credit_data['subscriptionId'] = subscription.id
        await prisma.credit.create(data=credit_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

    response_data = {
        'success': True,
        'message': "El pago y los créditos se han guardado correctamente",
    }
    return GetPaymentResponse(**response_data)

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

@router.get(
    "/credit",
    name="get_credit",
    description="Get a payment and associated credits",
    response_model=GetCreditResponse,
)
async def get_credit(api_user=Depends(get_current_api_user)):
    credits = await prisma.credit.find_first(
        where={'apiUserId': api_user.id}
    )
    if not credits:
        response_data = {
            'success': False,
            'message': "Credits not found",
            'data': None
        }
    else:
        response_data = {
            'success': True,
            'message': "Créditos asociados fueron recuperados exitosamente",
            'data': credits
        }
    return GetCreditResponse(**response_data)

@router.get(
    "/count",
    name="get_count",
    description="Get a payment and associated credits",
    response_model=GetCountResponse,
)
async def get_count(api_user=Depends(get_current_api_user)):
    count = await prisma.count.find_first(
        where={'apiUserId': api_user.id}
    )
    if not count:
        response_data = {
            'success': False,
            'message': "Credits not found",
            'data': None
        }
    else:
        response_data = {
            'success': True,
            'message': "Contador asociados fueron recuperados exitosamente",
            'data': count
        }
    return GetCountResponse(**response_data)

@router.post(
    "/free",
    name="post_free_account",
    description="Post a free account if no subscription exists",
    response_model=PostFreeResponse
)
async def post_free_account(body: ApiPaymentRequest, api_user=Depends(get_current_api_user)):
    subscription = await prisma.subscription.find_first(
        where={'apiUserId': api_user.id}
    )
    if subscription:
        response_data = {
            'success': False,
            'message': "Ya existe una subscripción",
            'data': None
        }
    else:
        tier_name = body.nickname.upper()
        if tier_name != "FREE":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tier name must be FREE for this endpoint."
            )

        tier_record = await prisma.tiercredit.find_unique(
            where={'tier': tier_name}
        )
        if not tier_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tier name provided."
            )

        credits = tier_record.credits

        payment_data = {
            'apiUserId': api_user.id,
            'stripeCustomerId': body.user_customer_id,
            'tier': tier_name
        }

        credit_data = {
            'apiUserId': api_user.id,
            'credits': credits,
            'subscriptionId': None
        }

        try:
            subscription = await prisma.subscription.create(data=payment_data)
            credit_data['subscriptionId'] = subscription.id
            await prisma.credit.create(data=credit_data)
            response_data = {
                'success': True,
                'message': "La cuenta gratuita ha sido creada exitosamente",
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

    return PostFreeResponse(**response_data)
