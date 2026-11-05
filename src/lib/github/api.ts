import { site } from '#lib/data/site.ts';

/** Root of GitHub's REST API. */
const GITHUB_API_BASE_URL = 'https://api.github.com';

/** Media type GitHub recommends for REST requests. */
const GITHUB_ACCEPT_HEADER = 'application/vnd.github+json';

/** How many repositories to request per owner before merging and sorting. */
const REPOSITORIES_PER_OWNER = 20;

/** A public GitHub repository, reduced to the fields the site displays. */
export interface Repository {
	name: string;
	/** `owner/name`, e.g. `Mystery2099/happycms`. */
	fullName: string;
	url: string;
	description: string | null;
	/** Primary language as detected by GitHub, or `null` when it has none. */
	language: string | null;
	stars: number;
	/** ISO 8601 timestamp of the most recent push. */
	pushedAt: string;
	isFork: boolean;
	isArchived: boolean;
}

/** A published GitHub release. */
export interface Release {
	/** The release title, falling back to its tag when the title is empty. */
	name: string;
	tag: string;
	url: string;
	/** ISO 8601 timestamp of publication. */
	publishedAt: string;
}

/** Repository as returned by the GitHub API (snake_case). */
interface GitHubRepositoryResponse {
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

/** Release as returned by the GitHub API (snake_case). */
interface GitHubReleaseResponse {
	name: string | null;
	tag_name: string;
	html_url: string;
	published_at: string;
}

/**
 * Sends a GET request to the GitHub API and parses the JSON body.
 *
 * @param path API path starting with `/`, e.g. `/repos/owner/name`.
 * @returns The parsed body, or `null` when GitHub answers 404.
 * @throws Error when GitHub answers with any other non-success status.
 */
async function fetchFromGitHub<T>(path: string): Promise<T | null> {
	const response = await fetch(GITHUB_API_BASE_URL + path, { headers: { Accept: GITHUB_ACCEPT_HEADER } });
	if (response.status === 404) {
		return null;
	}
	if (!response.ok) {
		throw new Error(`GitHub responded ${response.status} for ${path}`);
	}
	return (await response.json()) as T;
}

/**
 * Like {@link fetchFromGitHub}, but treats a missing resource as an error.
 *
 * @throws Error when the resource does not exist or the request fails.
 */
async function fetchRequiredFromGitHub<T>(path: string): Promise<T> {
	const body = await fetchFromGitHub<T>(path);
	if (body === null) {
		throw new Error(`GitHub has nothing at ${path}`);
	}
	return body;
}

/** Converts an API response into the site's {@link Repository} shape. */
function toRepository(response: GitHubRepositoryResponse): Repository {
	return {
		name: response.name,
		fullName: response.full_name,
		url: response.html_url,
		description: response.description,
		language: response.language,
		stars: response.stargazers_count,
		pushedAt: response.pushed_at,
		isFork: response.fork,
		isArchived: response.archived
	};
}

/** Whether a repository is worth listing: public, original, and still maintained. */
function isListable(response: GitHubRepositoryResponse): boolean {
	return !response.fork && !response.private && !response.archived;
}

/**
 * Fetches the most recently pushed repositories across every owner in
 * {@link site.githubOwners}. One owner failing does not hide the others.
 *
 * @param limit Maximum number of repositories to return.
 * @returns Public, non-fork, non-archived repositories, newest push first.
 * @throws The first owner's error when no owner could be fetched.
 */
export async function fetchRecentRepositories(limit = 5): Promise<Repository[]> {
	const ownerResults = await Promise.allSettled(
		site.githubOwners.map((owner) =>
			fetchRequiredFromGitHub<GitHubRepositoryResponse[]>(
				`/${owner.kind}/${owner.name}/repos?sort=pushed&per_page=${REPOSITORIES_PER_OWNER}&type=public`
			)
		)
	);
	const responses = ownerResults.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
	if (responses.length === 0) {
		const failure = ownerResults.find((result) => result.status === 'rejected');
		throw failure?.reason ?? new Error('No repositories found');
	}
	return responses
		.filter(isListable)
		.map(toRepository)
		.sort((first, second) => Date.parse(second.pushedAt) - Date.parse(first.pushedAt))
		.slice(0, limit);
}

/**
 * Fetches a single repository.
 *
 * @param fullName `owner/name` of the repository.
 * @throws Error when the repository does not exist or the request fails.
 */
export async function fetchRepository(fullName: string): Promise<Repository> {
	return toRepository(await fetchRequiredFromGitHub<GitHubRepositoryResponse>(`/repos/${fullName}`));
}

/**
 * Fetches the latest published release of a repository.
 *
 * @param fullName `owner/name` of the repository.
 * @returns The release, or `null` when the repository has never published one.
 */
export async function fetchLatestRelease(fullName: string): Promise<Release | null> {
	const response = await fetchFromGitHub<GitHubReleaseResponse>(`/repos/${fullName}/releases/latest`);
	if (response === null) {
		return null;
	}
	return {
		name: response.name || response.tag_name,
		tag: response.tag_name,
		url: response.html_url,
		publishedAt: response.published_at
	};
}
