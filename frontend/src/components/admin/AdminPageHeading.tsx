
import type { ReactNode } from "react";

interface AdminPageHeadingProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function AdminPageHeading({
  title,
  description,
  action,
}: AdminPageHeadingProps) {
  return (
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">
          CONTENT MANAGEMENT
        </p>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      {action && (
        <div className="admin-page-heading__action">
          {action}
        </div>
      )}
    </div>
  );
}
