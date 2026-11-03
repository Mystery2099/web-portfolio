/** Personal details and external links used across the site. */
export const site = {
	name: 'Mathew Kennedy-Brewer',
	firstName: 'Mathew',
	role: 'Software Developer',
	location: 'Dundee, NY',
	school: 'Alfred State College',
	/** Live address, no trailing slash. Used for link previews, the sitemap and robots.txt. */
	url: 'https://happy-wave-00fed8810.2.azurestaticapps.net',
	email: 'mathewkennedy.dev@proton.me',
	github: {
		user: 'Mystery2099',
		url: 'https://github.com/Mystery2099'
	},
	/** Owners whose public repos feed the "Recently updated" list. */
	githubOwners: [
		{ name: 'Mystery2099', kind: 'users' },
		{ name: 'The-Mystora-Project', kind: 'orgs' }
	] as const,
	/** Hosted résumé page. */
	resumeUrl: 'https://red-dune-019d25210.1.azurestaticapps.net/',
	/**
	 * Downloadable PDF, e.g. '/resume.pdf' after adding `static/resume.pdf`.
	 * Set to `undefined` to hide download buttons.
	 */
	resumePdf: '/Mathew_Kennedy-Brewer_Resume.pdf' as string | undefined,
	/** Set once you have a public profile. Cards linking here are hidden while undefined. */
	linkedin: 'https://www.linkedin.com/in/mathew-kennedy-brewer-183769439/' as string | undefined,
	description:
		"Mathew Kennedy-Brewer is an Application Software Development student building practical software, developer tools, web apps and Minecraft mods.",
	year: 2026
};
