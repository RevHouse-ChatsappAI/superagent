import json
import aiohttp
from langchain_community.tools import BaseTool

async def search_product(filters, base_url, token, NIF):
    if isinstance(filters, str):
        filters = json.loads(filters)

    # Construir los parámetros de filtro para la consulta de productos
    filter_params = "&".join([f"filter[{item['filter']}_like]={item['value']}" for item in filters])
    product_url = f"{base_url}/productos?{filter_params}"

    print("URL construida para productos:", product_url)
    print("Token:", token)
    print(NIF)

    try:
        async with aiohttp.ClientSession() as session:
            # Primero, obtener el cliente por CIF/NIF
            cliente_url = f"{base_url}/clientes?filter[cifnif]={NIF}"
            print(cliente_url)
            async with session.get(
                cliente_url,
                headers={
                    "Content-Type": "application/json",
                    "Token": token,
                },
            ) as response_cliente:
                if response_cliente.status != 200:
                    raise Exception(f"HTTP error! status: {response_cliente.status}")
                cliente_data = await response_cliente.json()
                print('--------------------- clientes -------------------')
                print(cliente_data)

                if not cliente_data or not cliente_data[0]:
                    raise Exception("No se encontró el cliente con el CIF/NIF proporcionado.")

                cod_grupo = cliente_data[0]['codgrupo']
                print('Código de grupo:', cod_grupo)

                descuento_url = f"{base_url}/descuentoclientes?filter[codgrupo]={cod_grupo}"
                async with session.get(
                    descuento_url,
                    headers={
                        "Content-Type": "application/json",
                        "Token": token,
                    },
                ) as response_descuento:
                    if response_descuento.status != 200:
                        raise Exception(f"HTTP error! status: {response_descuento.status}")
                    descuento_data = await response_descuento.json()
                    print('-----------------_Descuento---------------')
                    print(descuento_data)

            # Finalmente, obtener los productos
            async with session.get(
                product_url,
                headers={
                    "Content-Type": "application/json",
                    "Token": token,
                },

            ) as response_product:
                if response_product.status != 200:
                    raise Exception(f"HTTP error! status: {response_product.status}")
                product_data = await response_product.json()

                # Retornar la información combinada
                return {
                    "productos": product_data,
                    "descuentos": descuento_data
                }

    except Exception as error:
        print(f"Fetching product or cliente data failed: {error}")
        return {"error": str(error)}

class Function(BaseTool):
    name = "cunstom function"
    description = "useful for doing something"
    return_direct = True

    tool_dispatch = {
        "searchproduct": search_product,
    }

    def _run(self, *args, **kwargs) -> str:
        return f"Notify the user of the function {self.name}"

    async def _arun(self, *args, **kwargs) -> str:
        function_name = self.name
        print('---------------------FUNCTION-----------------------')
        print(function_name)
        print(*args)
        if function_name in self.tool_dispatch:
            data = await self.tool_dispatch[function_name](*args, **kwargs)
            return data
        else:
            return "The function is not available."