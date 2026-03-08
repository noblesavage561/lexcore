"""User model — supports individual clients, business clients, and staff."""
from enum import Enum as PyEnum
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDBase


class UserRole(str, PyEnum):
    STAFF = "staff"
    ADMIN = "admin"
    BUSINESS_OWNER = "business_owner"
    BUSINESS_USER = "business_user"
    INDIVIDUAL = "individual"


class UserTier(str, PyEnum):
    STANDARD = "standard"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class User(UUIDBase):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default=UserRole.INDIVIDUAL)
    tier: Mapped[str] = mapped_column(String(50), nullable=False, default=UserTier.STANDARD)
    tenant_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    matters: Mapped[list["Matter"]] = relationship("Matter", back_populates="owner", lazy="select")
