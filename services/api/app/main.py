"""
LexCore FastAPI Gateway
BBA Services | Build. Bank. Ascend.
"""
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator

from app.routers import auth, clients, matters, approvals, research, agents, audit, health
from app.middleware.audit import AuditMiddleware
from app.middleware.tenant import TenantMiddleware
from app.core.config import settings

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("lexcore_api_starting", version="0.1.0", env=settings.ENVIRONMENT)
    yield
    logger.info("lexcore_api_stopping")


app = FastAPI(
    lifespan=lifespan,
    title="LexCore API",
    description="AI-Powered Intelligence Platform — BBA Services",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── Observability ──────────────────────────────────────────────────────────────
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Custom Middleware ──────────────────────────────────────────────────────────
app.add_middleware(AuditMiddleware)
app.add_middleware(TenantMiddleware)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["clients"])
app.include_router(matters.router, prefix="/api/v1/matters", tags=["matters"])
app.include_router(approvals.router, prefix="/api/v1/approvals", tags=["approvals"])
app.include_router(research.router, prefix="/api/v1/research", tags=["research"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["audit"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "request_id": request.state.request_id if hasattr(request.state, "request_id") else None},
    )
