import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from langchain.agents import AgentExecutor
from langchain.chains import LLMChain

from app.agents.base import AgentBase
from app.models.request import ApiPlaformKey as ApiPlaformKeyRequest
from app.models.response import GetCredit as GetCreditResponse
from app.models.response import GetKeyPlatform as GetKeyPlatformResponse
from app.utils.api import get_current_api_user, handle_exception
from app.utils.chatwoot import chatwoot_human_handoff, enviar_respuesta_chatwoot
from app.utils.prisma import prisma
from app.utils.token import obtener_token_supabase
from app.utils.validateURL import validate_url

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


# Agent Bot with Chatwoot
@router.post("/webhook/{agent_id}/chatwoot")
async def chatwoot_webhook(agent_id: str, request: Request):
    body = await request.json()

    message_status = body.get("conversation", {}).get("status")

    if message_status != "pending":
        return {
            "message": "Message is pending, action not required",
            "agent_id": agent_id,
            "ignored": True,
        }

    user_id = body.get("sender", {}).get("account", {}).get("id")
    account_id = body.get("account", {}).get("id")
    content = body.get("content")
    conversation_id = body.get("conversation", {}).get("id")
    message_type = body.get("message_type")

    try:
        token = await prisma.token.find_unique(where={"apiUserChatwoot": str(user_id)})
        if not token:
            raise HTTPException(
                status_code=404,
                detail="No se encontró la entrada de créditos para el usuario.",
            )
        credit_entry = await prisma.credit.find_first(
            where={"apiUserId": token.apiUserId}
        )
        if not credit_entry:
            raise HTTPException(
                status_code=404,
                detail="No se encontró la entrada de créditos para el usuario.",
            )
        available_credits = credit_entry.credits
        count_entry = await prisma.count.find_unique(
            where={"apiUserId": token.apiUserId}
        )
        if count_entry:
            new_count = count_entry.queryCount + 1
            if new_count > available_credits:
                raise HTTPException(
                    status_code=429,
                    detail="Se ha alcanzado el límite de créditos disponibles.",
                )
            await prisma.count.update(
                where={"apiUserId": token.apiUserId}, data={"queryCount": new_count}
            )
        else:
            if available_credits <= 0:
                raise HTTPException(
                    status_code=429, detail="No hay créditos disponibles."
                )
            await prisma.count.create(
                data={"apiUserId": token.apiUserId, "queryCount": 1}
            )
    except Exception as e:
        handle_exception(e)

    if message_type != "incoming":
        logging.info("Ignoring non-client message")
        return {
            "message": "Non-client message ignored",
            "agent_id": agent_id,
            "ignored": True,
        }
    try:
        token = await obtener_token_supabase(user_id=user_id)
        if not token:
            raise HTTPException(status_code=404, detail="Token not found")

        valor_token = token["data"].agentToken
        ia_assistant_active = token["data"].isAgentActive
        userTokenChatwoot = token["data"].userToken

        agent = await prisma.agent.find_unique(where={"id": agent_id})
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        agent_base = await AgentBase(agent_id=agent_id).get_agent()
        if not ia_assistant_active:
            return {
                "message": "Request to speak with a human agent received",
                "agent_id": agent_id,
            }

        async def send_message(
            agent: LLMChain | AgentExecutor,
            content: str,
        ) -> str:
            try:
                result = await agent.acall(
                    inputs={"input": content},
                    tags=[agent_id],
                    callbacks=None,
                )

                if "intermediate_steps" in result:
                    for step in result["intermediate_steps"]:
                        (agent_action_message_log, tool_response) = step
                        tool_response_dict = json.loads(tool_response)
                        action = tool_response_dict.get("action")

                        function = str(action)
                        if function == "hand-off":
                            await chatwoot_human_handoff(
                                conversation_id, userTokenChatwoot, account_id
                            )
                    return result.get("output", "")
            except Exception as e:
                logging.error(f"Error in send_message: {e}")
                raise

        logging.info("Collecting response from the agent...")
        response_message = await send_message(agent_base, content=content)

        try:
            await enviar_respuesta_chatwoot(
                conversation_id,
                response_message,
                valor_token,
                account_id,
                es_respuesta_de_bot=True,
            )
        except Exception as e:
            logging.error(f"Error sending response to Chatwoot: {e}")
            raise HTTPException(
                status_code=500, detail="Error sending the response to Chatwoot"
            )

        return {"success": True, "message": "Response sent to Chatwoot"}
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return {
            "message": "An error occurred while processing the data",
            "agent_id": agent_id,
        }
