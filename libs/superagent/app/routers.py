from fastapi import APIRouter

from app.api import (
    agents,
    api_keys,
    api_user,
    # CHATSAPP
    chatwoot,
    datasources,
    integrations,
    llms,
    subscription,
    token,
    tools,
    vector_dbs,
    workflows,
)
from app.api.workflow_configs import workflow_configs

router = APIRouter()
api_prefix = "/api/v1"

router.include_router(agents.router, tags=["Agent"], prefix=api_prefix)
router.include_router(llms.router, tags=["LLM"], prefix=api_prefix)
router.include_router(api_user.router, tags=["Api user"], prefix=api_prefix)
router.include_router(api_keys.router, tags=["API key"], prefix=api_prefix)
router.include_router(datasources.router, tags=["Datasource"], prefix=api_prefix)
router.include_router(tools.router, tags=["Tool"], prefix=api_prefix)
router.include_router(workflows.router, tags=["Workflow"], prefix=api_prefix)
router.include_router(
    workflow_configs.router, tags=["Workflow Config"], prefix=api_prefix
)
router.include_router(vector_dbs.router, tags=["Vector Database"], prefix=api_prefix)


# CHATSAPP
router.include_router(chatwoot.router, tags=["Chatwoot"], prefix=api_prefix)
router.include_router(integrations.router, tags=["Integrations"], prefix=api_prefix)
router.include_router(token.router, tags=["Token"], prefix=api_prefix)
router.include_router(subscription.router, tags=["Subscription"], prefix=api_prefix)
