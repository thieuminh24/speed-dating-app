import Layout from "@/components/layout";
import React from "react";
import ProfileMenu from "./components/ProfileMenu";
import UpdateProfile from "./components/UpdateProfile";

const EditProfile = () => {
  return (
    <Layout
      asideChildren={<ProfileMenu />}
      mainChildren={<UpdateProfile />}
    ></Layout>
  );
};

export default EditProfile;
