"""Chuẩn hóa datetime UTC → ISO 8601 có hậu tố Z (trình duyệt parse đúng múi giờ local)."""
from datetime import datetime, timezone
from typing import Optional


def isoformat_utc_z(dt: Optional[datetime]) -> Optional[str]:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.isoformat() + "Z"
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
