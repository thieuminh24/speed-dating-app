"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ModeSelectionPage = () => {
  const [mode, setMode] = useState("date");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">Choose a mode to get started</h2>
      <p className="text-gray-500 text-center max-w-md mb-6">
        Bumble’s for making all kinds of connections! You’ll be able to switch
        modes once you’re all set up.
      </p>

      {/* Mode options */}
      <RadioGroup
        value={mode}
        onValueChange={setMode}
        className="space-y-3 w-full max-w-sm"
      >
        {/* Date option */}
        <Card
          className={`cursor-pointer transition ${
            mode === "date" ? "bg-rose-400 text-white" : "bg-gray-100"
          }`}
          onClick={() => setMode("date")}
        >
          <CardContent className="px-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Date</p>
              <p
                className={`text-sm ${mode === "date" ? "text-white/90" : "text-gray-500"}`}
              >
                Find that spark in an empowered community
              </p>
            </div>
            <RadioGroupItem value="date" id="date" className="hidden" />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mode === "date" ? "border-white bg-white/30" : "border-gray-400"
              }`}
            >
              {mode === "date" && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* BFF option */}
        <Card
          className={`cursor-pointer transition ${
            mode === "bff"
              ? "bg-blue-100 border border-blue-300"
              : "bg-gray-100"
          }`}
          onClick={() => setMode("bff")}
        >
          <CardContent className="px-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Bff</p>
              <p className="text-sm text-gray-500">
                Make new friends at every stage of your life
              </p>
            </div>
            <RadioGroupItem value="bff" id="bff" className="hidden" />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mode === "bff" ? "border-blue-500" : "border-gray-400"
              }`}
            >
              {mode === "bff" && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      {/* Continue button */}
      <Button className="mt-6 bg-rose-400 hover:bg-rose-500 text-white">
        Continue with {mode === "date" ? "Date" : "BFF"}
      </Button>
    </div>
  );
};

export default ModeSelectionPage;
