export const integrationsConfig = [
  {
    name: "Chatwoot Extend",
    description: "Chatwoot extend is the platform crm chatwoot",
    id: "chatwoot",
    image: "logo.png",
    metadata: [
      {
        key: "url",
        type: "input",
        label: "API URL",
        required: true,
        placeholder: "Ingrese la URL",
      },
      {
        key: "key",
        type: "input",
        label: "Clave de la plataforma",
        required: true,
        placeholder: "Ingrese KEY de la plataforma",
      },
      {
        key: "subscriptionId",
        type: "input",
        label: "Clave de subscripción",
        required: false,
        placeholder: "Ingrese su clave",
      },
    ],
  },
]
