import { Suspense } from "react";
import { MaintenancePage } from "@/components/maintenance/MaintenancePage";

export default function Maintenance() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaintenancePage />
    </Suspense>
  );
}