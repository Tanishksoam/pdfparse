import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";

export async function POST(req) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return resolve(
          NextResponse.json({ error: "File upload failed" }, { status: 500 })
        );
      }

      try {
        const file = files.pdf;
        const dataBuffer = fs.readFileSync(file.filepath);
        const data = await pdf(dataBuffer);

        resolve(NextResponse.json({ text: data.text }));
      } catch (error) {
        console.error("PDF parsing error:", error);
        resolve(
          NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 })
        );
      }
    });
  });
}
