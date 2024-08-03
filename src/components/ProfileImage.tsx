import Image from "next/image";

const ProfileImage = (props: { image: string }) => {
  return (
    <img src={props.image} alt="profile image" width={32} height={32} className="rounded-full" />
  );
}

export default ProfileImage;