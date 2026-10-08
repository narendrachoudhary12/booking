import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

const dummyProfile = {
  name: "",
  last_name: "",
  email: "",
  phone: null,
  description: null,
  type: "",
  address: null,
  city: null,
  state: null,
  pincode: null,
  image: null,
};

export default function UserProfiles() {
  return (
    <>
      <PageMeta title="Profile" description="User Profile" />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserMetaCard profile={dummyProfile} />
          <UserInfoCard profile={dummyProfile} />
          <UserAddressCard profile={dummyProfile} />
        </div>
      </div>
    </>
  );
}