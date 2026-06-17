import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { LogoutConfirmModal } from "./profile/LogoutConfirmModal";
import { ProfileContentSections } from "./profile/ProfileContentSections";
import { ProfilePageHeader } from "./profile/ProfilePageHeader";
import { ProfileSidebar } from "./profile/ProfileSidebar";
import {
  PROFILE_IMAGE_STORAGE_KEY,
} from "./profile/profileData";
import { useAuthModal } from "../components/AuthContext";
import { clearLocalStorageExceptTheme } from "../utils/authStorage";

interface ProfilePageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ProfilePage({ isDark, toggleTheme }: ProfilePageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setIsAuthenticated } = useAuthModal();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem(PROFILE_IMAGE_STORAGE_KEY);

    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoError(null);
    setPhotoMessage(null);

    if (!file.type.startsWith("image/")) {
      setPhotoError("فقط فایل تصویری قابل انتخاب است.");
      event.target.value = "";
      return;
    }

    const maxAllowedSize = 4 * 1024 * 1024;

    if (file.size > maxAllowedSize) {
      setPhotoError("حداکثر حجم عکس باید کمتر از ۴ مگابایت باشد.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);

        localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, reader.result);

        setPhotoMessage("عکس پروفایل با موفقیت ذخیره شد.");
      }
    };

    reader.onerror = () => {
      setPhotoError("بارگذاری عکس انجام نشد. دوباره تلاش کنید.");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);

    setPhotoMessage("عکس پروفایل حذف شد.");
    setPhotoError(null);

    localStorage.removeItem(PROFILE_IMAGE_STORAGE_KEY);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    clearLocalStorageExceptTheme();
    setIsAuthenticated(false);

    setIsLogoutConfirmOpen(false);

    navigate("/");
  };

  return (
    <>
      <ProfilePageHeader isDark={isDark} toggleTheme={toggleTheme} />

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-7xl px-0 md:px-2 lg:px-6">
          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
            <ProfileSidebar
              fileInputRef={fileInputRef}
              handlePhotoChange={handlePhotoChange}
              handleRemovePhoto={handleRemovePhoto}
              handleUploadClick={handleUploadClick}
              onLogoutClick={() => setIsLogoutConfirmOpen(true)}
              photoError={photoError}
              photoMessage={photoMessage}
              profileImage={profileImage}
            />

            <ProfileContentSections />
          </div>
        </div>
      </section>
    </>
  );
}
