import { HeaderNavigation } from "@/components/shared/navbar/header";
import { QuickActions } from "@/components/shared/quick-actions";
import { useGetEmployee } from "@/hooks/employees.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
  const { employee } = await useGetEmployee();

  if (!employee) {
    return null;
  }

  return (
    <section>
      <HeaderNavigation />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {employee.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what you can do today as a {employee.role.role_name.toLowerCase()}.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <QuickActions employee={employee} />
        </div>

        {/* Dashboard Stats Placeholder */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your recent activities will appear here
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Key metrics and statistics
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Important updates and notifications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="bg-muted/50 min-h-[40vh] flex-1 rounded-xl p-6 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            
          </p>
        </div>
      </div>
    </section>
  );
}
