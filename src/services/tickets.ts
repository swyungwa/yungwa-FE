import { fetchClient } from '../lib/api';

export type TicketGrantResponse = {
  ticketCount?: number;
  grantedCount?: number;
  message?: string;
};

export async function grantTicket(adminCode: string, amount: number): Promise<TicketGrantResponse> {
  return fetchClient<TicketGrantResponse>('/api/tickets/grant', {
    method: 'POST',
    body: JSON.stringify({ adminCode, amount }),
  });
}
