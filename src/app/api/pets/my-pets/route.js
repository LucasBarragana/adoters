import dbConnect from "@/app/libs/mongoose";
import Pet from "@/app/models/Pet";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const pets = await Pet.find({ creatorEmail: session.user.email });
    return new Response(JSON.stringify(pets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
