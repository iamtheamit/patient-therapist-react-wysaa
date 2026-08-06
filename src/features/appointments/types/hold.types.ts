export interface SlotHoldSession {
  holdId: string;
  slotId: string;
  therapistId: string;
  expiresAt: number; // Timestamp in milliseconds
}

export interface HoldSlotResponse {
  success: boolean;
  hold: SlotHoldSession;
}
