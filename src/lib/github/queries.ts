import { fetchLatestRelease, fetchRecentRepositories, fetchRepository } from './api.ts';

/** How many repositories the "Recently updated" card shows. */
const RECENT_REPOSITORY_COUNT = 5;

/**
 * TanStack Query option factories for GitHub data. Components build their
 * queries from these so they share cache keys and fetch settings.
 */
export const githubQueries = {
	/** The most recently pushed repositories across all configured owners. */
	recentRepositories: () => ({
		queryKey: ['github', 'recent'] as const,
		queryFn: () => fetchRecentRepositories(RECENT_REPOSITORY_COUNT)
	}),

	/** @param fullName `owner/name` of the repository. */
	repository: (fullName: string) => ({
		queryKey: ['github', 'repo', fullName] as const,
		queryFn: () => fetchRepository(fullName)
	}),

	/** @param fullName `owner/name` of the repository. */
	latestRelease: (fullName: string) => ({
		queryKey: ['github', 'release', fullName] as const,
		queryFn: () => fetchLatestRelease(fullName)
	})
};
