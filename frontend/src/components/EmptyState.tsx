
interface EmptyStateProps {
  title: string;
  description: string;
  variant?: "default" | "compact";
}

export default function EmptyState({
  title,
  description,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={`empty-state empty-state--${variant}`}
      role="status"
    >
      <span className="empty-state__marker" aria-hidden="true">
        —
      </span>

      <div className="empty-state__content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
