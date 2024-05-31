// src/app/api/users/[id]/pets/route.js
import dbConnect from '@/app/libs/mongoose';
import Pet from '@/app/models/Pet';

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;
  console.log(`Fetching pets created by: ${id}`);

  try {
    const pets = await Pet.find({ creatorEmail: id });
    console.log(`Found pets: ${pets}`);
    return new Response(JSON.stringify(pets), { status: 200 });
  } catch (error) {
    console.error(`Error fetching pets: ${error.message}`);
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
