import { fetchLatestRelease, fetchRecentRepos, fetchRepo } from './api';

/** Query option factories, so components share cache keys and settings. */
export const githubQueries = {
	recent: () => ({
		queryKey: ['github', 'recent'] as const,
		queryFn: () => fetchRecentRepos(5)
	}),
	repo: (fullName: string) => ({
		queryKey: ['github', 'repo', fullName] as const,
		queryFn: () => fetchRepo(fullName)
	}),
	release: (fullName: string) => ({
		queryKey: ['github', 'release', fullName] as const,
		queryFn: () => fetchLatestRelease(fullName)
	})
};
