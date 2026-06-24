
export const View = {
  LANDING: 'LANDING',
  DASHBOARD: 'DASHBOARD',
  ARCHIVE: 'ARCHIVE',
  ANALYTICS: 'ANALYTICS',
  COMPARISON: 'COMPARISON',
  AUDIT: 'AUDIT'
} as const;
export type View = typeof View[keyof typeof View];

export const PathologyType = {
  NORMAL: 'NO_FINDING',
  PNEUMONIA: 'PNEUMONIA',
  CARDIOMEGALY: 'CARDIOMEGALY',
  EFFUSION: 'EFFUSION',
  ATELECTASIS: 'ATELECTASIS',
  NODULE: 'NODULE'
} as const;
export type PathologyType = typeof PathologyType[keyof typeof PathologyType];

export const Severity = {
  MILD: 'MILD',
  MODERATE: 'MODERATE',
  SEVERE: 'SEVERE',
  NONE: 'N/A'
} as const;
export type Severity = typeof Severity[keyof typeof Severity];

export interface Prediction {
  label: PathologyType;
  confidence: number;
}

export interface AnalysisResult {
  predictions: Prediction[];
  severity: Severity;
  reasoning: string;
  detectedLobe?: string;
  riskProbability: number;
}

export interface DicomMetadata {
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  modality?: string;
  manufacturer?: string;
}

export interface DoctorReview {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string;
  reviewedBy: string;
  timestamp?: string;
}

export interface PatientDetails {
  name: string;
  age: string;
  gender: string;
  address: string;
  symptoms: string;
}

export interface PatientRecord {
  id: string;
  timestamp: string;
  image: string;
  result: AnalysisResult;
  metadata?: DicomMetadata;
  review?: DoctorReview;
  patientDetails?: PatientDetails;
}
