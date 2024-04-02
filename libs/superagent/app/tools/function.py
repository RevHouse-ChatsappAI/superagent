import aiohttp
from langchain.tools import BaseTool

# from app.utils.facturas_script import ERPClient


async def fetch_productos(title, description):
    url = "https://erp.radiadoresvovchuk.com/api/3/productos"
    print(title, description)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Token": "3leuZBhpOaXw6xQcF8Lk",
                },
            ) as response:
                if response.status != 200:
                    raise Exception(f"HTTP error! status: {response.status}")
                response_product = await response.json()
                return response_product
    except Exception as error:
        print(f"Fetching product data failed: {error}")
        return "No se a encontrado el producto"


async def fetch_stocks(idproducto, referencia, codalmacen):
    print(idproducto, referencia, codalmacen)
    url = "https://erp.radiadoresvovchuk.com/api/3/stocks"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Token": "3leuZBhpOaXw6xQcF8Lk",
                },
            ) as response:
                if response.status != 200:
                    raise Exception(f"HTTP error! status: {response.status}")
                response_product = await response.json()
                return response_product
    except Exception as error:
        print(f"Fetching product data failed: {error}")
        return "No se a encontrado el producto"


async def fetch_todo(id):
    print(id)
    url = "https://erp.radiadoresvovchuk.com/api/3/productos"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Token": "3leuZBhpOaXw6xQcF8Lk",
                },
            ) as response:
                if response.status != 200:
                    raise Exception(f"HTTP error! status: {response.status}")
                response_product = await response.json()
                return response_product
    except Exception as error:
        print(f"Fetching product data failed: {error}")
        return "No se a encontrado el producto"


class Function(BaseTool):
    name = "cunstom function"
    description = "useful for doing something"
    return_direct = True

    tool_dispatch = {
        "fetch_todo": fetch_todo,
        "fetch_radiadores": fetch_productos,
        "fetch_stocks": fetch_stocks,
    }

    def _run(self, *args, **kwargs) -> str:
        return f"Notify the user of the function {self.name}"

    async def _arun(self, *args, **kwargs) -> str:
        function_name = self.name
        if function_name in self.tool_dispatch:
            data = await self.tool_dispatch[function_name](*args, **kwargs)
            return data
        else:
            return "The function is not available."
