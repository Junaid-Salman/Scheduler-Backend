/**
 * Domain entity for User. Used in use-cases and repository interfaces.
 * No ORM decorators; plain domain model.
 */
export interface User {
  id: string;
  name: string;
  email: string;
}
