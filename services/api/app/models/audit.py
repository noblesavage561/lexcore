"""Audit log model — append-only, never deleted."""
from sqlalchemy import String, Text, Integer, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import UUIDBase


class AuditEvent(UUIDBase):
    __tablename__ = "audit_events"
    __table_args__ = (
        Index("ix_audit_events_client_ts", "tenant_id", "created_at"),
        Index("ix_audit_events_matter", "matter_id"),
    )

    agent_id: Mapped[str] = mapped_column(String(100), nullable=False)
    tool_called: Mapped[str] = mapped_column(String(200), nullable=False)
    data_accessed: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    tenant_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    matter_id: Mapped[str] = mapped_column(String(36), nullable=True)
    approval_ref: Mapped[str] = mapped_column(String(36), nullable=True)
    outcome: Mapped[str] = mapped_column(String(30), nullable=False)
    error_message: Mapped[str] = mapped_column(Text, nullable=True)
    input_summary: Mapped[str] = mapped_column(Text, nullable=True)
    output_summary: Mapped[str] = mapped_column(Text, nullable=True)
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=True)
    tokens_used: Mapped[int] = mapped_column(Integer, nullable=True)
    session_id: Mapped[str] = mapped_column(String(36), nullable=True)
