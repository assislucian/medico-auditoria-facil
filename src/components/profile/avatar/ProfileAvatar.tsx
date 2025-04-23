
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileAvatar } from "@/hooks/use-profile-avatar";

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

export const ProfileAvatar = ({ name, avatarUrl, onAvatarUpdate }: ProfileAvatarProps) => {
  const { uploading, handleAvatarChange } = useProfileAvatar();

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = await handleAvatarChange(event);
    if (url) {
      onAvatarUpdate(url);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : (
          <AvatarFallback className="text-lg">
            {getInitials(name)}
          </AvatarFallback>
        )}
      </Avatar>
      <label 
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
        <input
          id="avatar-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
};
