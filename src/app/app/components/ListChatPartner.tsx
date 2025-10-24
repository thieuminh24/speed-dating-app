import Image from "next/image";
import React from "react";

const ListChatPartner = () => {
  return (
    <>
      {" "}
      <div className="w-20 h-20 flex items-center justify-center mb-4 text-gray-400">
        <Image
          className="dark:invert"
          src="/image/SearchLove.png"
          alt="SearchLove"
          width={180}
          height={38}
          priority
        />
      </div>
      <p className="font-medium">Get your matches here</p>
      <p className="text-sm text-gray-500">
        Start discovering people to get matches.
      </p>
    </>
  );
};

export default ListChatPartner;
