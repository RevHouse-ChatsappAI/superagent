export default function handler(req:any, res:any) {
  // Verifica que el método de la solicitud sea GET
  if (req.method === 'GET') {
    // Envía una respuesta de 'Hello World' al cliente
    res.status(200).json({ message: 'Hello World' });
  } else {
    // Si no es una solicitud GET, informa al cliente que el método no es soportado
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
