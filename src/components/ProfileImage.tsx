const ProfileImage = (props: { image: string }) => {
  return (
    <img src={props.image} alt="profile image" className="w-8 h-8 rounded-full" />
  );
}

export default ProfileImage;