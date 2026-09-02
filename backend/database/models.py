from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.database import Base


class VehicleInspection(Base):
    __tablename__ = "vehicle_inspections"

    # Primary key
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Uploaded image
    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # Number plate detection
    # We detect the plate but DO NOT read its characters.
    number_plate_detected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    number_plate_confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # LED light/bar detection
    led_detected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    led_confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # Result image
    annotated_image: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Inspection timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )