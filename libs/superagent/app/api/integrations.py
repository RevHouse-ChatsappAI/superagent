from fastapi import APIRouter, Depends, HTTPException, status

from app.models.request import ApiPlaformKey as ApiPlaformKeyRequest
from app.models.response import GetCredit as GetCreditResponse
from app.models.response import GetKeyPlatform as GetKeyPlatformResponse
from app.service.api_chatwoot_platform_extend import ApiChatwootPlatformExtend
from app.utils.api import get_current_api_user
from app.utils.prisma import prisma
from prisma.errors import TransactionError

router = APIRouter()


from typing import Any


async def get_api_chatwoot_platform_extend(
    api_user=Depends(get_current_api_user),
) -> ApiChatwootPlatformExtend:
    platform_key = await prisma.platformkey.find_first(where={"apiUserId": api_user.id})

    if not platform_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No tienes key disponible"
        )
    else:
        return ApiChatwootPlatformExtend(
            api_key=platform_key.key, base_url=platform_key.url
        )


@router.post("/integration/users", response_model=Any)
async def create_user(
    user_details: dict,
    api_chatwoot: ApiChatwootPlatformExtend = Depends(get_api_chatwoot_platform_extend),
):
    try:
        user = await api_chatwoot.create_user(user_details)
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/integration/agent_bots", response_model=Any)
async def create_agent_bot(
    agent_bot_details: dict,
    api_chatwoot: ApiChatwootPlatformExtend = Depends(get_api_chatwoot_platform_extend),
):
    try:
        agent_bot = await api_chatwoot.createAgentBot(agent_bot_details)
        return agent_bot
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/integration/accounts/{account_id}/account_users", response_model=Any)
async def create_account_user(
    account_id: int,
    user_details: dict,
    api_chatwoot: ApiChatwootPlatformExtend = Depends(get_api_chatwoot_platform_extend),
):
    try:
        account_user = await api_chatwoot.createAccountUser(account_id, user_details)
        return account_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/integration/accounts", response_model=Any)
async def create_account(
    account_details: dict,
    api_chatwoot: ApiChatwootPlatformExtend = Depends(get_api_chatwoot_platform_extend),
):
    try:
        account = await api_chatwoot.createAccount(account_details)
        return account
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
