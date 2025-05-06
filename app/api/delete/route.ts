import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import File from "@/models/File";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "No ID provided" }, { status: 400 });
    }

    const deleted = await File.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}