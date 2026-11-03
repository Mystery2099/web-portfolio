import { site } from '#lib/data/site.ts';

const GITHUB_API_BASE_URL = 'https://api.github.com';

export interface Repo {
	name: string;
	fullName: string;
	url: string;
	description: string | null;
	language: string | null;
	stars: number;
	pushedAt: string;
	fork: boolean;
	archived: boolean;
}

export interface Release {
	name: string;
	tag: string;
	url: string;
	publishedAt: string;
}

interface ApiRepo {
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	pushed_at: string;
	fork: boolean;
	archived: boolean;
	private: boolean;
}

async function fetchGitHub<T>(path: string, fetchFn: typeof fetch = fetch): Promise<T> {
	const response = await fetchFn(GITHUB_API_BASE_URL + path, { headers: { Accept: 'application/vnd.github+json' } });
	if (!response.ok) {
		throw new Error(`GitHub ${response.status} for ${path}`);
	}
	return response.json() as Promise<T>;
}

function toRepository(apiRepository: ApiRepo): Repo {
	return {
		name: apiRepository.name,
		fullName: apiRepository.full_name,
		url: apiRepository.html_url,
		description: apiRepository.description,
		language: apiRepository.language,
		stars: apiRepository.stargazers_count,
		pushedAt: apiRepository.pushed_at,
		fork: apiRepository.fork,
		archived: apiRepository.archived
	};
}

interface ApiRelease {
	name: string | null;
	tag_name: string;
	html_url: string;
	published_at: string;
}

/** Most recently pushed public, non-fork repos across every configured owner. */
export async function fetchRecentRepos(limit = 5): Promise<Repo[]> {
	const repositoryResults = await Promise.allSettled(
		site.githubOwners.map((owner) =>
			fetchGitHub<ApiRepo[]>(`/${owner.kind}/${owner.name}/repos?sort=pushed&per_page=20&type=public`)
		)
	);
	const repositories = repositoryResults.flatMap((result) =>
		result.status === 'fulfilled' ? result.value : []
	);
	if (repositories.length === 0) {
		const failure = repositoryResults.find((result) => result.status === 'rejected');
		throw failure?.reason ?? new Error('No repositories found');
	}
	return repositories
		.filter((repository) => !repository.fork && !repository.private && !repository.archived)
		.map(toRepository)
		.sort((first, second) => Date.parse(second.pushedAt) - Date.parse(first.pushedAt))
		.slice(0, limit);
}

export async function fetchRepo(fullName: string): Promise<Repo> {
	return toRepository(await fetchGitHub<ApiRepo>(`/repos/${fullName}`));
}

/** Latest published release, or `null` when the repo has none (GitHub answers 404). */
export async function fetchLatestRelease(fullName: string): Promise<Release | null> {
	const response = await fetch(`${GITHUB_API_BASE_URL}/repos/${fullName}/releases/latest`, {
		headers: { Accept: 'application/vnd.github+json' }
	});
	if (response.status === 404) {
		return null;
	}
	if (!response.ok) {
		throw new Error(`GitHub ${response.status}`);
	}
	const release = (await response.json()) as ApiRelease;
	return {
		name: release.name || release.tag_name,
		tag: release.tag_name,
		url: release.html_url,
		publishedAt: release.published_at
	};
}
