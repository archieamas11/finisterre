"use client";

import { XCircleIcon, ImageIcon } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ImagePreview = ({ onRemove }: { onRemove: () => void; url: string }) => (
  <div className="relative aspect-square">
    <button className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={onRemove}>
      <XCircleIcon className="fill-primary text-primary-foreground h-5 w-5" />
    </button>
  </div>
);

export default function InputDemo() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  return (
    <div className="w-full max-w-40">
      <Label htmlFor="profile">Profile Picture</Label>
      <div className="mt-1 w-full">
        {profilePicture ? (
          <ImagePreview
            onRemove={() => {
              setProfilePicture(null);
            }}
            url={profilePicture}
          />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setProfilePicture(imageUrl);
              }
            }}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
            maxFiles={1}
          >
            {({ getRootProps, isDragActive, isDragAccept, isDragReject, getInputProps }) => (
              <div
                {...getRootProps()}
                className={cn("focus:border-primary flex aspect-square items-center justify-center rounded-md border border-dashed focus:outline-none", {
                  "border-primary bg-secondary": isDragActive && isDragAccept,
                  "border-destructive bg-destructive/20": isDragActive && isDragReject,
                })}
              >
                <input {...getInputProps()} id="profile" />
                <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}
