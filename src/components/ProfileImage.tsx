const ProfileImage = (props: {
  image: string,
  className: string,
}) => {
  return (
    <img
      src={props.image}
      alt="profile image"
      className={"rounded-full " + props.className}
    />
  );
}

export default ProfileImage;