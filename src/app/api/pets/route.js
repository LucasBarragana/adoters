import dbConnect from "@/app/libs/mongoose";
import Pet from "@/app/models/Pet";
import User from "@/app/models/User";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const { name, age, description, category, size, image } = await req.json();

    // Buscar usuário para obter a cidade
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const newPet = new Pet({
      name,
      age,
      description,
      category,
      size,
      city: user.city, // Usar a cidade do usuário recuperada do banco de dados
      creator: session.user.name,
      creatorEmail: session.user.email,
      image
    });

    await newPet.save();
    return new Response(JSON.stringify(newPet), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const pets = await Pet.find({});
    return new Response(JSON.stringify(pets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
