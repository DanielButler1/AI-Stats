import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { fetchAggregateData } from '@/lib/fetchData';

export const dynamic = 'force-static'; // required for output: 'export'

type SitemapItem = {
    url: string;
    lastModified: string;
    changefreq: 'daily' | 'weekly' | 'always' | 'hourly' | 'monthly' | 'yearly' | 'never';
    priority: number;
};

async function getAllModelSlugs(): Promise<string[]> {
    try {
        const models = await fetchAggregateData();
        return models.map((m: any) => m.id);
    } catch {
        return [];
    }
}

async function getAllProviderSlugs(): Promise<string[]> {
    const providersDir = path.join(process.cwd(), 'src/data/providers');
    const slugs: string[] = [];
    try {
        const providerFolders = await fs.readdir(providersDir);
        for (const folder of providerFolders) {
            const providerPath = path.join(providersDir, folder, 'provider.json');
            try {
                const content = await fs.readFile(providerPath, 'utf-8');
                const provider = JSON.parse(content);
                if (provider.provider_id) {
                    slugs.push(provider.provider_id);
                }
            } catch {
                // Skip folders without provider.json or invalid JSON
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
    return slugs;
}

async function getAllBenchmarkSlugs(): Promise<string[]> {
    const benchmarksDir = path.join(process.cwd(), 'src/data/benchmarks');
    const slugs: string[] = [];
    try {
        const benchmarkFolders = await fs.readdir(benchmarksDir);
        for (const folder of benchmarkFolders) {
            const benchmarkPath = path.join(benchmarksDir, folder, 'benchmark.json');
            try {
                const content = await fs.readFile(benchmarkPath, 'utf-8');
                const benchmark = JSON.parse(content);
                if (benchmark.id) {
                    slugs.push(benchmark.id);
                }
            } catch {
                // Skip folders without benchmark.json or invalid JSON
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
    return slugs;
}

async function getAllAPIProviderSlugs(): Promise<string[]> {
    const apiProvidersDir = path.join(process.cwd(), 'src/data/api_providers');
    const slugs: string[] = [];
    try {
        const providerFolders = await fs.readdir(apiProvidersDir);
        for (const folder of providerFolders) {
            const apiProviderPath = path.join(apiProvidersDir, folder, 'api_provider.json');
            try {
                const content = await fs.readFile(apiProviderPath, 'utf-8');
                const provider = JSON.parse(content);
                if (provider.api_provider_id) {
                    slugs.push(provider.api_provider_id);
                }
            } catch {
                // Skip folders without api_provider.json or invalid JSON
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
    return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.WEBSITE_URL || '';

    // Static routes
    const staticRoutes = [
        '/',
        '/models',
        '/providers',
        '/compare',
        '/contribute',
        '/contribute/benchmarks',
        '/contribute/prices',
        '/sources',
        '/benchmarks',
        '/prices'
    ];

    const staticItems: SitemapItem[] = staticRoutes.map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changefreq: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? 1.0 : 0.8
    }));

    // Dynamic slugs
    const [modelSlugs, providerSlugs, benchmarkSlugs, apiProviderSlugs] = await Promise.all([
        getAllModelSlugs(),
        getAllProviderSlugs(),
        getAllBenchmarkSlugs(),
        getAllAPIProviderSlugs()
    ]);

    const modelItems: SitemapItem[] = modelSlugs.map(slug => ({
        url: `${baseUrl}/models/${slug}`,
        lastModified: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
    }));

    const providerItems: SitemapItem[] = providerSlugs.map(id => ({
        url: `${baseUrl}/providers/${id}`,
        lastModified: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
    }));

    const benchmarkItems: SitemapItem[] = benchmarkSlugs.map(slug => ({
        url: `${baseUrl}/benchmarks/${slug}`,
        lastModified: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
    }));

    // Generate prices pages for API providers
    const apiProviderItems: SitemapItem[] = apiProviderSlugs.map(id => ({
        url: `${baseUrl}/prices/${id}`,
        lastModified: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
    }));

    // Generate prices/models pages for individual models
    const modelPricesItems: SitemapItem[] = modelSlugs.map(id => ({
        url: `${baseUrl}/prices/models/${id}`,
        lastModified: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
    }));

    return [
        ...staticItems,
        ...modelItems,
        ...providerItems,
        ...benchmarkItems,
        ...apiProviderItems,
        ...modelPricesItems
    ];
}