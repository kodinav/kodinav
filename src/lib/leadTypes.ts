/** Client-safe lead types & constants (no Node imports). */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  receivedAt: string;
  status: LeadStatus;
  source: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  website?: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  message?: string;
  userAgent?: string;
  note?: string;
};
