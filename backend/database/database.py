from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# ---------------------------------------------------------
# Project paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATABASE_DIR = PROJECT_ROOT / "data"

DATABASE_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ---------------------------------------------------------
# SQLite database
# ---------------------------------------------------------

DATABASE_URL = (
    f"sqlite:///{DATABASE_DIR / 'vehicle_inspections.db'}"
)


# ---------------------------------------------------------
# SQLAlchemy
# ---------------------------------------------------------

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


Base = declarative_base()


# ---------------------------------------------------------
# Database dependency
# ---------------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()