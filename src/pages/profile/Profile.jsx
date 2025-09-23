import MyPosts from "./MyPosts";
import ProfileHeader from "./ProfileHeader";

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader />
      <MyPosts />
    </div>
  );
}
