import dbConnect from "@/app/libs/mongoose";
import User from "@/app/user/[email]/page";

export default async function handler(req, res) {
  await dbConnect();

  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
