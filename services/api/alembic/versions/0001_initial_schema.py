"""Initial schema — users, matters, approvals, audit_events, documents

Revision ID: 0001
Revises: 
Create Date: 2025-01-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="individual"),
        sa.Column("tier", sa.String(50), nullable=False, server_default="standard"),
        sa.Column("tenant_id", sa.String(36), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_tenant_id", "users", ["tenant_id"])

    op.create_table(
        "matters",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="in_research"),
        sa.Column("domain", sa.String(50), nullable=False),
        sa.Column("tenant_id", sa.String(36), nullable=False),
        sa.Column("owner_id", sa.String(36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("jurisdiction", sa.String(255), nullable=True),
        sa.Column("next_action", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_matters_tenant_id", "matters", ["tenant_id"])
    op.create_index("ix_matters_owner_id", "matters", ["owner_id"])
    op.create_index("ix_matters_status", "matters", ["status"])

    op.create_table(
        "approvals",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("matter_id", sa.String(36), sa.ForeignKey("matters.id"), nullable=False),
        sa.Column("tenant_id", sa.String(36), nullable=False),
        sa.Column("requested_by", sa.String(36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("scope", sa.String(50), nullable=False),
        sa.Column("action_summary", sa.Text, nullable=False),
        sa.Column("risk_score", sa.String(10), nullable=False, server_default="MEDIUM"),
        sa.Column("proposed_action", sa.JSON, nullable=False),
        sa.Column("artifacts", sa.JSON, nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("approver_id", sa.String(36), nullable=True),
        sa.Column("approver_note", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_approvals_matter_id", "approvals", ["matter_id"])
    op.create_index("ix_approvals_tenant_id", "approvals", ["tenant_id"])
    op.create_index("ix_approvals_status", "approvals", ["status"])

    op.create_table(
        "audit_events",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("agent_id", sa.String(100), nullable=False),
        sa.Column("tool_called", sa.String(200), nullable=False),
        sa.Column("data_accessed", sa.JSON, nullable=False),
        sa.Column("tenant_id", sa.String(36), nullable=False),
        sa.Column("matter_id", sa.String(36), nullable=True),
        sa.Column("approval_ref", sa.String(36), nullable=True),
        sa.Column("outcome", sa.String(30), nullable=False),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("input_summary", sa.Text, nullable=True),
        sa.Column("output_summary", sa.Text, nullable=True),
        sa.Column("latency_ms", sa.Integer, nullable=True),
        sa.Column("tokens_used", sa.Integer, nullable=True),
        sa.Column("session_id", sa.String(36), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_audit_events_tenant_id", "audit_events", ["tenant_id"])
    op.create_index("ix_audit_events_matter", "audit_events", ["matter_id"])
    op.create_index("ix_audit_events_client_ts", "audit_events", ["tenant_id", "created_at"])

    op.create_table(
        "documents",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("matter_id", sa.String(36), sa.ForeignKey("matters.id"), nullable=False),
        sa.Column("tenant_id", sa.String(36), nullable=False),
        sa.Column("uploaded_by", sa.String(36), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("filename", sa.String(500), nullable=False),
        sa.Column("content_type", sa.String(100), nullable=False),
        sa.Column("s3_key", sa.String(1000), nullable=False),
        sa.Column("file_size_bytes", sa.BigInteger, nullable=True),
        sa.Column("ocr_status", sa.String(30), nullable=False, server_default="pending"),
        sa.Column("extracted_entities", sa.JSON, nullable=True),
        sa.Column("extracted_deadlines", sa.JSON, nullable=True),
        sa.Column("provenance", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_documents_matter_id", "documents", ["matter_id"])
    op.create_index("ix_documents_tenant_id", "documents", ["tenant_id"])


def downgrade() -> None:
    op.drop_table("documents")
    op.drop_table("audit_events")
    op.drop_table("approvals")
    op.drop_table("matters")
    op.drop_table("users")
