import aiohttp

class ERPClient:
    BASE_URL = "https://jsonplaceholder.typicode.com/todos/{}"

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.session.close()

    async def fetch_todo(self, id):
        url = self.BASE_URL.format(id)
        try:
            async with self.session.get(url, headers={
                "Content-Type": "application/json",
            }) as response:
                if response.status != 200:
                    raise Exception(f"HTTP error! status: {response.status}")
                todo_data = await response.json()
                return todo_data
        except Exception as error:
            print(f'Fetching todo data failed: {error}')
            return None
