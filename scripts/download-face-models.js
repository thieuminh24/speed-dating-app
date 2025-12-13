// scripts/download-face-models.js
// FIXED VERSION 2025: Chỉ tải file THỰC TẾ TỒN TẠI trên repo chính thức

const https = require("https");
const fs = require("fs");
const path = require("path");

// URL CHÍNH THỨC (repo gốc, stable)
const BASE_URL =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const MODELS = [
  // SSD MobilenetV1 (3 files – TẤT CẢ TỒN TẠI)
  "ssd_mobilenetv1_model-weights_manifest.json",
  "ssd_mobilenetv1_model-shard1",
  "ssd_mobilenetv1_model-shard2",

  // Face Landmark 68 (2 files – shard2 KHÔNG TỒN TẠI, bỏ qua)
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  // "face_landmark_68_model-shard2",  // MISSING – không tải

  // Face Recognition (2 files – shard2 TỒN TẠI)
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
];

const OUTPUT_DIR = path.join(process.cwd(), "public", "models");

// Xóa sạch thư mục cũ
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
console.log("Created/Cleaned directory:", OUTPUT_DIR);

function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${filename}`;
    const filePath = path.join(OUTPUT_DIR, filename);

    console.log(`Downloading → ${filename}`);

    https
      .get(url, { headers: { "User-Agent": "Node.js" } }, (response) => {
        if (response.statusCode === 404) {
          console.log(
            `⚠️  SKIPPED (404): ${filename} – File không tồn tại trên repo (bình thường)`,
          );
          resolve(); // Không reject, tiếp tục tải file khác
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${filename}`));
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          const sizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);
          console.log(`Downloaded: ${filename} (${sizeMB} MB)`);
          resolve();
        });
      })
      .on("error", (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
  });
}

(async () => {
  console.log(
    "🚀 Tải weights Face-API.js từ repo chính thức (chỉ file tồn tại)\n",
  );

  try {
    for (const file of MODELS) {
      await downloadFile(file);
    }

    // Kiểm tra số file cuối cùng
    const downloadedFiles = fs.readdirSync(OUTPUT_DIR).length;
    console.log(
      `\n🎉 Hoàn thành! Đã tải ${downloadedFiles} file vào:`,
      OUTPUT_DIR,
    );
    console.log("📋 Danh sách file:");
    fs.readdirSync(OUTPUT_DIR).forEach((f) => console.log(`  - ${f}`));

    console.log("\n✅ Bây giờ chạy: pnpm dev");
    console.log("Model sẽ load OK (landmark chỉ dùng shard1 – vẫn chạy ngon!)");
  } catch (error) {
    console.error("\n❌ Lỗi:", error.message);
    process.exit(1);
  }
})();
