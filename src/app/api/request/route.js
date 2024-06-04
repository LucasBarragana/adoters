import dbConnect from '@/app/libs/mongoose';
import Request from '@/app/models/Request';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }

  try {
    const { petId, petName, adopterEmail, creatorEmail} = await req.json();

    const newRequest = new Request({
      petId,
      petName,
      adopterEmail,
      creatorEmail
    });

    await newRequest.save();
    return new Response(JSON.stringify(newRequest), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const requests = await Request.find({creatorEmail: session.user.email});
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
