export const appointmentStatuses = [
  "PROGRAMATA",
  "CONFIRMATA",
  "SOSIT",
  "FINALIZATA",
  "ANULATA",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export function isAppointmentStatus(value: string): value is AppointmentStatus {
  return appointmentStatuses.includes(value as AppointmentStatus);
}
