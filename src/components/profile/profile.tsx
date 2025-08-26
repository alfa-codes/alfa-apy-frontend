import { UserStats } from "./user-stats";
import { PortfolioDashboard } from "./portfolio-dashboard";
import { QuickActions } from "./quick-actions";
import { EventRecordsCard } from "../event-records/card";

export function Profile() {
  return (
    <div className="grid grid-cols-1 gap-8 min-w-[800px]">
      <UserStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Dashboard - занимает 2/3 ширины */}
        <div className="lg:col-span-2">
          <PortfolioDashboard />
        </div>
        
        {/* Quick Actions - занимает 1/3 ширины */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
      
      <EventRecordsCard />
    </div>
  );
}
