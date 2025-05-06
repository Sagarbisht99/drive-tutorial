import { NextResponse } from "next/server";
import File from "@/models/File";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/dbConnect";

export async function POST() {
  try {
    // Destructure userId from the Clerk authentication

    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch files for the authenticated user
    const files = await File.find({ userId });

    // Return the files in a successful response
    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error("Error fetching files:", error);

    // Return an internal server error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
