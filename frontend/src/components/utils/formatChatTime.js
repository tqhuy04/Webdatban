/**
 * Chuỗi datetime từ backend (UTC, naive) thường không có Z → JS parse sai.
 * Gắn Z nếu thiếu múi giờ để toLocale* hiển thị đúng giờ máy người dùng.
 */
export function parseChatUtc(iso) {
  if (iso == null || iso === "") return null;
  let s = String(iso).trim();
  if (!s) return null;
  const hasTz = /Z$/i.test(s) || /[+-]\d{2}:?\d{2}$/.test(s);
  if (!hasTz) s = `${s}Z`;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatChatTime(iso, options = {}) {
  const d = parseChatUtc(iso);
  if (!d) return "";
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

export function formatChatDateTime(iso, options = {}) {
  const d = parseChatUtc(iso);
  if (!d) return "";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    ...options,
  });
}
