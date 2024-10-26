import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { TrashIcon } from "@radix-ui/react-icons";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const truncateFileName = (name: string, maxLength: number) => {
    const extension = name.split(".").pop(); // Get file extension
    const baseName = name.replace(`.${extension}`, ""); // Remove extension from name

    if (baseName.length <= maxLength) return name;

    return `${baseName.substring(0, maxLength)}... .${extension}`;
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  // delete images
  const handleDelete = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    // onChange && onChange(newFiles);
  };

  useEffect(() => {
    onChange && onChange(files);
  }, [files, onChange]);

  return (
    <div className="">
      <div {...getRootProps()} className="w-full cursor-pointer">

        <div onClick={handleClick} className="w-full h-full group/file block rounded-lg relative overflow-hidden">
          <motion.div
            whileHover="animate"
          >
            <div
              className={`relative z-20 w-full h-28 md:h-28 md:w-3/4 p-5 max-w-4xl mx-auto border border-dashed rounded-lg ${isDragActive
                ? "border-cyan-300"
                : "border-black dark:border-white"
                }`}
            >
              {/* input */}
              <input
                {...getInputProps()}
                ref={fileInputRef}
                id="file-upload-handle"
                type="file"
                onChange={(e) =>
                  handleFileChange(Array.from(e.target.files || []))
                }
                className="hidden"
              />

              {/* upload text */}
              <div className="flex flex-col items-center justify-center">
                <p className="font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                  Upload file
                </p>
                <p className="font-sans font-normal text-neutral-400 dark:text-neutral-400 text-sm">
                  Drag &apos;n&apos; drop your files here or click to upload
                </p>
              </div>

              {/* icon */}
              <div className="flex flex-col items-center justify-center">
                {isDragActive ? (
                  <p>Drop the files...</p>
                ) : (
                  <IconUpload className="h-6 w-6 object-contain text-neutral-600 dark:text-neutral-400" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Uploaded files */}
      <div className="">
        <motion.div>
          <div className="w-full grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-3 align-middle mt-5">
            {files.length > 0 &&
              files.map((file, idx) => (
                <div
                  key={"file" + idx}
                  className={cn(
                    "relative flex flex-col items-start justify-start rounded-md mx-auto my-auto",
                    "shadow-sm"
                  )}
                >
                  <motion.div
                    // key={"file" + idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  // className={cn(
                  //   "relative flex flex-col items-start justify-start rounded-md mx-auto my-auto",
                  //   "shadow-sm"
                  // )}
                  >
                    <button
                      onClick={() => handleDelete(idx)}
                      type="button"
                      className="absolute top-0 right-0  z-30 p-0.5 text-white bg-red-500 rounded-full cursor-pointer text-3xl"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>

                    {/* image */}
                    <div className="">
                      <p className="text-base text-neutral-700 dark:text-neutral-300 truncate">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout

                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width={100}
                            height={100}
                            style={{ width: "100%", height: "160px" }}
                            className="object-cover h-40 rounded-md mx-auto"
                          />
                        </motion.p>
                      </p>
                    </div>

                    {/* image details */}
                    <div className="">
                      <p className="text-neutral-700 dark:text-neutral-300 truncate text-xs">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout

                        >
                          {truncateFileName(file.name, 10)}
                        </motion.p>
                      </p>
                    </div>

                    <div className="">
                      <p className=" p-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-xs ">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout

                        >
                          {file.type}
                          {/* ({(file.size / (1024 * 1024)).toFixed(2)} MB) */}
                        </motion.p>
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
