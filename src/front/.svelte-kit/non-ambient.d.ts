
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/about" | "/agriculture-land" | "/agriculture-land/[country]" | "/agriculture-land/[country]/[year]" | "/analytics" | "/analytics/agriculture-land" | "/analytics/agriculture-land/map" | "/integrations";
		RouteParams(): {
			"/agriculture-land/[country]": { country: string };
			"/agriculture-land/[country]/[year]": { country: string; year: string }
		};
		LayoutParams(): {
			"/": { country?: string | undefined; year?: string | undefined };
			"/about": Record<string, never>;
			"/agriculture-land": { country?: string | undefined; year?: string | undefined };
			"/agriculture-land/[country]": { country: string; year?: string | undefined };
			"/agriculture-land/[country]/[year]": { country: string; year: string };
			"/analytics": Record<string, never>;
			"/analytics/agriculture-land": Record<string, never>;
			"/analytics/agriculture-land/map": Record<string, never>;
			"/integrations": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/agriculture-land" | `/agriculture-land/${string}/${string}` & {} | "/analytics/agriculture-land" | "/analytics/agriculture-land/map" | "/integrations";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}