import Layout from "@/components/layout";
import React from "react";
import ProfileMenu from "./components/ProfileMenu";
import UpdateProfile from "./components/UpdateProfile";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";

const EditProfile = () => {
  return (
    <AuthGuard>
      <Layout
        asideChildren={<ProfileMenu />}
        mainChildren={<UpdateProfile />}
      ></Layout>
    </AuthGuard>
  );
};

export default EditProfile;
