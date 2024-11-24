import cloudinary from "@/lib/options/cloudinary_options";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldImageUrl = formData.get("oldImageUrl") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to a buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(fileBuffer);

    // Upload file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    // Delete old image if provided and valid
    if (oldImageUrl && oldImageUrl.includes("cloudinary")) {
      try {
        const urlParts = new URL(oldImageUrl); // Parse the URL
        const pathParts = urlParts.pathname.split('/'); // Split the path
        const uploadIndex = pathParts.indexOf('upload');

        if (uploadIndex !== -1 && uploadIndex + 1 < pathParts.length) {
          // Extract the public ID
          const publicId = pathParts
            .slice(uploadIndex + 1)
            .join('/')
            .replace(/\.[^/.]+$/, ''); // Remove file extension

          // Delete the old image
          await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
              console.error("Error deleting old image:", error);
            } else {
              console.log("Old image deleted successfully:", result);
            }
          });
        } else {
          console.error("Invalid Cloudinary URL for deletion:", oldImageUrl);
        }
      } catch (error) {
        console.error("Error extracting public ID from URL:", error);
      }
    }

    // Retrieve the secure URL of the uploaded image
    const imageUrl = (uploadResult as any).secure_url;

    // Return the URL in the response
    return NextResponse.json({ url: imageUrl });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
