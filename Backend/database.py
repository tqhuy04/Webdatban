import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:130404@localhost/restaurant_booking")
# Get DATABASE_URL from environment (required in production)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    logger.error("DATABASE_URL environment variable is not set!")
    raise ValueError("DATABASE_URL environment variable is required")

logger.info(f"Database URL configured")

# Add SSL mode for Railway if needed
if "railway" in DATABASE_URL:
    if "?" not in DATABASE_URL:
        DATABASE_URL += "?ssl_mode=REQUIRED"
    elif "ssl_mode" not in DATABASE_URL:
        DATABASE_URL += "&ssl_mode=REQUIRED"
    logger.info(f"SSL mode enabled for Railway")

# Create engine with production-ready settings
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=10,
        echo=False,
        future=True
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
