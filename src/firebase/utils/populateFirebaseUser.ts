import { UserRecord } from 'firebase-admin/lib/auth/user-record';

export default function populateFirebaseUser(user: UserRecord, dbUser?: Record<string, any>) {
  const customClaims = (user.customClaims || { role: '' }) as { role?: string };
  const role = customClaims.role ? customClaims.role : '';
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
    totalResCount: dbUser?.totalResCount || 0,
    activeResCount: dbUser?.activeResCount || 0,
  };
}
