from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.api import get_current_api_user
from app.utils.prisma import prisma
from prisma.errors import TransactionError

from app.models.response import GetCredit as GetCreditResponse


router = APIRouter()


@router.get(
    "/user",
    name="get_user",
    description="Get a payment and associated credits",
    response_model=GetCreditResponse,
)
async def get_user(api_user=Depends(get_current_api_user)):
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
