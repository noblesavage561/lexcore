"""Document model — uploaded files with provenance tracking."""
from sqlalchemy import String, Text, ForeignKey, JSON, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import UUIDBase


class Document(UUIDBase):
    __tablename__ = "documents"

    matter_id: Mapped[str] = mapped_column(String(36), ForeignKey("matters.id"), nullable=False, index=True)
    tenant_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    uploaded_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(1000), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=True)
    ocr_status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    extracted_entities: Mapped[dict] = mapped_column(JSON, nullable=True)
    extracted_deadlines: Mapped[list] = mapped_column(JSON, nullable=True)
    provenance: Mapped[dict] = mapped_column(JSON, nullable=True)

    matter: Mapped["Matter"] = relationship("Matter", back_populates="documents")
