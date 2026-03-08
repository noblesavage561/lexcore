"""Approval model — immutable after resolution."""
from enum import Enum as PyEnum
from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDBase


class ApprovalStatus(str, PyEnum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    RETURNED = "returned"
    EXPIRED = "expired"


class ApprovalRisk(str, PyEnum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Approval(UUIDBase):
    __tablename__ = "approvals"

    matter_id: Mapped[str] = mapped_column(String(36), ForeignKey("matters.id"), nullable=False, index=True)
    tenant_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    requested_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    scope: Mapped[str] = mapped_column(String(50), nullable=False)
    action_summary: Mapped[str] = mapped_column(Text, nullable=False)
    risk_score: Mapped[str] = mapped_column(String(10), nullable=False, default=ApprovalRisk.MEDIUM)
    proposed_action: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    artifacts: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=ApprovalStatus.PENDING, index=True)
    approver_id: Mapped[str] = mapped_column(String(36), nullable=True)
    approver_note: Mapped[str] = mapped_column(Text, nullable=True)

    matter: Mapped["Matter"] = relationship("Matter", back_populates="approvals")
