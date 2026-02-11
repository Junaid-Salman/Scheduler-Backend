/**
 * Domain entity for Shift. Used in use-cases and repository interfaces.
 * No ORM decorators; plain domain model.
 */
export interface Shift {
  id: string;
  employeeId: string;
  startAt: Date;
  endAt: Date;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}
