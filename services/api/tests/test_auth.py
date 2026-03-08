"""Authentication endpoint tests."""
import pytest
import uuid
from sqlalchemy import text
from app.core.security import hash_password
from app.models.user import User


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post("/api/v1/auth/login", json={"email": "nobody@test.com", "password": "wrong"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_valid_credentials(client):
    from tests.conftest import TestSessionLocal
    tenant_id = str(uuid.uuid4())
    async with TestSessionLocal() as session:
        user = User(
            id=str(uuid.uuid4()),
            email="test@lexcore.com",
            hashed_password=hash_password("SecurePass123!"),
            full_name="Test User",
            role="staff",
            tier="enterprise",
            tenant_id=tenant_id,
        )
        session.add(user)
        await session.commit()

    response = await client.post("/api/v1/auth/login", json={"email": "test@lexcore.com", "password": "SecurePass123!"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
