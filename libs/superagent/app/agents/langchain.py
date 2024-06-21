import datetime
from functools import cached_property
import redis
import requests

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.chains import LLMChain
from langchain.memory import (
    ConversationBufferWindowMemory,
    # MotorheadMemory,
    RedisChatMessageHistory,
)
from langchain.prompts import MessagesPlaceholder, PromptTemplate
from langchain.schema import SystemMessage
from langchain_community.tools import BaseTool
from langchain_openai import AzureChatOpenAI, ChatOpenAI

from app.agents.base import AgentBase
from app.tools import get_tools
from app.utils.llm import LLM_MAPPING
from prisma.enums import LLMProvider
from prompts.default import DEFAULT_PROMPT
from prompts.json import JSON_FORMAT_INSTRUCTIONS


class LangchainAgent(AgentBase):
    @property
    def tools(self) -> list[BaseTool]:
        return get_tools(agent_data=self.agent_data, session_id=self.session_id)

    @property
    def prompt(self):
        base_prompt = self.agent_data.prompt or DEFAULT_PROMPT
        content = f"Current date: {datetime.datetime.now().strftime('%Y-%m-%d')}\n"

        if self.output_schema:
            content += JSON_FORMAT_INSTRUCTIONS.format(
                base_prompt=base_prompt, output_schema=self.output_schema
            )
        else:
            content += f"{base_prompt}"

        return SystemMessage(content=content)

    def _get_llm(self):
        llm_data = self.llm_data
        llm_data.params.dict(exclude_unset=True)
        print("LLM")
        print(llm_data)

        if llm_data.llm.provider == LLMProvider.OPENAI:
            return ChatOpenAI(
                model=LLM_MAPPING[self.llm_data.model],
                openai_api_key=llm_data.llm.apiKey,
                streaming=self.enable_streaming,
                callbacks=self.callbacks,
                temperature=llm_data.params.temperature,
                max_tokens=llm_data.params.max_tokens,
            )
        elif llm_data.llm.provider == "AZURE_OPENAI":
            azure_endpoint = llm_data.llm.options.get("azure_endpoint")
            azure_deployment = llm_data.llm.options.get("azure_deployment")
            openai_api_version = llm_data.llm.options.get("openai_api_version")

            return AzureChatOpenAI(
                openai_api_version=openai_api_version,
                azure_deployment=azure_deployment,
                azure_endpoint=azure_endpoint,
                api_key=llm_data.llm.apiKey,
                streaming=self.enable_streaming,
                callbacks=self.callbacks,
                temperature=llm_data.params.temperature,
                max_tokens=llm_data.params.max_tokens,
            )

    @cached_property
    async def memory(self) -> None | ConversationBufferWindowMemory:
        if not self.session_id:
            raise ValueError("Session ID is required to initialize memory")

        print('-------------------------------------------------')
        print(self.session_id)

        # client = AsyncZep(
        #     api_key="z_1dWlkIjoiODlkM2FjOTUtZTE0Yy00YTgyLTk4MjAtZjRmMmIwMjhlOTYxIn0.JIfVu3bny6MN1FUZ_WJDk7NBksZ5eyLZpCB6FwcRTWgAzyFskI0tJNuyZQ8__ZnuuCVvmgFkhcVUwJXKpLvyFg",
        # )

        # try:
        #     memory = ZepChatMessageHistory(
        #         session_id=self.session_id,
        #         zep_client=client,
        #         memory_type="perpetual",
        #     )
        #     return memory
        # except Exception as e:
        #     print(f"Error initializing memory: {e}")
        #     raise


        memory_type = config("MEMORY", "motorhead")
        print(memory_type)

        redis_url = config("REDIS_MEMORY_URL")
        print(redis_url)
        # Probar la conexión a Redis
        try:
            r = redis.Redis.from_url(redis_url)
            r.ping()
            print("Connected to Redis!")
        except Exception as e:
            print(f"Failed to connect to Redis: {e}")
            raise

        try:
            memory = ConversationBufferWindowMemory(
                chat_memory=RedisChatMessageHistory(
                    session_id=self.session_id,
                    url=redis_url,
                    key_prefix="superagent:",
                ),
                memory_key="chat_history",
                return_messages=True,
                output_key="output",
                k=config("REDIS_MEMORY_WINDOW", 10),
            )
            return memory
        except Exception as e:
            print(f"Error initializing memory: {e}")
            raise

    # async def _initialize_motorhead_memory(self, memory: MotorheadMemory):
    #     try:
    #         await memory.init()
    #     except requests.exceptions.RequestException as e:
    #         print(f"Error al inicializar MotorheadMemory: {e}")
    #     except requests.exceptions.JSONDecodeError as e:
    #         print(f"Error de decodificación JSON al inicializar MotorheadMemory: {e}")
    #     except Exception as e:
    #         print(f"Error inesperado al inicializar MotorheadMemory: {e}")

    async def get_agent(self):
        llm = self._get_llm()
        memory = await self.memory
        tools = self.tools
        prompt = self.prompt

        if len(tools) > 0:
            agent = initialize_agent(
                tools,
                llm,
                agent=AgentType.OPENAI_FUNCTIONS,
                agent_kwargs={
                    "system_message": prompt,
                    "extra_prompt_messages": [
                        MessagesPlaceholder(variable_name="chat_history")
                    ],
                },
                memory=memory,
                return_intermediate_steps=True,
                verbose=True,
            )
            return agent
        else:
            user_prompt = prompt.content.replace("{", "{{").replace("}", "}}")
            user_input = "Question: {input}"
            prompt_history = "History: \n {chat_history}"
            prompt_template = f"{user_prompt} \n {user_input} \n {prompt_history}"

            agent = LLMChain(
                llm=llm,
                memory=memory,
                output_key="output",
                verbose=True,
                prompt=PromptTemplate.from_template(prompt_template),
            )

        return agent