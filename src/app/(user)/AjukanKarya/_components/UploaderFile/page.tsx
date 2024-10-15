import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  userId: string;
  status: 'PENDING' | 'VERIFIED' | 'DENIED';
  createdAt?: Date;
}

const FileUploader: React.FC = () => {
  const { data: session } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uploadResults = await Promise.all(
        acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`/api/upload?userId=${session?.user?.id}`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }
          return await response.json();
        })
      );

      setUploadedFiles((prev) => [...prev, ...uploadResults]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading files');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="h-screen">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-5 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag {"'n'"} drop any files here, or click to select files</p>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
        {isLoading ? (
          <p>Uploading...</p>
        ) : uploadedFiles.length > 0 ? (
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>{file.filename}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default FileUploader;