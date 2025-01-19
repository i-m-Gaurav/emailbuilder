import { NextRequest } from "next/server";
import Template from "../../../models/Template"; 
import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const { title, content, imageUrl, footer } = body;

  try {

    const newTemplate = new Template({ title, content, imageUrl, footer });

    await newTemplate.save();

    return NextResponse.json({ message: "Template saved successfully" });
  } catch (error) {
    console.error("Error in POST /api/uploadEmailConfig:", error);
    return NextResponse.json({ message: "Error saving template", error });
  }
}
