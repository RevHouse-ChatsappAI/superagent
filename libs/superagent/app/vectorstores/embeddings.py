from decouple import config
from langchain_openai import OpenAIEmbeddings


# from app.utils.helpers import get_first_non_null


def get_embeddings_model_provider():
    # print("---------------------------------------------")
    # print(embeddings_model_provider)
    # print("soy yooooooo")
    # print("---------------------------------------------")

    # if embeddings_model_provider == EmbeddingsModelProvider.AZURE_OPENAI:
    #     return AzureOpenAIEmbeddings(
    #         azure_deployment=config("AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT"),
    #         api_version=get_first_non_null(
    #             config("AZURE_OPENAI_EMBEDDINGS_API_VERSION"),
    #             config("AZURE_OPENAI_API_VERSION"),
    #         ),
    #         api_key=get_first_non_null(
    #             config("AZURE_OPENAI_EMBEDDINGS_API_KEY"),
    #             config("AZURE_OPENAI_API_KEY"),
    #         ),
    #         azure_endpoint=get_first_non_null(
    #             config("AZURE_OPENAI_EMBEDDINGS_ENDPOINT"),
    #             config("AZURE_OPENAI_ENDPOINT"),
    #         ),
    #     )
    # else:
    return OpenAIEmbeddings(
        model="text-embedding-3-small", openai_api_key=config("OPENAI_API_KEY")
    )
