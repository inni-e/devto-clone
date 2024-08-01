import { useState } from "react";
import AutoResizeTextArea from "~/components/post_creation/AutoResizeTextArea";
import FileUpload from "~/components/post_creation/FileUpload"; // Import your file upload component
import { api } from "~/utils/api";

export default function CreatePostView() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { mutate: createPost, isPending: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setName("");
      setContent("");
      setImageUrl("");
      window.location.href = '/';
      alert('Post created successfully!');
    }
  });

  return (
    <div className="w-site h-full flex gap-4 bg-gray-100">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col flex-none h-[90%] bg-white rounded-lg border border-gray-200 overflow-y-auto">
          <FileUpload onFileUpload={(url) => setImageUrl(url)} />
          <AutoResizeTextArea
            placeholder="Write a compelling title!"
            className="px-8 pt-8 font-bold text-3xl"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <AutoResizeTextArea
            placeholder="What's your post about?"
            className="px-8 pt-8 text-md"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </div>
        <div className="flex items-center justify-start gap-4 py-6">
          {isPosting ?
            <div className="text-white font-bold w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            :
            <button
              className="text-white font-bold w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md"
              onClick={() => createPost({ name, content, imageUrl })}
            >
              Publish
            </button>
          }
          <button className="text-gray-700 w-24 h-10 hover:bg-blue-800/10 rounded-md">
            Save draft
          </button>
        </div>
      </div>
      <div className="hidden sm:flex w-96">
        Write a post!
      </div>
    </div>
  );
}