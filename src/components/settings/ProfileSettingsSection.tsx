import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";

export default function ProfileSettingsSection() {
  const { data: sessionData } = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (sessionData?.user?.bio) {
      setBio(sessionData.user.bio);
    }
  }, [sessionData]);

  const fileKey = sessionData?.user?.imageKey;

  // TODO: Make profile URL acquisition similar to ProfileImage
  const { data: url } = api.aws.getPresignedURLGet.useQuery({
    fileKey: fileKey ?? "",
  }, {
    enabled: !!fileKey // Only run the query if imageKey is present
  });

  const { mutate: updateUserInfo, isPending: isUpdating } = api.user.updateUserInfo.useMutation({
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
      alert("Profile updated successfully!");
    }
  });

  useEffect(() => {
    if (url) {
      setPreview(url);
    } else if (sessionData?.user?.image) {
      setPreview(sessionData.user.image)
    }
  }, [sessionData, url]);

  if (!sessionData) {
    return <div>You must be logged in</div>;
  }


  const { user } = sessionData;

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.[0]) return;
    setImage(files[0]);
    readImageFile(files[0]);
  }

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreview(event.target?.result);
      }
    };
    reader.readAsDataURL(file); // Reads the file as a data URL.
  };

  const handleSubmit = async () => {
    try {

      if (image) {
        updateUserInfo({
          bio: bio,
          imageName: image.name
        });
      } else {
        updateUserInfo({
          bio: bio
        });
      }
    } catch (error) {
      console.error("Error updating image: ", error);
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md p-6 relative">
        <h1 className="font-bold text-2xl pb-6">User</h1>
        <h1 className="font-bold text-md pb-2">Username</h1>
        <div className="w-full border border-gray-300 rounded-md p-2 mb-6">
          {user.name}
        </div>
        <h1 className="font-bold text-md pb-2">Email</h1>
        <div className="w-full border border-gray-300 rounded-md p-2 mb-6">
          {user.email}
        </div>
        <h1 className="font-bold text-md pb-2">Bio</h1>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 mb-6"
          value={bio}
          placeholder="Write a bio!"
          onChange={(e) => setBio(e.target.value)}
        />
        <h1 className="font-bold text-md pb-2">Profile Image</h1>
        <div className="flex justify-start gap-4 w-full">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={/* TODO: getPresignedURl for imageKey here ?? */(preview as string)}
            alt="Preview Image" />
          <div className="grow border border-gray-300 rounded-md p-2 mb-4">
            <input
              className="w-full"
              type="file"
              accept="image/*"
              onChange={handleImageInput}
            />
          </div>
        </div>
      </div>
      {/* TODO: ensure this only appears when user changes data: can do this with onKeyDown */}
      <div className="absolute h-24 bg-white w-full inset-x-0 bottom-0 p-6 border border-gray-200 rounded-md">
        {isUpdating ?
          <button
            className="flex justify-center p-2 w-full bg-blue-700 hover:bg-blue-800 font-bold text-white rounded-md"
          >
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
          :
          <button
            className="p-2 w-full bg-blue-700 hover:bg-blue-800 font-bold text-white rounded-md"
            onClick={handleSubmit}
          >
            Save Profile Information
          </button>
        }

      </div>
    </>
  );
}