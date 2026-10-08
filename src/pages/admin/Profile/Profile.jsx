import React, { useEffect, useState } from 'react'
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserMetaCard from "../../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../../components/UserProfile/UserInfoCard";
import UserAddressCard from "../../../components/UserProfile/UserAddressCard";
import PageMeta from "../../../components/common/PageMeta";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://dhunobeats.com/api/admin/usersProfile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (result.status === true) {
          setProfile(result.data);
        } else {
          setError("Profile load karne mein problem hui");
        }
      } catch (err) {
        setError("API error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="py-10 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <>
      <PageMeta
        title="Profile | Admin Dashboard"
        description="Admin Profile page"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard profile={profile} />
          <UserInfoCard profile={profile} />
          <UserAddressCard profile={profile} />
        </div>
      </div>
    </>
  );
}

export default Profile;