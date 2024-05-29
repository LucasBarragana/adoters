import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/libs/mongoose";
import { getServerSession } from 'next-auth/next';
import User from "@/app/models/User";

export async function POST(req, { params }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  const { id, petId } = params;

  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Verificar se o pet já está na lista de favoritos
    if (!user.favorites.includes(petId)) {
      user.favorites.push(petId);
      await user.save();
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  const { id, petId } = params;

  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Remover o pet dos favoritos
    user.favorites = user.favorites.filter(fav => fav.toString() !== petId);
    await user.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}