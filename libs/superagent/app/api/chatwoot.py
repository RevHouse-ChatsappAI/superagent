import asyncio
import json
import logging
from typing import AsyncIterable, List

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from langchain.agents import AgentExecutor
from langchain.chains import LLMChain

from app.agents.base import AgentBase
from app.models.request import ApiPlaformKey as ApiPlaformKeyRequest
from app.models.response import GetCredit as GetCreditResponse
from app.models.response import GetKeyPlatform as GetKeyPlatformResponse
from app.utils.api import get_current_api_user, handle_exception
from app.utils.callbacks import CostCalcAsyncHandler, CustomAsyncIteratorCallbackHandler
from app.utils.chatwoot import chatwoot_human_handoff, enviar_respuesta_chatwoot
from app.utils.llm import LLM_MAPPING
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
    print(body)
    try:
        existing_key = await prisma.platformkey.find_first(
            where={"apiUserId": api_user.id}
        )
        if existing_key:
            updated_key = await prisma.platformkey.update(
                where={"apiUserId": api_user.id},
                data={
                    "key": body.key,
                    "url": body.url,
                    "subscriptionId": body.subscriptionId,
                },
            )
            response_data = {
                "success": True,
                "message": "Plataforma agregada correctamente",
                "data": updated_key,
            }
        else:
            validate = validate_url(body.url)
            if validate:
                key_data = {
                    "key": body.key,
                    "apiUserId": api_user.id,
                    "url": body.url,
                    "subscriptionId": body.subscriptionId,
                }
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
                    data={
                        "url": str(body.url),
                        "key": str(body.key),
                        "subscriptionId": body.subscriptionId,
                    },
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
    user_id = body.get("sender", {}).get("account", {}).get("id")
    account_id = body.get("account", {}).get("id")
    content = body.get("content")
    conversation_id = body.get("conversation", {}).get("id")
    message_type = body.get("message_type")

    if message_status != "pending":
        return {
            "message": "Message is pending, action not required",
            "agent_id": agent_id,
            "ignored": True,
        }

    session_id = f"agt_{agent_id}_"
    logger = logging.getLogger(__name__)

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
        userTokenChatwoot = token["data"].userToken

        agent_config = await prisma.agent.find_unique_or_raise(
            where={"id": agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {
                    "include": {"datasource": {"include": {"vectorDb": True}}}
                },
                "tools": {"include": {"tool": True}},
            },
        )

        model = LLM_MAPPING.get(agent_config.llmModel)

        metadata = agent_config.metadata or {}
        if not model and metadata.get("model"):
            model = metadata.get("model")

        costCallback = CostCalcAsyncHandler(model=model)

        monitoring_callbacks = [costCallback]

        async def send_message(
            agent: LLMChain | AgentExecutor,
            input: dict[str, str],
            streaming_callback: CustomAsyncIteratorCallbackHandler,
            callbacks: List[CustomAsyncIteratorCallbackHandler] = [],
        ) -> AsyncIterable[str]:
            try:
                task = asyncio.ensure_future(
                    agent.ainvoke(
                        input,
                        config={
                            "callbacks": [streaming_callback, *callbacks],
                            "tags": [agent_id],
                        },
                    )
                )

                # we are not streaming token by token if output schema is set
                schema_tokens = ""
                async for token in streaming_callback.aiter():
                    if not output_schema:
                        yield ("event: message\n" f"data: {token}\n\n")
                    else:
                        schema_tokens += token

                # stream line by line to prevent streaming large data in one go
                for line in schema_tokens.split("\n"):
                    yield ("event: message\n" f"data: {line}\n\n")

                await task

                result = task.result()

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
                    yield result.get("output", "")
            except Exception as error:
                print(error)
            finally:
                streaming_callback.done.set()

        logger.info("Invoking agent...")
        enable_streaming = body.get("enableStreaming", False)
        output_schema = agent_config.outputSchema

        agent_base = AgentBase(
            agent_id=agent_id,
            session_id=session_id,
            enable_streaming=False,
            output_schema={},
            callbacks=monitoring_callbacks,
            llm_params=None,
            agent_config=agent_config,
        )
        agent = await agent_base.get_agent()

        agent_input = agent_base.get_input(
            content,
            agent_type=agent_config.type,
        )

        if enable_streaming:
            logger.info("Streaming enabled. Preparing streaming response...")

            generator = send_message(
                agent,
                input=agent_input,
            )

            return StreamingResponse(generator, media_type="text/event-stream")

        logger.info("Streaming not enabled. Invoking agent synchronously...")
        output = await agent.ainvoke(
            input=agent_input,
            config={
                "tags": [agent_id],
            },
        )

        intermediate_steps = output.get("intermediate_steps", [])
        for step in intermediate_steps:
            if isinstance(step[1], str) and step[1].strip():
                try:
                    tool_response = json.loads(step[1])
                except json.JSONDecodeError as json_error:
                    logging.error(f"JSON decode error: {json_error}")
                    continue  # Skip this iteration if JSON is invalid
            elif isinstance(step[1], list) and step[1]:
                # If step[1] is a list, attempt to parse the first item as JSON
                try:
                    tool_response = json.loads(step[1][0])
                except json.JSONDecodeError as json_error:
                    logging.error(f"JSON decode error: {json_error}")
                    continue  # Skip this iteration if JSON is invalid
            else:
                # If step[1] is empty or not a list/string, log an error and skip this iteration
                logging.error("step[1] is empty or not in the expected format")
                continue

            action = tool_response.get("action")
            if action == "hand-off":
                # Do something with the hand-off action
                await chatwoot_human_handoff(
                    conversation_id, userTokenChatwoot, account_id
                )
        message = output.get("output", "")

        try:
            await enviar_respuesta_chatwoot(
                conversation_id,
                message,
                valor_token,
                account_id,
                es_respuesta_de_bot=True,
            )
        except Exception as e:
            logging.error(f"Error sending response to Chatwoot: {e}")
            raise HTTPException(
                status_code=500, detail="Error sending the response to Chatwoot"
            )
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return {
            "message": "An error occurred while processing the data",
            "agent_id": agent_id,
        }
