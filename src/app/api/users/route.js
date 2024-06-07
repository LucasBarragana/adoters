import dbConnect from "@/app/libs/mongoose";
import User from "@/app/models/User";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req, res) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const users = await User.find({ admin: true });
    console.log('Users:', users); // Adicionando console log para visualizar os dados antes de enviar a resposta
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
