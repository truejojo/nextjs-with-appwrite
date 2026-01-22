import { getDataFromToken } from '@/helpers/getDataFromToken';

import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { AuthTokenPayload } from '@/types/auth';

export async function GET(request: NextRequest) {
  try {
    const userMe: AuthTokenPayload = await getDataFromToken(request);
    const currentUser = await User.findById(userMe.id).select('-password');

    return NextResponse.json(
      {
        message: 'User fetched successfully',
        data: currentUser,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
