import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import File from "@/models/File";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { id, newName } = await req.json();

    if (!id || !newName) {
      return NextResponse.json(
        { success: false, error: "ID or new name not provided" },
        { status: 400 }
      );
    }

    // Find the file by ID
    const file = await File.findById(id);

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Update the file name in the database
    file.fileName = newName;
    await file.save();

    return NextResponse.json({
      success: true,
      message: "File name updated successfully",
      file,
    });
  } catch (error) {
    console.error("Error updating file name:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
