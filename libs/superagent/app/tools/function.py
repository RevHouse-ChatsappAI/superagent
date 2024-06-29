import json
import aiohttp
from langchain_community.tools import BaseTool
from fastapi import HTTPException

from typing import List, Optional
from pydantic import BaseModel

class Descuento(BaseModel):
    id: int
    porcentaje: float
    descripcion: str

class DocumentoFiscal(BaseModel):
    id: int
    fecha_inicio: str
    fecha_firma: str
    firmado: bool

class Producto(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    imagenes: Optional[List[str]]
    stock: Optional[int]
    subfamilia: Optional[str]

async def obtener_detalle_producto(id_producto: int, base_url: str, token: str) -> Producto:
    try:
        producto_url = f"{base_url}/productos/{id_producto}"

        async with aiohttp.ClientSession() as session:
            async with session.get(producto_url, headers={"Content-Type": "application/json", "Token": token}) as response_producto:
                response_producto.raise_for_status()
                producto_data = await response_producto.json()
                return Producto(
                    id=producto_data['idproducto'],
                    nombre=producto_data['descripcion'],
                    descripcion=producto_data.get('observaciones'),
                    imagenes=None,
                    stock=None,
                    subfamilia=None,
                )

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle del producto: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle del producto: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle del producto: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle del producto: {e}")

async def obtener_stock_producto(id_producto: int, base_url: str, token: str) -> int:
    try:
        stock_url = f"{base_url}/stocks?filter[idproducto]={id_producto}"
        async with aiohttp.ClientSession() as session:
            async with session.get(stock_url, headers={"Content-Type": "application/json", "Token": token}) as response_stock:
                response_stock.raise_for_status()
                stock_data = await response_stock.json()
                if stock_data and len(stock_data) > 0:
                    return stock_data[0]['cantidad']
                else:
                    return 0

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener stock: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener stock: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener stock: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener stock: {e}")

class Cliente(BaseModel):
    # id: int
    codgrupo: str
    nombre: str
    cifnif: str
    email: Optional[str]
    telefono1: Optional[str]
    telefono2: Optional[str]

async def obtener_detalle_cliente(NIF: str, base_url: str, token: str) -> Cliente:
    try:
        cliente_url = f"{base_url}/clientes?filter[cifnif]={NIF}"
        async with aiohttp.ClientSession() as session:
            async with session.get(cliente_url, headers={"Content-Type": "application/json", "Token": token}) as response_cliente:
                response_cliente.raise_for_status()
                cliente_data = await response_cliente.json()

                if cliente_data and len(cliente_data) > 0:
                    print(cliente_data)
                    cliente = cliente_data[0]
                    return Cliente(
                        codgrupo=cliente['codgrupo'],
                        nombre=cliente['razonsocial'],
                        cifnif=cliente['cifnif'],
                        email=cliente.get('email'),
                        telefono1=cliente.get('telefono1'),
                        telefono2=cliente.get('telefono2'),
                    )
                else:
                    raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle del cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle del cliente: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle del cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle del cliente: {e}")

class DescuentoCliente(BaseModel):
    id: int
    porcentaje: float
    fecha_inicio: str
    observaciones: Optional[str]

async def obtener_descuentos_cliente(cod_cliente: str, base_url: str, token: str) -> List[DescuentoCliente]:
    try:
        descuentos_url = f"{base_url}/descuentoclientes?filter[codcliente]={cod_cliente}"
        async with aiohttp.ClientSession() as session:
            async with session.get(descuentos_url, headers={"Content-Type": "application/json", "Token": token}) as response_descuentos:
                response_descuentos.raise_for_status()
                descuentos_data = await response_descuentos.json()
                descuentos = []
                for descuento in descuentos_data:
                    descuentos.append(DescuentoCliente(
                        id=descuento['id'],
                        porcentaje=descuento['porcentaje'],
                        fecha_inicio=descuento['fecha0'],
                        observaciones=descuento.get('observaciones'),
                    ))
                return descuentos

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener descuentos del cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener descuentos del cliente: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener descuentos del cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener descuentos del cliente: {e}")

class Documento(BaseModel):
    id: int
    fechaini: str
    fechafirma: str
    firmado: bool
    idfactura: Optional[int]

async def obtener_documentos_cliente(cod_cliente: str, base_url: str, token: str) -> List[Documento]:
    try:
        documentos_url = f"{base_url}/dfdocumentos?filter[codcliente]={cod_cliente}"
        async with aiohttp.ClientSession() as session:
            async with session.get(documentos_url, headers={"Content-Type": "application/json", "Token": token}) as response_documentos:
                response_documentos.raise_for_status()
                documentos_data = await response_documentos.json()
                documentos = []
                for documento in documentos_data:
                    documentos.append(Documento(
                        id=documento['iddocumento'],
                        fechaini=documento['fechaini'],
                        fechafirma=documento['fechafirma'],
                        firmado=documento['firmado'],
                        idfactura=documento.get('idfactura'),
                    ))
                return documentos

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener documentos del cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener documentos del cliente: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener documentos del cliente: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener documentos del cliente: {e}")

class Subfamilia(BaseModel):
    id: int
    descripcion: str

async def obtener_subfamilias(base_url: str, token: str) -> List[Subfamilia]:
    try:
        subfamilias_url = f"{base_url}/subfamilias"
        async with aiohttp.ClientSession() as session:
            async with session.get(subfamilias_url, headers={"Content-Type": "application/json", "Token": token}) as response_subfamilias:
                response_subfamilias.raise_for_status()
                subfamilias_data = await response_subfamilias.json()
                subfamilias = []
                for subfamilia in subfamilias_data:
                    subfamilias.append(Subfamilia(
                        id=subfamilia['id'],
                        descripcion=subfamilia['descripcion'],
                    ))
                return subfamilias

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener subfamilias: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener subfamilias: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener subfamilias: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener subfamilias: {e}")

class ImagenProducto(BaseModel):
    id: int
    idfile: int

async def obtener_imagenes_producto(id_producto: int, base_url: str, token: str) -> List[str]:
    try:
        imagenes_url = f"{base_url}/productoimagenes?filter[idproducto]={id_producto}"
        async with aiohttp.ClientSession() as session:
            async with session.get(imagenes_url, headers={"Content-Type": "application/json", "Token": token}) as response_imagenes:
                response_imagenes.raise_for_status()
                imagenes_data = await response_imagenes.json()
                imagenes = []
                for imagen in imagenes_data:
                    imagenes.append(imagen['idfile'])
                return imagenes

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener imágenes del producto: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener imágenes del producto: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener imágenes del producto: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener imágenes del producto: {e}")

async def obtener_detalle_subfamilia(id_subfamilia: int, base_url: str, token: str) -> Optional[str]:
    try:
        subfamilia_url = f"{base_url}/subfamilias/{id_subfamilia}"
        async with aiohttp.ClientSession() as session:
            async with session.get(subfamilia_url, headers={"Content-Type": "application/json", "Token": token}) as response_subfamilia:
                response_subfamilia.raise_for_status()
                subfamilia_data = await response_subfamilia.json()
                return subfamilia_data.get('descripcion')

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle de subfamilia: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle de subfamilia: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle de subfamilia: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle de subfamilia: {e}")

async def obtener_detalle_imagen(id_imagen: int, base_url: str, token: str) -> Optional[str]:
    try:
        imagen_url = f"{base_url}/attachedfiles/{id_imagen}"
        async with aiohttp.ClientSession() as session:
            async with session.get(imagen_url, headers={"Content-Type": "application/json", "Token": token}) as response_imagen:
                response_imagen.raise_for_status()
                imagen_data = await response_imagen.json()
                return imagen_data.get('url')

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle de imagen: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle de imagen: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle de imagen: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle de imagen: {e}")

async def obtener_detalle_familia(id_familia: int, base_url: str, token: str) -> Optional[str]:
    try:
        familia_url = f"{base_url}/familias/{id_familia}"
        async with aiohttp.ClientSession() as session:
            async with session.get(familia_url, headers={"Content-Type": "application/json", "Token": token}) as response_familia:
                response_familia.raise_for_status()
                familia_data = await response_familia.json()
                return familia_data.get('descripcion')

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle de familia: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle de familia: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle de familia: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle de familia: {e}")

async def obtener_detalle_descuento(id_descuento: int, base_url: str, token: str) -> Descuento:
    try:
        descuento_url = f"{base_url}/descuentosclientes/{id_descuento}"

        async with aiohttp.ClientSession() as session:
            async with session.get(descuento_url, headers={"Content-Type": "application/json", "Token": token}) as response_descuento:
                response_descuento.raise_for_status()
                descuento_data = await response_descuento.json()
                return Descuento(
                    id=descuento_data['id'],
                    porcentaje=descuento_data['porcentaje'],
                    descripcion=descuento_data['observaciones']
                )

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle de descuento: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle de descuento: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle de descuento: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle de descuento: {e}")

async def obtener_detalle_documento(id_documento: int, base_url: str, token: str) -> DocumentoFiscal:
    try:
        documento_url = f"{base_url}/dfdocumentos/{id_documento}"

        async with aiohttp.ClientSession() as session:
            async with session.get(documento_url, headers={"Content-Type": "application/json", "Token": token}) as response_documento:
                response_documento.raise_for_status()
                documento_data = await response_documento.json()
                return DocumentoFiscal(
                    id=documento_data['iddocumento'],
                    fecha_inicio=documento_data['fechaini'],
                    fecha_firma=documento_data['fechafirma'],
                    firmado=documento_data['firmado']
                )

    except aiohttp.ClientError as e:
        print(f"Error de cliente HTTP al obtener detalle de documento fiscal: {e}")
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener detalle de documento fiscal: {e}")
    except Exception as e:
        print(f"Error inesperado al obtener detalle de documento fiscal: {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener detalle de documento fiscal: {e}")


async def search_product(filters, base_url, token):
    if isinstance(filters, str):
        filters = json.loads(filters)

    filter_params = "&".join([f"filter[{item['filter']}_like]={item['value']}" for item in filters])
    product_url = f"{base_url}/productos?{filter_params}"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                product_url,
                headers={
                    "Content-Type": "application/json",
                    "Token": token,
                },
            ) as response_product:
                if response_product.status != 200:
                    raise HTTPException(status_code=response_product.status, detail=f"Error al obtener productos, status: {response_product.status}")
                product_data = await response_product.json()

                return {
                    "productos": product_data,
                }

    except aiohttp.ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error de cliente HTTP al obtener productos: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado al obtener productos: {e}")

class Function(BaseTool):
    name = "custom function"
    description = "useful for doing something"
    return_direct = True

    tool_dispatch = {
        "getproduct": search_product,
        "getstock": obtener_stock_producto,
        "getproductdetail": obtener_detalle_producto,
        "getcustomerdetail": obtener_detalle_cliente,
        "getdiscountdetail": obtener_detalle_descuento,
        "getdocumentdetail": obtener_detalle_documento,
        "getsubfamilydetail": obtener_detalle_subfamilia,
        "getproductimages": obtener_imagenes_producto,
        "getimagedetail": obtener_detalle_imagen,
        "getfamilydetail": obtener_detalle_familia,
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