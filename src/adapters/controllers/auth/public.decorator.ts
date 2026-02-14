import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Use on routes that do not require a valid JWT (e.g. login, signup, refresh).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
