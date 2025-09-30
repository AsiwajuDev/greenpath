import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Firestore database reference
const db = admin.firestore();

// Define proper TypeScript interfaces
interface IdeaValidationRequest {
  title: string;
  description: string;
  targetMarket?: string;
  innovationLevel?: string;
}

interface ValidationResult {
  score: number;
  confidence: number;
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  sdgAlignment: number[];
}

interface BusinessIdea {
  validationScore?: number;
  userId?: string;
  [key: string]: any;
}

// Cloud Function for idea validation
export const validateIdea = functions.https.onCall(
  async (
    data: IdeaValidationRequest,
    context: functions.https.CallableContext
  ) => {
    // Check if user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { title, description, targetMarket, innovationLevel } = data;

    if (!title || !description) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Title and description are required'
      );
    }

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Enhanced validation logic
      const sustainabilityKeywords = [
        'renewable',
        'sustainable',
        'green',
        'eco',
        'carbon',
        'zero waste',
        'circular',
        'biodegradable',
        'organic',
        'clean energy',
        'recycling',
        'climate',
        'emission',
        'conservation',
        'biodiversity',
      ];

      const sdgKeywords = [
        { sdg: 7, keywords: ['energy', 'renewable', 'solar', 'wind'] },
        { sdg: 11, keywords: ['city', 'urban', 'community', 'transport'] },
        {
          sdg: 12,
          keywords: ['consumption', 'production', 'waste', 'recycle'],
        },
        {
          sdg: 13,
          keywords: ['climate', 'carbon', 'emission', 'global warming'],
        },
      ];

      const text = `${title} ${description}`.toLowerCase();
      const keywordMatches = sustainabilityKeywords.filter((keyword) =>
        text.includes(keyword.toLowerCase())
      );

      // Calculate SDG alignment
      const sdgAlignment = sdgKeywords
        .filter(({ keywords }) => keywords.some((kw) => text.includes(kw)))
        .map(({ sdg }) => sdg);

      // Base score calculation
      const baseScore = Math.min(70 + keywordMatches.length * 6, 95);
      const randomVariation = Math.random() * 20 - 10;
      const finalScore = Math.max(
        30,
        Math.min(100, baseScore + randomVariation)
      );

      const risks = [
        'Market competition in sustainable sector',
        'Regulatory compliance challenges',
        'Higher initial production costs',
        'Consumer education requirements',
        'Supply chain sustainability verification',
      ].slice(0, 2 + Math.floor(Math.random() * 2));

      const opportunities = [
        'Growing demand for sustainable products',
        'Government incentives and grants available',
        'Positive brand perception and marketing advantages',
        'Long-term cost savings through efficiency',
        'Access to green financing options',
      ].slice(0, 2 + Math.floor(Math.random() * 2));

      const validationResult: ValidationResult = {
        score: Math.round(finalScore),
        confidence: 80 + Math.random() * 20,
        risks,
        opportunities,
        recommendations: [
          'Conduct thorough market research in your target region',
          'Develop a detailed sustainability impact report',
          'Explore partnership opportunities with local environmental organizations',
          'Investigate available government grants and incentives',
        ],
        sdgAlignment: sdgAlignment.length > 0 ? sdgAlignment : [7, 11, 13],
      };

      // Log the validation request
      await db.collection('validationLogs').add({
        userId: context.auth.uid,
        ideaTitle: title,
        validationResult,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return validationResult;
    } catch (error) {
      console.error('Validation error:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Validation process failed'
      );
    }
  }
);

// Cloud Function to get user statistics
export const getUserStats = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    try {
      const userId = context.auth.uid;

      // Get user's ideas
      const ideasSnapshot = await db
        .collection('ideas')
        .where('userId', '==', userId)
        .get();

      const ideas = ideasSnapshot.docs.map((doc) => doc.data() as BusinessIdea);

      const totalIdeas = ideas.length;
      const averageScore =
        ideas.length > 0
          ? Math.round(
              ideas.reduce(
                (sum: number, idea: BusinessIdea) =>
                  sum + (idea.validationScore || 0),
                0
              ) / ideas.length
            )
          : 0;

      const highImpactIdeas = ideas.filter(
        (idea: BusinessIdea) => (idea.validationScore || 0) >= 70
      ).length;

      return {
        totalIdeas,
        averageScore,
        highImpactIdeas,
        sustainabilityLevel: getSustainabilityLevel(averageScore),
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get user statistics'
      );
    }
  }
);

function getSustainabilityLevel(score: number): string {
  if (score >= 80) return 'Expert';
  if (score >= 60) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  return 'Beginner';
}

// Test function to verify emulator connectivity
export const testConnection = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    return {
      message: 'Firebase Functions are working!',
      timestamp: new Date().toISOString(),
      userId: context.auth?.uid || 'unauthenticated',
    };
  }
);
