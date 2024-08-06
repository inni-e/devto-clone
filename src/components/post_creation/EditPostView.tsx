import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import AutoResizeTextArea from "~/components/post_creation/AutoResizeTextArea";

type EditPostProps = {
  post: {
    id: number,
    name: string,
    content: string,
    imageKey: string | null,
    createdById: string,
  }
}

export default function EditPostView({ post }: EditPostProps) {
  const { id: postId, name: originalName, content: originalContent, imageKey: originalImageKey, createdById } = post;
  const [name, setName] = useState(originalName);
  const [content, setContent] = useState(originalContent);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const { mutate: updatePost, isPending: isUpdating } = api.post.updatePost.useMutation({
    onSuccess: async ({ url: putURL }) => {
      if (image && putURL) {
        try {
          const response = await fetch(putURL, {
            method: 'PUT',
            body: image,
            headers: {
              'Content-Type': image.type,
            },
          });

          if (response.ok) {
            console.log('Profile image uploaded successfully!');
          } else {
            console.log('Profile image upload failed');
          }
        } catch (error) {
          console.error('Profile image upload failed:', error);
          console.log('Profile image upload failed');
        }
      }
      window.location.href = '/';
      alert("Post updated successfully!");
    }
  });

  const { data: url } = api.aws.getPresignedURLGet.useQuery({
    fileKey: originalImageKey ?? "",
  }, {
    enabled: !!originalImageKey // Only run the query if imageKey is present
  });

  useEffect(() => {
    if (url) {
      setPreview(url);
    }
  }, [url]);

  const handleSubmit = async () => {
    try {
      updatePost({
        id: postId,
        name: name,
        content: content,
        ...(originalImageKey && image && { originalImageKey: originalImageKey }), // Only perform this if an image was provided
        ...(image && { imageName: image.name }), // Only perform this if an image was provided
        createdById: createdById
      });
    } catch (error) {
      console.error("Error uploading image or creating post:", error);
    }
  };

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreview(event.target?.result);
      }
    };
    reader.readAsDataURL(file); // Reads the file as a data URL.
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.[0]) return;
    setImage(files[0]);
    readImageFile(files[0]);
  }

  return (
    <div className="w-site h-full flex gap-4 bg-gray-100">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col flex-none h-[90%] bg-white rounded-lg border border-gray-200 overflow-y-auto">
          <div className="pt-8 pl-20 flex justify-start gap-8 items-center">
            <img
              src={preview as string}
              alt="Post Image"
              className="w-48 h-32 object-cover"
            />
            <input
              className=""
              type="file"
              accept="image/*"
              onChange={handleImageInput}
            />
          </div>
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
          {isUpdating ?
            <div className="text-white font-bold w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            :
            <button
              className="text-white px-4 font-bold h-10 bg-blue-700 hover:bg-blue-800 rounded-md"
              onClick={() => handleSubmit()}
            >
              Save changes
            </button>
          }
          <button className="text-gray-700 w-24 h-10 hover:bg-blue-800/10 rounded-md">
            Save draft
          </button>
        </div>
      </div>
      <div className="hidden sm:flex w-96">
        Edit your post
      </div>
    </div>
  );
}