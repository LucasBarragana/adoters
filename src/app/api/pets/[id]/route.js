import dbConnect from "@/app/libs/mongoose";
import Pet from "@/app/models/Pet";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;
  try {
    const pet = await Pet.findById(id);
    return new Response(JSON.stringify(pet), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  const { id } = params;
  const { name, age, description, category, size, city, image } = await req.json();

  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: id, creatorEmail: session.user.email },
      { name, age, description, category, size, city, image },
      { new: true }
    );

    if (!pet) {
      return new Response(JSON.stringify({ message: "Pet not found or you don't have permission to update this pet" }), { status: 404 });
    }

    return new Response(JSON.stringify(pet), { status: 200 });
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

  const { id } = params;

  try {
    const pet = await Pet.findOneAndDelete({ _id: id, creatorEmail: session.user.email });

    if (!pet) {
      return new Response(JSON.stringify({ message: "Pet not found or you don't have permission to delete this pet" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Pet deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}