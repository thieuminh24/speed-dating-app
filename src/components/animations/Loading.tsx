import Lottie from "lottie-react";
import React from "react";
import LoadingMain from "../../../public/animations/Loading-3.json";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 bg-love-gradient">
      <Lottie
        animationData={LoadingMain}
        loop={true}
        style={{ width: "300px", height: "300px" }}
      />
    </div>
  );
};

export default Loading;
