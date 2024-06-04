// pages/api/users/[id]/route.js

import dbConnect from "@/app/libs/mongoose";
import User from "@/app/models/User";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  const { id } = params;
  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
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
  const { name, responsable, address, postalCode, phoneNumber, city, admin, donations, openingHours, document } = await req.json();

  try {
    const user = await User.findOneAndUpdate(
      { email: id, email: session.user.email },
      { name, responsable, address, postalCode, phoneNumber, city, admin, donations, openingHours, document},
      { new: true }
    );

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found or you don't have permission to update this user" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
