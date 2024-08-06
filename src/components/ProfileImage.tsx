import { type User } from "@prisma/client";

import { api } from "~/utils/api";

type UserImageProps = Omit<User, "emailVerified">;

const ProfileImage = (props: {
  user: UserImageProps,
  className: string,
}) => {
  // How we're gonna do this
  // If an imageKey exists, fetch it from the AWS bucket.
  // If no key exists, use default discord profile image
  let profilePictureURL = props.user.image;

  if (props.user.imageKey) {
    const { data: url } = api.aws.getPresignedURLGet.useQuery({
      fileKey: props.user.imageKey,
    });
    if (url)
      profilePictureURL = url;
  }

  return (
    <img
      src={profilePictureURL ? profilePictureURL : (props.user.image || "beach.jpg")}
      alt="profile image"
      className={"rounded-full " + props.className}
    />
  );
}

export default ProfileImage;