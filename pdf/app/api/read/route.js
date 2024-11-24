import fs from "fs";
import path from "path";
import PdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export async function GET(req) {
  const filePath = path.join(process.cwd(), "public", "tanishkResume.pdf");
  console.log(filePath);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await PdfParse(pdfBuffer);
    return NextResponse.json({ pdfInfo: data.info, text: data.text });
  } catch (err) {
    return NextResponse.json(
      { error: "Error parsing PDF", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const body = await req.json();
  const { newFilePath } = body;

  if (!newFilePath) {
    return NextResponse.json(
      { error: "Missing required field: newFilePath" },
      { status: 400 }
    );
  }

  const absolutePath = path.join(process.cwd(), newFilePath);

  if (!fs.existsSync(absolutePath)) {
    return NextResponse.json(
      { error: "File not found at provided path" },
      { status: 404 }
    );
  }

  try {
    const pdfBuffer = fs.readFileSync(absolutePath);
    const data = await PdfParse(pdfBuffer);
    return NextResponse.json({ pdfInfo: data.info, text: data.text });
  } catch (err) {
    return NextResponse.json(
      { error: "Error parsing PDF", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const filePath = path.join(process.cwd(), "public", "tanishkResume.pdf");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: "PDF deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Error deleting PDF", details: err.message },
      { status: 500 }
    );
  }
}
