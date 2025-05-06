import { model, models, Schema } from "mongoose";

interface FileStructure {
  fileName: string;
  fileSize: string;
  url: string;
  userId: string;
  type: string;
}

const FileSchema: Schema = new Schema<FileStructure>(
  {
    fileName: { type: String, required: true },
    fileSize: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const File = models.File || model<FileStructure>("File", FileSchema);

export default File;
