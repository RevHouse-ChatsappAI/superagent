import httpx
from fastapi import HTTPException

class ApiChatwootPlatformExtend:
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "api_access_token": self.api_key,
        }

    async def fetch_from_api(self, endpoint: str, method: str = "GET", data: dict = None):
        url = f"{self.base_url}/{endpoint}"
        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(url, headers=self.headers)
            elif method == "POST":
                response = await client.post(url, json=data, headers=self.headers)
            else:
                raise HTTPException(status_code=400, detail="Método HTTP no soportado")

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error en la solicitud a la API de Chatwoot")
            return response.json()

    async def create_user(self, user_details: dict):
        print("entreeeee")
        print(self.base_url)
        return await self.fetch_from_api("users", method="POST", data=user_details)

    async def create_agent_bot(self, agent_bot_details: dict):
        return await self.fetch_from_api("agent_bots", method="POST", data=agent_bot_details)

    async def create_account_user(self, account_id: int, user_details: dict):
        endpoint = f"accounts/{account_id}/account_users"
        return await self.fetch_from_api(endpoint, method="POST", data=user_details)

    async def create_account(self, account_details: dict):
        return await self.fetch_from_api("accounts", method="POST", data=account_details)
