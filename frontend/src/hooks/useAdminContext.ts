
import { useOutletContext } from "react-router-dom";

import type { Locale } from "../i18n/messages";
import type { AdminMessages } from "../i18n/adminMessages";
import type { AdminNoticeVariant } from "../types/admin";

export interface AdminContext {
  locale: Locale;
  messages: AdminMessages;

  notify: (
    message: string,
    variant?: AdminNoticeVariant
  ) => void;
}

export function useAdminContext(): AdminContext {
  return useOutletContext<AdminContext>();
}
