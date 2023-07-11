import { FC, MouseEvent, useState } from 'react';

interface UploadedFileProps {
  filename: string;
  onDelete: (event: MouseEvent) => void;
}

export const UploadedFile: FC<UploadedFileProps> = ({ filename, onDelete }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewClick = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="group relative inline-block text-xs text-gray-900 mb-3 mx-[10px] md:mx-0">
      <span className="flex items-stretch justify-center">
        <span className="rounded-l-md  bg-gray-500 px-2 py-2 text-white transition-colors dark:bg-gray-500">
          <span title="Preview" onClick={handlePreviewClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              strokeWidth="2"
              className="h-5 w-5 cursor-pointer"
            >
              <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z"></path>
              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z"></path>
            </svg>
          </span>
        </span>
        <span className="flex max-w-xs items-center truncate rounded-r-md bg-gray-50 px-3 py-2 font-medium">
          <span className="truncate">{filename}</span>
        </span>
      </span>
      {showPreview && <FilePreview filename={filename} />}
      <button
        onClick={onDelete}
        className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-white bg-gray-500 p-0.5 text-white transition-all duration-300 hover:bg-red-600 hover:opacity-100 group-hover:opacity-100 md:opacity-0 opacity-0"
      >
        {/* 'delete' icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

interface FilePreviewProps {
  filename: string;
}

const FilePreview: FC<FilePreviewProps> = ({ filename }) => {
  // Render the file contents here
  return <div>Preview of {filename}</div>;
};