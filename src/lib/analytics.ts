import posthog from 'posthog-js';

const safe = (fn: () => void) => {
  try {
    fn();
  } catch {
    // PostHog not loaded or env missing — silently skip
  }
};

// ─── 8 custom events ───────────────────────────────────────────────────────

export const trackTestStarted = () =>
  safe(() => posthog.capture('test_started', { source: 'home' }));

export const trackTestCompleted = (loveTypeCode: string) =>
  safe(() => posthog.capture('test_completed', { loveTypeCode }));

export const trackCardCreated = (params: {
  userId: number;
  loveTypeCode: string;
  gender: string;
  hasEmoji: boolean;
}) => safe(() => posthog.capture('card_created', params));

export const trackViewCards = (isLoggedIn: boolean) =>
  safe(() => posthog.capture('view_cards', { isLoggedIn }));

export const trackUnlockAttempted = (params: {
  targetUserId: number;
  targetLoveTypeCode: string;
}) => safe(() => posthog.capture('unlock_attempted', params));

export const trackUnlockSucceeded = (params: {
  targetUserId: number;
  targetLoveTypeCode: string;
}) => safe(() => posthog.capture('unlock_succeeded', params));

export const trackUnlockFailed = (reason: 'NO_TICKET' | 'UNAUTHORIZED' | 'UNKNOWN') =>
  safe(() => posthog.capture('unlock_failed', { reason }));

export const trackTicketGranted = (params: { amount: number; ticketCount: number }) =>
  safe(() => posthog.capture('ticket_granted', params));

// ─── Existing events (centralised) ─────────────────────────────────────────

export const trackTestRestarted = (previousLoveType: string | null) =>
  safe(() => posthog.capture('love_test_restarted', { previous_love_type: previousLoveType }));

export const trackUserLoggedIn = () =>
  safe(() => posthog.capture('user_logged_in'));

export const trackUserLoggedOut = () =>
  safe(() => posthog.capture('user_logged_out'));

export const identifyUser = (userId: number) =>
  safe(() => posthog.identify(String(userId)));

export const resetUser = () =>
  safe(() => posthog.reset());
