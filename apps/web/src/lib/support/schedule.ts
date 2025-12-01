type ScheduleWindow = { start: number; end: number };

const SCHEDULE: Record<number, ScheduleWindow[]> = {
	0: [{ start: 7 * 60, end: 23 * 60 }],
	1: [{ start: 7 * 60, end: 23 * 60 }],
	2: [{ start: 7 * 60, end: 16 * 60 + 30 }],
	3: [{ start: 7 * 60, end: 23 * 60 }],
	4: [{ start: 7 * 60, end: 16 * 60 + 30 }],
	5: [{ start: 7 * 60, end: 23 * 60 }],
	6: [
		{ start: 7 * 60, end: 11 * 60 + 30 },
		{ start: 22 * 60, end: 23 * 60 },
	],
};

const DAY_MINUTES = 24 * 60;

const londonFormatter = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
	timeZone: "Europe/London",
});

function toLondonDate(date = new Date()) {
	const parts = londonFormatter.formatToParts(date);
	const getPart = (type: string) => {
		const part = parts.find((p) => p.type === type);
		return part ? Number(part.value) : 0;
	};

	const year = getPart("year");
	const month = getPart("month");
	const day = getPart("day");
	const hour = getPart("hour");
	const minute = getPart("minute");
	const second = getPart("second");

	const londonUtc = Date.UTC(year, month - 1, day, hour, minute, second);
	return new Date(londonUtc);
}
export function getLondonInfo(date?: Date) {
	const londonDate = toLondonDate(date);
	return {
		date: londonDate,
		day: londonDate.getDay(),
		minutes: minutesOfDay(londonDate),
	};
}

function minutesOfDay(date: Date) {
	return date.getHours() * 60 + date.getMinutes();
}

function getMinutesUntilNextWindow(day: number, minutes: number): number | null {
	for (let offset = 0; offset < 7; offset++) {
		const currentDay = (day + offset) % 7;
		const windows = (SCHEDULE[currentDay] ?? []).slice().sort(
			(a, b) => a.start - b.start
		);

		for (const window of windows) {
			if (offset === 0 && window.start <= minutes) {
				continue;
			}
			const dayMinutes = offset * DAY_MINUTES;
			return dayMinutes + window.start - minutes;
		}
	}

	return null;
}

export interface SupportAvailability {
	isOpen: boolean;
	minutesUntilNextWindow: number | null;
}

export function getSupportAvailability(date?: Date): SupportAvailability {
	const london = toLondonDate(date);
	const day = london.getDay();
	const minutes = minutesOfDay(london);
	const windows = SCHEDULE[day] ?? [];

	const isOpen = windows.some(
		(window) => minutes >= window.start && minutes < window.end
	);

	const minutesUntilNextWindow = isOpen
		? null
		: getMinutesUntilNextWindow(day, minutes);

	return { isOpen, minutesUntilNextWindow };
}

export function formatSupportWait(minutes: number | null): string | null {
	if (minutes == null) return null;
	if (minutes <= 60) {
		const minutesRounded = Math.ceil(minutes);
		return `${minutesRounded} minute${minutesRounded === 1 ? "" : "s"}`;
	}
	const hours = Math.ceil(minutes / 60);
	return `${hours} hour${hours === 1 ? "" : "s"}`;
}
