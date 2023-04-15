export interface NavTab {
	name: string;
	current: boolean;
	icon?: any;
	href?: string;
}

export interface NestedTab extends NavTab {
	children: {
		[key: string]: NavTab | NestedTab;
	};
}

interface MainNavTab extends NavTab {
	icon: any;
	children?: any;
}

export interface FeatureDiscoveryItem {
	id: string;
	name: string;
	description: string;
}

export interface SiteConfig {
	siteName: string;
	domain: string;
	developer: string;
	productBrand: string;
	contactEmail: string;
	slogan?: string;
	description?: string;

	mainNavTabs: MainNavTab[];
	redirectUrls: {
		dropbox: string;
		google: string;
	};

	featureDiscovery: {
		emailImageResults: FeatureDiscoveryItem;
		googleDriveImports: FeatureDiscoveryItem;
	};
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
	return config;
};
