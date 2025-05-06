import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";
import connectDB from "@/lib/dbConnect";
import File from "@/models/File";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  
  try {
    await connectDB();
    // Check if there's a file
    const data = await req.formData();
    const file =  data.get("fileInput") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });


    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Save file metadata to MongoDB
    const newFile = await File.create({
      fileName: file.name,
      fileSize: file.size.toString(),
      url: uploaded.url,
      userId: userId,
      type: file.type,
    });

    return NextResponse.json({ success: true, data: newFile });
  } catch (error) {
    console.error("Error in file upload:", error);
    // Ensure the response is returned even on error
    return NextResponse.json(
      { error: "Upload failed", detail: error },
      { status: 500 }
    );
  }
}