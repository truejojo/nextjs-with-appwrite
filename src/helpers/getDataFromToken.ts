import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '@/types/auth';

// Function to extract user data from JWT token in cookies
// here we have create a route to get user details from the token
export const getDataFromToken = async (request: NextRequest): Promise<AuthTokenPayload> => {
  try {
    const token = request.cookies.get('token')?.value || '';
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET || '');

    return decodedToken as AuthTokenPayload;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
};
