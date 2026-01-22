export interface AuthTokenPayload {
  id: string;
  email: string;
  username: string;
}

export interface UserI {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}
