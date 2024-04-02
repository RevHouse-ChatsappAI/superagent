from fastapi import APIRouter, Depends

from app.models.request import ApiPlaformKey as ApiPlaformKeyRequest
from app.models.response import GetCredit as GetCreditResponse
from app.models.response import GetKeyPlatform as GetKeyPlatformResponse
from app.utils.api import get_current_api_user
from app.utils.prisma import prisma
from app.utils.validateURL import validate_url
from prisma.errors import TransactionError

router = APIRouter()


@router.get(
    "/user",
    name="get_user",
    description="Get a payment and associated credits",
    response_model=GetCreditResponse,
)
async def get_user(api_user=Depends(get_current_api_user)):
    credits = await prisma.credit.find_first(where={"apiUserId": api_user.id})
    if not credits:
        response_data = {"success": False, "message": "Credits not found", "data": None}
    else:
        response_data = {
            "success": True,
            "message": "Créditos asociados fueron recuperados exitosamente",
            "data": credits,
        }
    return GetCreditResponse(**response_data)


@router.get(
    "/platform_key",
    name="get_platformkey",
    description="Get a payment and associated credits",
    response_model=GetKeyPlatformResponse,
)
async def get_platformkey(api_user=Depends(get_current_api_user)):
    platform_key = await prisma.platformkey.find_first(where={"apiUserId": api_user.id})
    if not platform_key:
        response_data = {
            "success": False,
            "message": "No tienes key disponible",
            "data": None,
        }
    else:
        response_data = {
            "success": True,
            "message": "Se recuperaron las Keys exitosamente",
            "data": platform_key,
        }
    return GetKeyPlatformResponse(**response_data)


@router.post(
    "/platform_key",
    name="send_platformkey",
    description="Get a payment and associated credits",
    response_model=GetKeyPlatformResponse,
)
async def send_platformkey(
    body: ApiPlaformKeyRequest, api_user=Depends(get_current_api_user)
):
    try:
        existing_key = await prisma.platformkey.find_first(
            where={"apiUserId": api_user.id}
        )
        if existing_key:
            updated_key = await prisma.platformkey.update(
                where={"apiUserId": api_user.id}, data={"key": body.key}
            )
            response_data = {
                "success": True,
                "message": "Plataforma agregada correctamente",
                "data": updated_key,
            }
        else:
            validate = validate_url(body.url)
            if validate:
                key_data = {"key": body.key, "apiUserId": api_user.id, "url": body.url}
                new_key = await prisma.platformkey.create(data=key_data)
                response_data = {
                    "success": True,
                    "message": "Platform Key Successfully Created",
                    "data": new_key,
                }
            else:
                return GetKeyPlatformResponse(
                    success=False, message="La URL no es correcta"
                )
    except Exception as e:
        response_data = {
            "success": False,
            "message": "Failed to process the platform key",
            "error": str(e),
        }
    return GetKeyPlatformResponse(**response_data)


@router.put(
    "/platform_key",
    name="update_platformkey",
    description="Update a Platform Key",
    response_model=GetKeyPlatformResponse,
)
async def update_platformkey(
    body: ApiPlaformKeyRequest, api_user=Depends(get_current_api_user)
):
    try:
        existing_key = await prisma.platformkey.find_first(
            where={"apiUserId": api_user.id}
        )
        if existing_key:
            validate = validate_url(body.url)
            if validate:
                updated_key = await prisma.platformkey.update(
                    where={"apiUserId": api_user.id},
                    data={"url": str(body.url), "key": str(body.key)},
                )
                return GetKeyPlatformResponse(
                    success=True,
                    message="La Plataforma se agregó correctamente.",
                    data=updated_key,
                )
            else:
                return GetKeyPlatformResponse(
                    success=False, message="La URL no es correcta"
                )
        else:
            return GetKeyPlatformResponse(
                success=False,
                message="La clave de plataforma no existe para el usuario",
            )
    except Exception as e:
        return GetKeyPlatformResponse(
            success=False,
            message="Error al procesar la actualización de la clave de plataforma",
            error=str(e),
        )
