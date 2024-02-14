import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends, HTTPException
from app.models.request import ApiToken as ApiTokenRequest
from app.models.request import ApiTokenUpdate as ApiTokenUpdateRequest
from app.models.request import ApiUserChatwootUpdate as ApiUserChatwootRequest

from app.models.response import ApiToken as ApiTokenResponse
from app.models.response import GetToken as GetTokenResponse
from app.models.response import GetTokens as GetTokensResponse


from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/token",
    name="create",
    description="Create a new Token",
    response_model=ApiTokenResponse,
)
async def create(body: ApiTokenRequest, api_user=Depends(get_current_api_user)):
    try:
        # Check if a token with the same 'apiUserChatwoot' already exists
        existing_token = await prisma.token.find_first(
            where={"apiUserChatwoot": body.apiUserChatwoot}
        )
        if existing_token:
            # If a token with the same 'apiUserChatwoot' exists, update the existing token
            updated_token = await prisma.token.update(
                where={"apiUserChatwoot": body.apiUserChatwoot},
                data={
                    'agentToken': body.agentToken,
                    'userToken': body.userToken,
                    'isAgentActive': body.isAgentActive
                }
            )
            response_data = {
                'success': True,
                'message': "Token Successfully Updated",
                'data': updated_token
            }
        else:
            # If no token with the same 'apiUserChatwoot' exists, create a new token
            token_data = {
                'agentToken': body.agentToken,
                'userToken': body.userToken,
                'apiUserId': api_user.id,
                'apiUserChatwoot': body.apiUserChatwoot,
                'isAgentActive': body.isAgentActive
            }
            print(token_data)
            new_token = await prisma.token.create(data=token_data)
            print(new_token)
            response_data = {
                'success': True,
                'message': "Token Successfully Created",
                'data': new_token
            }

        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Token Created or Updated", response_data['data'])
    except Exception as e:
        response_data = {
            'success': False,
            'message': "Failed to process the token",
            'error': str(e)
        }
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "token_creation_or_update_failed", {
                'error': str(e),
                'agentToken': body.agentToken,
                'userToken': body.userToken,
                'apiUserChatwoot': body.apiUserChatwoot
            })

    return ApiTokenResponse(**response_data)

@router.get(
    "/token",
    name="get",
    description="Get a Token",
    response_model=GetTokenResponse,
    responses={404: {"description": "Token not found"}},
)
async def get(api_user=Depends(get_current_api_user)):
    try:
        data = await prisma.token.find_first(
            where={"apiUserId": api_user.id},
        )
        if not data:
            return {"success": False, "message": "Token not found"}
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)

@router.get(
    "/tokens",
    name="get_all_tokens",
    description="Get all Tokens for an API User",
    response_model=GetTokensResponse,
    responses={404: {"description": "Token not found"}},
)
async def get_all_tokens(api_user=Depends(get_current_api_user)):
    try:
        tokens = await prisma.token.find_many(
            where={"apiUserId": api_user.id},
        )
        if not tokens:
            return GetTokensResponse(success=False, message="Token not found")
        return GetTokensResponse(success=True, message="Tokens retrieved successfully", data=tokens)
    except Exception as e:
        handle_exception(e)
        raise HTTPException(status_code=500, detail="Failed to retrieve tokens")

@router.patch(
    "/token",
    name="update_token",
    description="Update a Token",
    response_model=ApiTokenResponse,
)
async def update_token(
    body: ApiTokenUpdateRequest,
    api_user=Depends(get_current_api_user)
):
    try:
        allowed_fields = {'agentToken', 'userToken'}
        update_data = {field: value for field, value in update_data.items() if field in allowed_fields}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        updated_token = await prisma.token.update(
            where= {"apiUserId": api_user.id},
            data={
                'userToken': body.userToken,
            },
        )
        return {"success": True, "message": "Token successfully updated", "data": updated_token}
    except HTTPException as http_exc:
        # Pass through HTTP exceptions (like our 400 above)
        raise http_exc
    except Exception as e:
        handle_exception(e)
        return {"success": False, "message": "Failed to update the token"}

@router.patch(
    "/token/active",
    name="update_token_active_status",
    description="Update Token Active Status",
    response_model=ApiTokenResponse,
)
async def update_token_active_status(
    body: ApiTokenUpdateRequest,
    api_user=Depends(get_current_api_user)
):
    try:
        update_data = {'isAgentActive': body.isAgentActive}
        updated_token = await prisma.token.update(
            where={"apiUserId": api_user.id},
            data=update_data,
        )
        return {"success": True, "message": "Token active status successfully updated", "data": updated_token}
    except HTTPException as http_exc:
        # Pass through HTTP exceptions
        raise http_exc
    except Exception as e:
        handle_exception(e)
        return {"success": False, "message": "Failed to update the token active status"}

@router.patch(
    "/token/userchatwoot",
    name="update_token",
    description="Update a Token",
    response_model=ApiTokenResponse,
)
async def update_token(
    body: ApiUserChatwootRequest,
    api_user=Depends(get_current_api_user)
):
    try:
        print(body)
        allowed_fields = {'agentToken', 'userToken'}
        update_data = {field: value for field, value in update_data.items() if field in allowed_fields}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        updated_token = await prisma.token.update(
            where= {"apiUserId": api_user.id},
            data={
                'apiUserChatwoot': body.accountId,
            },
        )
        return {"success": True, "message": "Token successfully updated", "data": updated_token}
    except HTTPException as http_exc:
        # Pass through HTTP exceptions (like our 400 above)
        raise http_exc
    except Exception as e:
        handle_exception(e)
        return {"success": False, "message": "Failed to update the token"}