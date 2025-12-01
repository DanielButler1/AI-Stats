export type SearchResultType =
    | "model"
    | "organisation"
    | "benchmark"
    | "api-provider"
    | "plan"
    | "country"
    | "compare"
    | "page";

export type SearchItemIcon = SearchResultType | "quick" | "trending" | "recent";

export type SearchResultItem = {
    id: string;
    title: string;
    subtitle?: string | null;
    href: string;
    icon: SearchItemIcon;
    badge?: string;
    logoId?: string;
    flagIso?: string;
    leftLogoId?: string;
    rightLogoId?: string;
};

export type ResultGroup = {
    type: string;
    label: string;
    items: SearchResultItem[];
};

export type ApiSearchItem = Omit<SearchResultItem, "icon"> & {
    icon: SearchResultType;
};

export type ApiSearchGroup = {
    type: SearchResultType;
    label: string;
    items: ApiSearchItem[];
};

export type ApiSearchResponse = {
    groups: ApiSearchGroup[];
};

export type Props = {
    className?: string;
};