// api/pets/requests/route.js
import dbConnect from "@/app/libs/mongoose";
import Request from "@/app/models/Request";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const requests = await Request.find({ creatorEmail: session.user.email });
    return new Response(JSON.stringify(requests), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
