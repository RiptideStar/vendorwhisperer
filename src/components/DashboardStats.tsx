
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Package, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    title: "Active Calls",
    value: "24",
    change: "+4.75%",
    icon: Phone,
  },
  {
    title: "Pending Orders",
    value: "12",
    change: "-1.25%",
    icon: Package,
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: "+1.2%",
    icon: TrendingUp,
  },
  {
    title: "Avg. Response Time",
    value: "1.2m",
    change: "-0.3m",
    icon: Clock,
  },
];

const DashboardStats = () => {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;
