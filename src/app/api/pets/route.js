import dbConnect from "@/app/libs/mongoose";
import Pet from "@/app/models/Pet";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const { name, age, description } = await req.json();
    const newPet = new Pet({
      name,
      age,
      description,
      creator: session.user.name,
      creatorEmail: session.user.email,
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