import { ExtendedModel } from "@/data/types";

export interface ChartPoint {
    id: string;
    name: string;
    date: number;
    score: number;
    provider: {
        name: string;
        provider_id: string;
    };
    isAnnouncedOnly: boolean;
    isReleased: boolean;
    originalDate?: number;
    isSota?: boolean;
    rd?: number; // Rating deviation for error bars (Glicko only)
}

export interface TrendPoint extends ChartPoint {
    isSota: boolean;
}

export const processModelData = (
    models: ExtendedModel[],
    scoringType: "gpqa" | "glicko"
): ChartPoint[] => {
    const points = models
        .filter((model) => {
            if (scoringType === "gpqa") {
                const gpqaScore = model.benchmark_results?.find(
                    (metric) => metric.benchmark_id.toLowerCase() === "gpqa-diamond"
                )?.score;
                return !!gpqaScore && !!(model.release_date || model.announced_date);
            } else {
                // Check for minimum of 3 benchmarks for Glicko scoring
                const hasEnoughBenchmarks = model.benchmark_results && model.benchmark_results.length >= 3;

                const hasGlicko =
                    model.glickoRating &&
                    typeof model.glickoRating.rating === "number" &&
                    !isNaN(model.glickoRating.rating);
                const dateToUse = model.release_date || model.announced_date;
                const hasValidDate =
                    !!dateToUse && !isNaN(new Date(dateToUse).getTime());
                return hasGlicko && hasValidDate && hasEnoughBenchmarks;
            }
        })
        .map((model) => {
            let normalizedScore: number;
            let rd: number | undefined = undefined;

            if (scoringType === "gpqa") {
                const gpqaMetric = model.benchmark_results?.find(
                    (metric) => metric.benchmark_id.toLowerCase() === "gpqa-diamond"
                );
                const rawScore = gpqaMetric ? gpqaMetric.score : 0;
                const scoreText =
                    typeof rawScore === "string"
                        ? rawScore
                        : rawScore.toString();
                const numericValue = parseFloat(scoreText.replace("%", ""));
                normalizedScore = scoreText.includes("%")
                    ? numericValue
                    : numericValue * 100;
            } else {
                normalizedScore = model.glickoRating?.rating ?? 0;
                rd = model.glickoRating?.rd;
            }

            const dateToUse = model.release_date || model.announced_date;
            if (!dateToUse || isNaN(new Date(dateToUse).getTime())) {
                return null;
            }

            const dateValue = new Date(dateToUse).getTime();
            const isAnnouncedOnly = !model.release_date && !!model.announced_date;

            return {
                id: model.id,
                name: model.name,
                date: dateValue,
                score: Number(normalizedScore.toFixed(2)),
                provider: {
                    name: model.provider.name,
                    provider_id: model.provider.provider_id,
                },
                isAnnouncedOnly,
                isReleased: !!model.release_date,
                ...(rd !== undefined ? { rd } : {}), // Only add rd if defined
            };
        })
        .filter((d): d is ChartPoint => d !== null);
    return points.sort((a, b) => a.date - b.date);
};

export const generateTrendLineData = (chartData: ChartPoint[]): TrendPoint[] => {
    return chartData
        .filter((model) => !model.isAnnouncedOnly)
        .reduce((acc: TrendPoint[], current) => {
            const currentDate = new Date(current.date).setHours(0, 0, 0, 0);
            const lastPoint = acc[acc.length - 1];
            const lastDate = lastPoint
                ? new Date(lastPoint.date).setHours(0, 0, 0, 0)
                : null;

            if (!lastPoint || (lastDate !== null && currentDate > lastDate)) {
                if (!lastPoint || current.score > lastPoint.score) {
                    return [...acc, { ...current, isSota: true }];
                } else {
                    return [
                        ...acc,
                        {
                            date: current.date,
                            score: lastPoint.score,
                            isSota: false,
                            name: lastPoint.name,
                            provider: lastPoint.provider,
                            id: lastPoint.id,
                            isAnnouncedOnly: lastPoint.isAnnouncedOnly,
                            isReleased: lastPoint.isReleased,
                            originalDate: lastPoint.originalDate
                        },
                    ];
                }
            } else if (lastDate !== null && currentDate === lastDate) {
                if (current.score > lastPoint.score) {
                    return [...acc.slice(0, -1), { ...current, isSota: true }];
                }
                return acc;
            }
            return acc;
        }, []);
};

export const transformDataToCondensed = (
    chartData: ChartPoint[],
    dateToIndexMap: Map<number, number>
): ChartPoint[] => {
    return chartData.map((point) => {
        const date = new Date(point.date);
        date.setHours(0, 0, 0, 0);
        return {
            ...point,
            originalDate: point.date,
            date: dateToIndexMap.get(date.getTime()) || 0,
        };
    });
};

export const createDateToIndexMap = (chartData: ChartPoint[]): Map<number, number> => {
    const dateToIndexMap = new Map();
    const uniqueDates = Array.from(
        new Set(
            chartData.map((d) => {
                const date = new Date(d.date);
                date.setHours(0, 0, 0, 0);
                return date.getTime();
            })
        )
    ).sort((a, b) => a - b);
    uniqueDates.forEach((date, index) => {
        dateToIndexMap.set(date, index);
    });
    return dateToIndexMap;
};

export const filterDataForMobile = (
    chartData: ChartPoint[],
    trendLineData: TrendPoint[],
    isToScale: boolean
): ChartPoint[] => {
    const jan2022Timestamp = new Date("2022-01-01").getTime();

    return chartData.filter((point) => {
        const originalDate = "originalDate" in point ? point.originalDate || point.date : point.date;
        const dateToCheck = isToScale ? point.date : originalDate;
        return (
            dateToCheck >= jan2022Timestamp &&
            trendLineData.some(
                (trendPoint) =>
                    trendPoint.date === point.date &&
                    trendPoint.isSota &&
                    trendPoint.name === point.name
            )
        );
    });
};

export const filterTrendLineForMobile = (
    trendLineData: TrendPoint[],
    isToScale: boolean
): TrendPoint[] => {
    const jan2022Timestamp = new Date("2022-01-01").getTime();

    return trendLineData.filter((point) => {
        const originalDate = "originalDate" in point ? point.originalDate || point.date : point.date;
        const dateToCheck = isToScale ? point.date : originalDate;
        return point.isSota && dateToCheck >= jan2022Timestamp;
    });
};

export const calculateTickValues = (
    chartData: ChartPoint[],
    isToScale: boolean,
    isMobile: boolean
): number[] => {
    const start = new Date(Math.min(...chartData.map((d) => d.date)));
    const end = new Date(Math.max(...chartData.map((d) => d.date)));

    if (isToScale) {
        const ticks = [];
        const current = new Date(start);
        current.setDate(1);
        const monthIncrement = isMobile ? 6 : 1;
        while (current <= end) {
            ticks.push(current.getTime());
            current.setMonth(current.getMonth() + monthIncrement);
        }
        return ticks;
    } else {
        const modelDates = chartData.map((d) => {
            const date = new Date(d.date);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        });
        const allUniqueDates = Array.from(new Set(modelDates)).sort(
            (a, b) => a - b
        );
        if (isMobile) {
            return allUniqueDates.filter((_, index) => index % 2 === 0);
        } else {
            return allUniqueDates;
        }
    }
};

export const getModelsForProvider = (
    providerId: string,
    allChartData: ChartPoint[]
): string[] => {
    return allChartData
        .filter((d) => d.provider.provider_id === providerId)
        .map((d) => d.name);
};
