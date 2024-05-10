export const integrationsConfig = [
  {
    name: "Chatwoot Extend",
    description: "Chatwoot extend is the platform crm chatwoot",
    id: "chatwoot",
    image: "logo.png",
    metadata: [
      {
        key: "CHATWOOT_EXTEND_URL",
        type: "input",
        label: "API URL",
        placeholder: "Ingrese la URL",
      },
      {
        key: "CHATWOOT_EXTEND_PLATFORM_KEY",
        type: "input",
        label: "Clave de la plataforma",
        placeholder: "Ingrese KEY de la plataforma",
      },
      {
        key: "CHATWOOT_EXTEND_SECURITY",
        type: "input",
        label: "Clave de subscripción (Opcional)",
        placeholder: "Ingrese su clave",
      },
    ],
  },
]
