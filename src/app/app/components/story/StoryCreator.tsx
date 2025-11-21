"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Type,
  Video,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { createTextStory, createVideoStory } from "@/services/story/story.api";
import {
  StoryType,
  TextAlign,
  GRADIENT_PRESETS,
  FONT_PRESETS,
} from "@/services/story/story.types";

export function StoryCreator({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<"select" | "text" | "video">("select");

  // Text story state
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textAlign, setTextAlign] = useState<TextAlign>(TextAlign.CENTER);
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(GRADIENT_PRESETS[0]);

  // Video story state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("video/")) {
      setError("Vui lòng chọn file video");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Video quá lớn (max 50MB)");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleCreateTextStory = async () => {
    if (!text.trim()) {
      setError("Vui lòng nhập nội dung");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTextStory({
        type: StoryType.TEXT,
        text,
        textColor,
        fontFamily,
        fontSize,
        textAlign,
        textBold,
        textItalic,
        backgroundColor,
      });
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideoStory = async () => {
    if (!videoFile) {
      setError("Vui lòng chọn video");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createVideoStory({ type: StoryType.VIDEO }, videoFile);
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "select") {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tạo Story</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode("text")}
                className="p-8 border-2 border-dashed rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all"
              >
                <Type className="w-12 h-12 mx-auto mb-3 text-pink-500" />
                <p className="font-semibold">Text Story</p>
              </button>

              <button
                onClick={() => setMode("video")}
                className="p-8 border-2 border-dashed rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <Video className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                <p className="font-semibold">Video Story</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "text") {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Preview */}
        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ background: backgroundColor }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập nội dung..."
            maxLength={500}
            className="bg-transparent border-none outline-none resize-none w-full max-w-lg text-center"
            style={{
              color: textColor,
              fontSize: `${fontSize}px`,
              fontFamily,
              textAlign,
              fontWeight: textBold ? "bold" : "normal",
              fontStyle: textItalic ? "italic" : "normal",
            }}
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 space-y-4">
          {/* Text controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setTextBold(!textBold)}
              className={`p-2 rounded ${textBold ? "bg-pink-500 text-white" : "bg-gray-100"}`}
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTextItalic(!textItalic)}
              className={`p-2 rounded ${textItalic ? "bg-pink-500 text-white" : "bg-gray-100"}`}
            >
              <Italic className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <button
              onClick={() => setTextAlign(TextAlign.LEFT)}
              className={`p-2 rounded ${textAlign === "left" ? "bg-pink-500 text-white" : "bg-gray-100"}`}
            >
              <AlignLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTextAlign(TextAlign.CENTER)}
              className={`p-2 rounded ${textAlign === "center" ? "bg-pink-500 text-white" : "bg-gray-100"}`}
            >
              <AlignCenter className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTextAlign(TextAlign.RIGHT)}
              className={`p-2 rounded ${textAlign === "right" ? "bg-pink-500 text-white" : "bg-gray-100"}`}
            >
              <AlignRight className="w-5 h-5" />
            </button>
          </div>

          {/* Font size */}
          <input
            type="range"
            min="16"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />

          {/* Fonts */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {FONT_PRESETS.map((font) => (
              <button
                key={font}
                onClick={() => setFontFamily(font)}
                className={`px-4 py-2 rounded whitespace-nowrap ${
                  fontFamily === font ? "bg-pink-500 text-white" : "bg-gray-100"
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex gap-2 items-center">
            <Palette className="w-5 h-5" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer"
            />
          </div>

          {/* Backgrounds */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {GRADIENT_PRESETS.map((gradient, i) => (
              <button
                key={i}
                onClick={() => setBackgroundColor(gradient)}
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg shrink-0"
                style={{ background: gradient }}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("select")}
              className="flex-1 py-3 rounded-lg font-semibold border border-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={handleCreateTextStory}
              disabled={loading || !text.trim()}
              className="flex-1 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Đăng"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Video mode
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
          <p className="text-white text-lg font-semibold">
            Đang tải video lên...
          </p>
          <p className="text-white/70 text-sm mt-2">
            Vui lòng đợi, không tắt trang
          </p>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-8">
        {videoPreview ? (
          <div className="relative w-full max-w-lg">
            <video
              src={videoPreview}
              controls
              className="w-full max-h-[70vh] rounded-lg"
              playsInline
            />
            {/* Change Video Button */}
            <label className="absolute bottom-4 right-4 cursor-pointer bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                disabled={loading}
              />
              <span className="text-sm font-semibold">Đổi video</span>
            </label>
          </div>
        ) : (
          <label className="cursor-pointer p-12 border-2 border-dashed border-white/30 rounded-xl hover:border-white/60 transition-all">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />
            <Video className="w-16 h-16 mx-auto mb-4 text-white" />
            <p className="text-white text-center font-semibold">Chọn video</p>
            <p className="text-white/70 text-center text-sm mt-2">
              MP4, MOV, AVI (max 50MB)
            </p>
          </label>
        )}
      </div>

      <div className="bg-white p-4">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setMode("select");
              setVideoFile(null);
              setVideoPreview(null);
              setError(null);
            }}
            disabled={loading}
            className="flex-1 py-3 rounded-lg font-semibold border border-gray-300 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateVideoStory}
            disabled={loading || !videoFile}
            className="flex-1 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tải...
              </span>
            ) : (
              "Đăng"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
