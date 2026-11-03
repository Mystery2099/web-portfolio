// Types for the Markdown files under content/, which the Vite plugin in
// src/lib/content/plugin.ts turns into plain data modules.
declare module '#content/home.md' {
	export const intro: import('#lib/content/collections.ts').IntroContent['intro'];
}

declare module '#content/about.md' {
	type About = import('#lib/content/collections.ts').AboutContent;
	export const portrait: About['portrait'];
	export const skills: About['skills'];
	export const interests: About['interests'];
	export const intro: About['intro'];
	export const philosophy: About['philosophy'];
}

declare module '#content/experience.md' {
	type Experience = import('#lib/content/collections.ts').ExperienceContent;
	export const work: Experience['work'];
	export const education: Experience['education'];
	export const competitions: Experience['competitions'];
	export const certifications: Experience['certifications'];
	export const academic: Experience['academic'];
	export const intro: Experience['intro'];
}
