// services/verification/face-verification.service.ts
import * as faceapi from "face-api.js";

export interface FaceMatchResult {
  isMatch: boolean;
  confidence: number; // 0-100
  distance: number; // 0-1
  message: string;
}

export interface ImageQualityResult {
  isGoodQuality: boolean;
  issues: string[];
  score: number; // 0-100
  details: {
    resolution: { width: number; height: number; isGood: boolean };
    brightness: { value: number; isGood: boolean };
    blur: { value: number; isGood: boolean };
  };
}

export class FaceVerificationService {
  private modelsLoaded = false;
  private modelsPath = "/models"; // Public folder

  /**
   * Load Face-API.js models (chỉ cần load 1 lần)
   */
  async loadModels() {
    if (this.modelsLoaded) return;

    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(this.modelsPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(this.modelsPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(this.modelsPath),
      ]);
      this.modelsLoaded = true;
      console.log("✅ Face-API models loaded");
    } catch (error) {
      console.error("❌ Failed to load models:", error);
      throw new Error("Không thể tải mô hình AI. Vui lòng thử lại.");
    }
  }

  /**
   * So khớp 2 khuôn mặt
   */
  async matchFaces(
    selfieFile: File,
    idCardFile: File,
  ): Promise<FaceMatchResult> {
    await this.loadModels();

    console.log("Bắt đầu so khớp 2 ảnh...");

    const [selfieImg, idCardImg] = await Promise.all([
      this.loadImage(selfieFile),
      this.loadImage(idCardFile),
    ]);

    try {
      // Bước 1: Detect + lấy descriptor trực tiếp từ ảnh gốc (CÁCH MỚI & DUY NHẤT HOẠT ĐỘNG)
      const [selfieResult, idCardResult] = await Promise.all([
        faceapi
          .detectSingleFace(selfieImg, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor(),

        faceapi
          .detectSingleFace(idCardImg, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor(),
      ]);

      if (!selfieResult?.descriptor) {
        return {
          isMatch: false,
          confidence: 0,
          distance: 1,
          message: "Không tìm thấy khuôn mặt trong ảnh selfie",
        };
      }
      if (!idCardResult?.descriptor) {
        return {
          isMatch: false,
          confidence: 0,
          distance: 1,
          message: "Không tìm thấy khuôn mặt trong ảnh CCCD",
        };
      }

      // Bước 2: Tính khoảng cách
      const distance = faceapi.euclideanDistance(
        selfieResult.descriptor,
        idCardResult.descriptor,
      );
      const confidence = Math.round(
        Math.max(0, Math.min(100, (1 - distance) * 100)),
      );
      const isMatch = distance < 0.6;

      console.log(
        `So khớp thành công! Distance: ${distance.toFixed(3)} → Độ tin cậy: ${confidence}%`,
      );

      return {
        isMatch,
        confidence,
        distance,
        message: isMatch
          ? `Khớp thành công – Độ tin cậy ${confidence}%`
          : confidence >= 55
            ? `Gần giống (${confidence}%) – Nên kiểm tra thủ công`
            : `Không khớp (${confidence}%)`,
      };
    } catch (error: any) {
      console.error("Lỗi so khớp khuôn mặt:", error);
      return {
        isMatch: false,
        confidence: 0,
        distance: 1,
        message: "Lỗi AI: " + (error.message || "Không xác định"),
      };
    }
  }

  /**
   * Kiểm tra chất lượng ảnh
   */
  async checkImageQuality(file: File): Promise<ImageQualityResult> {
    console.log("🔍 [Quality Check] Start for:", file.name);

    const img = await this.loadImage(file);
    console.log("✅ [Quality Check] Image loaded:", img.width, "x", img.height);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!; // ← FIX WARNING

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    console.log("✅ [Quality Check] Canvas created");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    console.log(
      "✅ [Quality Check] ImageData extracted:",
      data.length,
      "bytes",
    );

    // 1. Check resolution
    console.log("🔍 [Quality Check] Checking resolution...");
    const minResolution = 800;
    const resolutionGood =
      img.width >= minResolution && img.height >= minResolution;
    console.log(
      "📏 [Quality Check] Resolution:",
      resolutionGood ? "GOOD" : "BAD",
    );

    // 2. Check brightness (average RGB)
    console.log("🔍 [Quality Check] Checking brightness...");
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += (r + g + b) / 3;
    }
    const avgBrightness = totalBrightness / (data.length / 4);
    const brightnessGood = avgBrightness > 50 && avgBrightness < 220;
    console.log(
      "💡 [Quality Check] Brightness:",
      avgBrightness.toFixed(2),
      brightnessGood ? "GOOD" : "BAD",
    );

    // 3. Check blur (Laplacian variance)
    console.log("🔍 [Quality Check] Checking blur...");
    const blurValue = this.calculateBlur(canvas);
    const blurGood = blurValue > 1.0; // ← LOWERED from 100 (ảnh mobile thường < 10)
    console.log(
      "📷 [Quality Check] Blur value:",
      blurValue.toFixed(2),
      blurGood ? "SHARP" : "BLURRY",
    );

    // Collect issues
    const issues: string[] = [];
    if (!resolutionGood) {
      issues.push(
        `Độ phân giải thấp (${img.width}x${img.height}). Nên >= ${minResolution}px`,
      );
    }
    if (!brightnessGood) {
      issues.push(avgBrightness < 50 ? "Ảnh quá tối" : "Ảnh quá sáng (bị lóa)");
    }
    if (!blurGood) {
      issues.push("Ảnh bị mờ. Vui lòng chụp lại");
    }

    // Calculate overall score
    const score = Math.round(
      (resolutionGood ? 40 : 0) +
        (brightnessGood
          ? 30
          : avgBrightness > 30 && avgBrightness < 240
            ? 20
            : 0) +
        (blurGood ? 30 : blurValue > 0.5 ? 20 : 0), // ← Partial credit nếu blur > 0.5
    );

    console.log("✅ [Quality Check] Complete! Score:", score, "%");
    console.log("📊 [Quality Check] Issues:", issues.length);

    return {
      isGoodQuality: issues.length === 0,
      issues,
      score,
      details: {
        resolution: {
          width: img.width,
          height: img.height,
          isGood: resolutionGood,
        },
        brightness: {
          value: Math.round(avgBrightness),
          isGood: brightnessGood,
        },
        blur: { value: Math.round(blurValue), isGood: blurGood },
      },
    };
  }

  /**
   * Calculate blur using Laplacian variance
   */
  private calculateBlur(canvas: HTMLCanvasElement): number {
    console.log("🔍 [Blur Calc] Start");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!; // ← FIX WARNING
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and calculate Laplacian
    const gray: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
    console.log("✅ [Blur Calc] Grayscale conversion done");

    // Simple Laplacian (approximation)
    let variance = 0;
    const w = canvas.width;
    const h = canvas.height;

    console.log("🔍 [Blur Calc] Computing Laplacian for", w, "x", h, "pixels");

    // ⚠️ OPTIMIZATION: Chỉ tính cho sample pixels nếu ảnh quá lớn
    const sampleRate = w * h > 1000000 ? 4 : 1; // Sample 1/4 pixels nếu > 1MP

    for (let y = 1; y < h - 1; y += sampleRate) {
      for (let x = 1; x < w - 1; x += sampleRate) {
        const idx = y * w + x;
        const laplacian = Math.abs(
          4 * gray[idx] -
            gray[idx - 1] -
            gray[idx + 1] -
            gray[idx - w] -
            gray[idx + w],
        );
        variance += laplacian * laplacian;
      }
    }

    const result = variance / (canvas.width * canvas.height);
    console.log("✅ [Blur Calc] Done! Variance:", result.toFixed(2));
    return result;
  }

  /**
   * Load image from File
   */
  private async loadImage(file: File): Promise<HTMLImageElement> {
    console.log("🔍 [Load Image] Loading:", file.name, file.size, "bytes");
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        console.log("✅ [Load Image] Success:", img.width, "x", img.height);
        URL.revokeObjectURL(img.src); // ← Cleanup
        resolve(img);
      };

      img.onerror = (err) => {
        console.error("❌ [Load Image] Failed:", err);
        URL.revokeObjectURL(img.src); // ← Cleanup
        reject(new Error("Không thể load ảnh: " + file.name));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extract face from image (for preview)
   */
  async extractFace(file: File): Promise<string | null> {
    await this.loadModels();
    const img = await this.loadImage(file);

    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks();

    if (!detection) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const box = detection.detection.box;
    const padding = 50;

    canvas.width = box.width + padding * 2;
    canvas.height = box.height + padding * 2;

    ctx.drawImage(
      img,
      box.x - padding,
      box.y - padding,
      box.width + padding * 2,
      box.height + padding * 2,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return canvas.toDataURL("image/jpeg", 0.9);
  }
}

// Singleton instance
export const faceVerificationService = new FaceVerificationService();
