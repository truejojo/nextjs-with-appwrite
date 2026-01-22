import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

export async function POST(request: NextRequest) {
  try {
    await connect();
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');

      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    await sendEmail({ email: savedUser.email, emailType: 'VERIFY', userId: savedUser._id.toString() });

    return NextResponse.json({ 
      message: 'User registered successfully',
      success:true,
      username: savedUser.username,
      email: savedUser.email
     }, 
     { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: 'Internal Server Error: ' + message }, { status: 500 });
  }
}
