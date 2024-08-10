import { useState } from "react";
import AutoResizeTextArea from "~/components/post_creation/AutoResizeTextArea";
// import FileUpload from "~/components/post_creation/FileUpload"; // Import your file upload component
import { api } from "~/utils/api";
import LoadingSpinner from '~/components/LoadingSpinner';
import CreateTag from "../tag/CreateTag";

// TODO: Uninstall axios

export default function CreatePostView() {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { mutate: createPost, isPending: isPosting } = api.post.create.useMutation({
    onSuccess: async () => {
      setName("");
      setContent("");
      window.location.href = '/';
      alert('Post created successfully!');
    }
  });

  const { mutateAsync: getPresignedURLPut, isPending: isGettingURL } = api.aws.getPresignedURLPut.useMutation({
    onSuccess: async ({ url }) => {
      if (image) {
        try {
          const response = await fetch(url, {
            method: 'PUT',
            body: image,
            headers: {
              'Content-Type': image.type,
            },
          });

          if (response.ok) {
            console.log('File uploaded successfully!');
          } else {
            console.log('Upload failed');
          }
        } catch (error) {
          console.error('Upload failed:', error);
          console.log('Upload failed');
        }
      }
    },
    onError: () => {
      console.error('Error fetching presigned URL!!');
      console.log('Error fetching presigned URL');
    },
  });

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("File Changed! Now: ")
    console.log(files);
    if (!files) return;
    console.log(files[0]);
    setImage(files[0]);
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 4) {
      setTags([...tags, tagInput.trim()]);
      setTagInput(""); // Clear the tag input field
    }
  };

  const handleDeleteTag = (tagToRemove: string) => {
    if (tags.includes(tagToRemove)) {
      setTags(tags.filter(tag => tag !== tagToRemove));
    }
  }

  const handleSubmit = async () => {
    try {
      let imageKey;
      if (image) {
        console.log("Looking at the image submitted: ")
        console.log(image);
        imageKey = `${Date.now()}-${image.name}`;
        await getPresignedURLPut({
          fileKey: imageKey,
          // fileType: image.type,
        });
      }

      createPost({
        name: name,
        content: content,
        tags: tags,
        ...(imageKey && { imageKey }),
      });
    } catch (error) {
      console.error("Error uploading image or creating post:", error);
    }
  };

  

  return (
    <div className="w-site h-full flex gap-4 bg-gray-100">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col flex-none h-[90%] bg-white rounded-lg border border-gray-200 overflow-y-auto">
          <input
            className="px-8 pt-12"
            type="file"
            accept="image/*"
            onChange={handleImageInput}
          />
          <AutoResizeTextArea
            placeholder="Write a compelling title!"
            className="px-8 pt-8 font-bold text-3xl"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <div className="px-8 mt-4 flex flex-wrap gap-2">
            {tags.map((tagName, index) => <CreateTag key={index} tagName={tagName} deleteTag={handleDeleteTag} />)}
            <input
              type="text"
              className="focus:outline-none disabled:cursor-not-allowed disabled:bg-white"
              placeholder={(tags.length === 0 && "Add up to 4 tags") || (tags.length === 4 && "Max tags!") || "Add another"}
              disabled={tags.length === 4}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
          </div>
          <AutoResizeTextArea
            placeholder="What's your post about?"
            className="px-8 pt-8 text-md"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </div>
        <div className="px-4 sm:px-0 flex items-center justify-start gap-4 py-6">
          {isPosting || isGettingURL ?
            <div className="text-white font-bold w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md flex justify-center items-center">
              <LoadingSpinner />
            </div>
            :
            <button
              className="text-white font-bold w-24 h-10 bg-blue-700 hover:bg-blue-800 rounded-md"
              onClick={() => handleSubmit()}
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