export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  sustainabilityGoals: string[];
  targetMarket: string;
  innovationLevel: "Incremental" | "Transformative" | "Disruptive";
  validationScore: number;
  risks: string[];
  opportunities: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: "draft" | "validating" | "validated" | "implementing";
}

export interface ValidationResult {
  score: number;
  confidence: number;
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  sdgAlignment: number[];
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  subscription: "free" | "pro" | "enterprise";
}
