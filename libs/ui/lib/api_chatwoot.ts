interface Props {
  name: string
  email: string
  password: string
  custom_attributes: any
}

export class ApiChatwoot {
  private apiKey?: string
  private apiUrl: string
  private subscriptionId: string

  constructor(apiKey?: string, apiUrl?: string, subscriptionId?: string) {
    this.apiKey = apiKey
    this.apiUrl = apiUrl! ?? process.env.NEXT_PUBLIC_CHATWOOT_API_URL
    this.subscriptionId =
      subscriptionId! ?? process.env.NEXT_PUBLIC_CHATWOOT_SUBSCRIPTION
  }

  async fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.apiUrl}/${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        api_access_token: this.apiKey ?? "",
        "Ocp-Apim-Subscription-Key": this.subscriptionId,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  //GET

  async getProfileChatwoot() {
    return this.fetchFromApi(`/profile`)
  }

  async getAgentsChatwoot(accountId: string) {
    return this.fetchFromApi(`/accounts/${accountId}/agents`)
  }

  async getAllTeams(accountId: string) {
    return this.fetchFromApi(`/accounts/${accountId}/teams`)
  }

  async getAllConversations(accountId: string) {
    return this.fetchFromApi(`/accounts/${accountId}/conversations`)
  }

  //POST

  async createWorkspace(accountId: string, name: string, description?: string) {
    const body = { name, description, allow_auto_assign: true }
    if (description) body.description = description
    return this.fetchFromApi(`/accounts/${accountId}/teams`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async createWorkspaceInChatwoot(agentId: string, llmId: string) {
    return this.fetchFromApi(`/agents/${agentId}/llms`, {
      method: "POST",
      body: JSON.stringify({ llmId }),
    })
  }

  async createUserInChatwoot(
    accountId: string,
    name: string,
    email: string,
    role: string
  ) {
    const body = { name, email, role }
    return this.fetchFromApi(`/accounts/${accountId}/users`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async createUser(
    accountId: string,
    name: string,
    email: string,
    password: string,
    customAttributes: object = {}
  ) {
    const body = { name, email, password, custom_attributes: customAttributes }
    return this.fetchFromApi(`users`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async sendMessageToChatwoot(
    accountId: string,
    conversationId: string,
    content: string,
    messageType: string = "outgoing",
    echoId?: string
  ) {
    const message = {
      content,
      message_type: messageType,
      echo_id: echoId || crypto.randomUUID(),
    }
    return this.fetchFromApi(
      `/accounts/${accountId}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(message),
      }
    )
  }
}

export class ApiChatwootPlatform {
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  async fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHATWOOT_PLATFORM_API_URL}/${endpoint}`,
      {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          api_access_token: `${process.env.NEXT_PUBLIC_KEY_CHATWOOT_PLATFORM}`,
          "Ocp-Apim-Subscription-Key": `${process.env.NEXT_PUBLIC_CHATWOOT_SUBSCRIPTION}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  //GET

  //POST

  async createUser(mock: Props) {
    return this.fetchFromApi(`users`, {
      method: "POST",
      body: JSON.stringify(mock),
    })
  }

  async createAgentBot(agentBotDetails: any) {
    return this.fetchFromApi(`agent_bots`, {
      method: "POST",
      body: JSON.stringify(agentBotDetails),
    })
  }

  async createAccountUser(
    accountId: number,
    userDetails: { user_id: string; role: string }
  ) {
    return this.fetchFromApi(`accounts/${accountId}/account_users`, {
      method: "POST",
      body: JSON.stringify(userDetails),
    })
  }

  async createAccount(accountDetails: { name: string }) {
    return this.fetchFromApi(`accounts`, {
      method: "POST",
      body: JSON.stringify(accountDetails),
    })
  }
}

export class ApiChatwootPlatformExtend {
  private apiUrl: string
  private subscriptionId: string
  private access_token: string

  constructor(apiUrl?: string, subscriptionId?: string, access_token?: string) {
    this.apiUrl = apiUrl!
    this.subscriptionId = subscriptionId!
    this.access_token = access_token!
  }

  async fetchFromApi(endpoint: string, options: RequestInit = {}) {
    console.log(this.apiUrl, this.subscriptionId, this.access_token)
    const response = await fetch(`${this.apiUrl}/${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        api_access_token: this.access_token,
        "Ocp-Apim-Subscription-Key": this.subscriptionId,
        //TODO: Save enviroment Develop/Cloud
        // Localhost: AceQA5vCC5Cn9PVrTYkwyuyA
        //Cloud: eh2iJ7QoiBRxZSRAp59f19c1
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  //GET

  //POST

  async createUser(mock: Props) {
    return this.fetchFromApi(`users`, {
      method: "POST",
      body: JSON.stringify(mock),
    })
  }

  async createAgentBot(agentBotDetails: any) {
    return this.fetchFromApi(`agent_bots`, {
      method: "POST",
      body: JSON.stringify(agentBotDetails),
    })
  }

  async createAccountUser(
    accountId: number,
    userDetails: { user_id: string; role: string }
  ) {
    return this.fetchFromApi(`accounts/${accountId}/account_users`, {
      method: "POST",
      body: JSON.stringify(userDetails),
    })
  }

  async createAccount(accountDetails: { name: string }) {
    return this.fetchFromApi(`accounts`, {
      method: "POST",
      body: JSON.stringify(accountDetails),
    })
  }
}
