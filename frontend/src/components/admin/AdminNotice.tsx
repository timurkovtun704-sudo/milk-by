
import type { AdminNoticeData } from "../../types/admin";

interface AdminNoticeProps {
  notice: AdminNoticeData;
  closeLabel: string;
  onClose: () => void;
}

export default function AdminNotice({
  notice,
  closeLabel,
  onClose,
}: AdminNoticeProps) {
  return (
    <div
      className={`admin-notice admin-notice--${notice.variant}`}
      role="status"
      aria-live="polite"
    >
      <span className="admin-notice__indicator" />

      <p>{notice.message}</p>

      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
