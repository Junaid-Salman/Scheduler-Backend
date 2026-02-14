/**
 * Domain entity for User. Used in use-cases and repository interfaces.
 * No ORM decorators; plain domain model.
 * passwordHash is only present when loaded from DB for auth checks; never exposed in responses.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
}
