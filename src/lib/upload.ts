import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Upload a file to Cloudinary (production) or local filesystem (development).
 * @param file - The File object to upload
 * @param pathname - Storage path (e.g. "blog/timestamp-random.jpg")
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, pathname: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Production: use Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const folderName = path.dirname(pathname);
    const fileName = path.basename(pathname, path.extname(pathname));
    const base64 = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: `bsg/${folderName}`,
      public_id: fileName,
      resource_type: "auto",
    });

    return result.secure_url;
  }

  // Local development: write to public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads", path.dirname(pathname));
  await mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(process.cwd(), "public", "uploads", pathname);
  await writeFile(filePath, buffer);

  return `/uploads/${pathname}`;
}
