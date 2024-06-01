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
    subMetaData: [
      {
        key: "name",
        type: "input",
        label: "Nombre del usuario",
        required: true,
        placeholder: "Ej: Bot Liftel",
      },
      {
        key: "email",
        type: "input",
        label: "Correo electronico",
        required: true,
        placeholder: "Ej: bot@chatsappai.com",
      },
      {
        key: "password",
        type: "password",
        label: "Contraseña",
        required: true,
        placeholder: "Ingrese su contraseña",
      },
      {
        type: "separator",
      },
      {
        key: "account_name",
        type: "input",
        label: "Nombre de cuenta",
        required: true,
        placeholder: "Ej: Empresa Chatsapp",
        helpText: "En esta sección se configuran la cuenta dentro de chatwoot",
      },
      {
        type: "separator",
      },
      {
        key: "agent_name",
        type: "input",
        label: "Nombre del agente",
        required: true,
        agent: true,
        placeholder: "Ej: agente comercio",
      },
      {
        key: "agent_description",
        type: "input",
        label: "Desscripción del agente",
        required: true,
        placeholder: "Ingrese una breve descripción",
      },
    ],
  },
]
