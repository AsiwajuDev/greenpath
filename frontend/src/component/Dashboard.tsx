import React, { useEffect, useState } from 'react';
import { IdeaCard } from './IdeaCard';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { useIdeaStore } from '../stores/ideaStore';
import { useAuthStore } from '../stores/authStore';

interface UserStats {
  totalIdeas: number;
  averageScore: number;
  highImpactIdeas: number;
  sustainabilityLevel: string;
}

export const Dashboard: React.FC = () => {
  const { ideas, subscribeToUserIdeas } = useIdeaStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToUserIdeas();
    return unsubscribe;
  }, [subscribeToUserIdeas]);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;

      try {
        setLoadingStats(true);
        const getUserStatsFunction = httpsCallable(functions, 'getUserStats');
        const result = await getUserStatsFunction({});
        setStats(result.data as UserStats);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to local calculation
        const averageScore =
          ideas.length > 0
            ? Math.round(
                ideas.reduce((sum, idea) => sum + idea.validationScore, 0) /
                  ideas.length
              )
            : 0;

        setStats({
          totalIdeas: ideas.length,
          averageScore,
          highImpactIdeas: ideas.filter((i) => i.validationScore >= 70).length,
          sustainabilityLevel: getSustainabilityLevel(averageScore),
        });
      } finally {
        setLoadingStats(false);
      }
    };

    loadUserStats();
  }, [user, ideas]);

  const getSustainabilityLevel = (score: number): string => {
    if (score >= 80) return 'Expert';
    if (score >= 60) return 'Advanced';
    if (score >= 40) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName}!
        </h1>
        <p className="text-gray-600">
          Track and manage your sustainable business ideas
        </p>
      </div>

      {loadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Ideas
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalIdeas}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Average Score
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.averageScore}/100
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                High Impact Ideas
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.highImpactIdeas}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Your Level
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.sustainabilityLevel}
              </p>
            </div>
          </div>
        )
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Sustainable Ideas
          </h2>
        </div>

        <div className="p-6">
          {ideas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No ideas yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by validating your first sustainable business idea
              </p>
              <a
                href="/validate"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Validate First Idea
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
