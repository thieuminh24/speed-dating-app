import Image from "next/image";
import React, { useState } from "react";

const StepEnterLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setError(null);
        console.log("📍 Vị trí hiện tại:", latitude, longitude);
      },
      (err) => {
        setError("Không thể lấy vị trí: " + err.message);
      },
    );
  };
  return (
    <div className=" w-full max-w-md flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-semibold text-center">
        We need your location to show who’s nearby
      </h2>
      <p>
        You will need to grant Bumble access to your location so we can show you
        awesome bees in your area.
      </p>

      <Image
        src="/image/Location.png"
        alt="Couplix Logo"
        className="object-cover"
        priority
        width={180}
        height={38}
      />

      <button
        onClick={requestLocation}
        className="bg-rose-400 text-white font-medium px-6 py-2 rounded-full hover:bg-rose-500 transition"
      >
        Allow location access
      </button>
    </div>
  );
};

export default StepEnterLocation;
