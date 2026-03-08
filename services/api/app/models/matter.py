"""Matter (case/project) model."""
from enum import Enum as PyEnum
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDBase


class MatterStatus(str, PyEnum):
    IN_RESEARCH = "in_research"
    DRAFT_READY = "draft_ready"
    PENDING_APPROVAL = "pending_approval"
    CLOSED = "closed"


class MatterDomain(str, PyEnum):
    LEGAL = "legal"
    TAX = "tax"
    REAL_ESTATE = "real_estate"
    HERITAGE = "heritage"
    POLITICAL = "political"
    CONSUMER_CREDIT = "consumer_credit"
    INTERNATIONAL = "international"
    BUSINESS = "business"


class Matter(UUIDBase):
    __tablename__ = "matters"

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default=MatterStatus.IN_RESEARCH, nullable=False, index=True)
    domain: Mapped[str] = mapped_column(String(50), nullable=False)
    tenant_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    jurisdiction: Mapped[str] = mapped_column(String(255), nullable=True)
    next_action: Mapped[str] = mapped_column(Text, nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="matters")
    documents: Mapped[list["Document"]] = relationship("Document", back_populates="matter", lazy="select")
    approvals: Mapped[list["Approval"]] = relationship("Approval", back_populates="matter", lazy="select")
