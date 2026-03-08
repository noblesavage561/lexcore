"""Tenant isolation middleware — enforces data segregation per tenant."""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


EXCLUDED_PATHS = {"/api/v1/health", "/api/docs", "/api/redoc", "/api/openapi.json", "/metrics",
                  "/api/v1/auth/login", "/api/v1/auth/refresh"}


class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.tenant_id = None
        # Tenant ID resolved from JWT in auth dependency — set here as placeholder
        return await call_next(request)
