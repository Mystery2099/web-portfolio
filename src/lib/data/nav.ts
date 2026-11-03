import House from '@lucide/svelte/icons/house';
import LayoutGrid from '@lucide/svelte/icons/layout-grid';
import User from '@lucide/svelte/icons/user';
import Briefcase from '@lucide/svelte/icons/briefcase';
import Mail from '@lucide/svelte/icons/mail';
import type { Component } from 'svelte';

export interface NavItem {
	href: '/' | '/projects' | '/about' | '/experience' | '/contact';
	label: string;
	icon: Component;
	/** Extra search terms for the command palette. */
	keywords: string;
}

/** Shared by the floating dock, the classic rail, and the command palette. */
export const navItems: NavItem[] = [
	{ href: '/', label: 'Home', icon: House, keywords: 'start landing' },
	{ href: '/projects', label: 'Projects', icon: LayoutGrid, keywords: 'work portfolio' },
	{ href: '/about', label: 'About', icon: User, keywords: 'skills interests me' },
	{ href: '/experience', label: 'Experience', icon: Briefcase, keywords: 'education work help desk school' },
	{ href: '/contact', label: 'Contact', icon: Mail, keywords: 'email reach hire' }
];

/** Whether `href` is the active section for `pathname` (project detail pages light up "Projects"). */
export function isActive(href: string, pathname: string) {
	return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
}
