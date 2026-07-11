import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthModal } from "../components/AuthContext";
import { fetchCurrentUser, type CurrentUser } from "../data/currentUser";
import {
  fetchCurrentUserPropertyFiles,
  flattenApiPropertyFiles,
  getPropertyFileList,
} from "../data/propertyFiles";
import {
  clearLocalStorageExceptTheme,
  USER_NATIONAL_CODE_KEY,
} from "../utils/authStorage";
import { LogoutConfirmModal } from "./profile/LogoutConfirmModal";
import {
  ProfileContentSections,
  type ProfilePropertyItem,
} from "./profile/ProfileContentSections";
import { ProfilePageHeader } from "./profile/ProfilePageHeader";
import { ProfileSidebar } from "./profile/ProfileSidebar";

interface ProfilePageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const getTextValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value).trim();

const firstText = (...values: unknown[]) =>
  values.map(getTextValue).find(Boolean) ?? "";

const stripRenewalCodeFromTitle = (value: string) =>
  value.replace(/^[\s\d۰-۹٠-٩\-\/]+(?:\s*[-–—:]\s*)?/, "").trim();

function mapProfileProperty(item: any, index: number): ProfilePropertyItem {
  const usage = firstText(item.type, item.Type, item.usage, item.Usage);
  const title =
    stripRenewalCodeFromTitle(
      firstText(
        item.Text,
        item.text,
        item.title,
        item.Title,
        item.description,
        item.Description,
        item.tvItems?.[0]?.Text,
        item.TvItems?.[0]?.Text,
        usage,
      ),
    ) ||
    usage ||
    `ملک ${index + 1}`;

  return {
    id: String(item.shop ?? item.Shop ?? item.id ?? item.Id ?? index),
    title,
    usage,
  };
}

export function ProfilePage({ isDark, toggleTheme }: ProfilePageProps) {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthModal();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [currentUserError, setCurrentUserError] = useState<string | null>(null);
  const [profileProperties, setProfileProperties] = useState<
    ProfilePropertyItem[]
  >([]);
  const [profilePropertiesLoading, setProfilePropertiesLoading] =
    useState(false);
  const [profilePropertiesError, setProfilePropertiesError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      setCurrentUserLoading(true);
      setCurrentUserError(null);
      setProfilePropertiesError(null);

      try {
        const user = await fetchCurrentUser(controller.signal);
        if (controller.signal.aborted) return;

        setCurrentUser(user);
        setProfileImage(user.pictureUrl || null);

        if (user.nationalCode) {
          localStorage.setItem(USER_NATIONAL_CODE_KEY, user.nationalCode);
        }

        setProfilePropertiesLoading(true);
        try {
          const propertyResponse = await fetchCurrentUserPropertyFiles();
          if (controller.signal.aborted) return;

          const rawList = getPropertyFileList(propertyResponse);
          setProfileProperties(
            flattenApiPropertyFiles(rawList)
              .map(mapProfileProperty)
              .filter((item) => item.title),
          );
        } catch (error) {
          if (controller.signal.aborted) return;
          setProfilePropertiesError(
            error instanceof Error
              ? error.message
              : "دریافت املاک پروفایل ناموفق بود.",
          );
        } finally {
          if (!controller.signal.aborted) setProfilePropertiesLoading(false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setCurrentUserError(
          error instanceof Error
            ? error.message
            : "دریافت اطلاعات پروفایل ناموفق بود.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setCurrentUserLoading(false);
        }
      }
    };

    void loadProfile();
    return () => controller.abort();
  }, []);

  const currentUserFullName =
    currentUser &&
    (`${currentUser.name} ${currentUser.family}`.trim() ||
      currentUser.userName ||
      undefined);

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
              onLogoutClick={() => setIsLogoutConfirmOpen(true)}
              profileImage={profileImage}
              displayName={currentUserFullName || undefined}
            />

            <ProfileContentSections
              currentUser={currentUser}
              properties={profileProperties}
              propertiesLoading={profilePropertiesLoading}
              propertiesError={profilePropertiesError}
              isLoading={currentUserLoading}
              error={currentUserError}
            />
          </div>
        </div>
      </section>
    </>
  );
}
