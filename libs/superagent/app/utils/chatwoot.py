from os import getenv

import aiohttp
from aiohttp import ClientSession

CHATWOOT_API_URL = getenv("CHATWOOT") + "/accounts/"
SUBSCRIPTION = getenv("SUBSCRIPTION")


async def enviar_respuesta_chatwoot(
    conversation_id, respuesta, token, account_id, es_respuesta_de_bot=True
):
    str_account_id = str(account_id)
    str_conversation_id = str(conversation_id)
    str_response = str(respuesta)

    url = (
        f"{CHATWOOT_API_URL}{str_account_id}/conversations/"
        f"{str_conversation_id}/messages"
    )

    headers = {
        "Content-Type": "application/json",
        "api_access_token": token,
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION,
    }

    data = {"content": str_response, "message_type": "outgoing", "private": False}

    if not es_respuesta_de_bot:
        data["sender"] = {"name": "John", "available_name": "John"}

    async with ClientSession() as session:
        async with session.post(url, headers=headers, json=data) as response:
            if response.status != 200:
                response_body = await response.text()
                error_message = (
                    f"Failed to send message, status: {response.status}, "
                    f"response: {response_body}"
                )
                return {"error": error_message}
            return {"status": response.status, "data": "Message sent successfully"}


async def chatwoot_human_handoff(conversation_id, token, account_id):
    str_account_id = str(account_id)
    str_conversation_id = str(conversation_id)

    url = (
        f"{CHATWOOT_API_URL}{str_account_id}/conversations/"
        f"{str_conversation_id}/toggle_status"
    )

    headers = {
        "Content-Type": "application/json",
        "api_access_token": token,
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION,
    }

    data = {"status": "open"}

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    print(f"Failed to add labels, status: {response.status}")
                    raise aiohttp.web.HTTPException(
                        reason=f"Network response was not ok. Status: {response.status}"
                    )

                response_data = await response.json()
                print("Label added successfully:", response_data)
        except Exception as error:
            print("Error adding label:", error)
            raise
