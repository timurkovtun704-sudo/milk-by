import { useOutletContext } from "react-router-dom";

import type { Locale, SiteMessages } from "../i18n/messages";

export interface SiteContext {
  locale: Locale;
  messages: SiteMessages;
}

export function useSiteContext(): SiteContext {
  return useOutletContext<SiteContext>();
}
