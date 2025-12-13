// services/verification/verification.api.ts
import userService from "../config";

export type VerificationStatus = "none" | "pending" | "approved" | "rejected";

export interface VerificationStatusResponse {
  isPhotoVerified: boolean;
  verificationStatus: VerificationStatus;
  latestRequest: {
    _id: string;
    status: VerificationStatus;
    submittedAt: string;
    rejectionReason?: string;
    reviewedAt?: string;
  } | null;
}

export interface SubmitVerificationResponse {
  message: string;
  verificationId: string;
  status: VerificationStatus;
}

// ===== USER APIs =====

/**
 * Submit verification request with 3 photos
 */
export const submitVerification = async (data: {
  selfie: File;
  idCardFront: File;
  idCardBack: File;
}): Promise<SubmitVerificationResponse> => {
  const formData = new FormData();

  console.log("Preparing form data for submission...", data);
  formData.append("selfie", data.selfie);
  formData.append("idCardFront", data.idCardFront);
  formData.append("idCardBack", data.idCardBack);

  console.log("Submitting verification request...", formData);

  const response = await userService.post<SubmitVerificationResponse>(
    "/verification/submit",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * Get user's verification status
 */
export const getVerificationStatus =
  async (): Promise<VerificationStatusResponse> => {
    const response = await userService.get<VerificationStatusResponse>(
      "/verification/status",
    );
    return response.data;
  };

// ===== ADMIN APIs =====

export interface PendingVerification {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    photos: string[];
  };
  selfieUrl: string;
  idCardUrls: string[];
  status: VerificationStatus;
  submittedAt: string;
}

export interface VerificationDetail extends PendingVerification {
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
}

/**
 * Get all pending verifications (Admin only)
 */
export const getPendingVerifications = async (): Promise<
  PendingVerification[]
> => {
  const response = await userService.get<PendingVerification[]>(
    "/verification/admin/pending",
  );
  return response.data;
};

/**
 * Get verification detail (Admin only)
 */
export const getVerificationDetail = async (
  verificationId: string,
): Promise<VerificationDetail> => {
  const response = await userService.get<VerificationDetail>(
    `/verification/admin/${verificationId}`,
  );
  return response.data;
};

/**
 * Review verification (Admin only)
 */
export const reviewVerification = async (
  verificationId: string,
  data: {
    status: "approved" | "rejected";
    rejectionReason?: string;
  },
): Promise<{ message: string; verification: VerificationDetail }> => {
  const response = await userService.patch(
    `/verification/admin/${verificationId}/review`,
    data,
  );
  return response.data;
};

/**
 * Get all verifications with optional status filter (Admin only)
 */
export const getAllVerifications = async (
  status?: VerificationStatus,
): Promise<VerificationDetail[]> => {
  const params = status ? { status } : {};
  const response = await userService.get<VerificationDetail[]>(
    "/verification/admin/all",
    { params },
  );
  return response.data;
};
