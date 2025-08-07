import { fetchAggregateData } from "@/lib/fetchData";
import HeaderClient from "./HeaderClient";

export default async function Header() {
	// Fetch data server-side
	const aggregateData = await fetchAggregateData();
	return <HeaderClient aggregateData={aggregateData} />;
}
