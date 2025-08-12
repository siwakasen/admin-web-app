import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/interfaces";
import Link from "next/link";
import { 
  Car, 
  MapPin, 
  Receipt, 
  UserPlus, 
  Plus,
  Clock,
  Play,
  CheckCircle
} from "lucide-react";

interface QuickActionsProps {
  employee: Employee;
}

export function QuickActions({ employee }: QuickActionsProps) {
  // Role ID 1 = Owner (can create employees)
  // Role ID 2 = Admin (can create cars, travel-packages, expenses)
  
  const isOwner = employee.role.id === 1;
  const isAdmin = employee.role.id === 2;

  if (!isOwner && !isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Create Actions */}
      <div>
        <h3 className="text-md  font-semibold mb-4">Create New</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isAdmin && (
            <>
              {/* Create New Car */}
              <Link href="/cars/create">
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Car className="h-5 w-5 text-blue-600" />
                      Create New Car
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Add a new vehicle to your fleet
                    </p>
                    <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                      <Plus className="h-4 w-4" />
                      Add Car
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Create New Travel Package */}
              <Link href="/travel-packages/create">
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Create Travel Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Design a new travel experience
                    </p>
                    <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                      <Plus className="h-4 w-4" />
                      Add Package
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Create New Expense */}
              <Link href="/expenses/create">    
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Receipt className="h-5 w-5 text-orange-600" />
                      Create New Expense
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Record a business expense
                    </p>
                    <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                      <Plus className="h-4 w-4" />
                      Add Expense
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}

          {isOwner && (
            <>
              {/* Create New Employee */}
              <Link href="/employees/create">
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <UserPlus className="h-5 w-5 text-purple-600" />
                      Create New Employee
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Add a new team member
                    </p>
                    <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                      <Plus className="h-4 w-4" />
                      Add Employee
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Booking Status Overview - Admin Only */}
      {isAdmin && (
        <div>
          <h3 className="text-md font-semibold mb-4">Booking Status Overview</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/booking?status=WAITING_CONFIRMATION">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Waiting Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    Check for bookings pending confirmation
                  </p>
                  <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                    View Bookings
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/booking?status=ONGOING">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Play className="h-5 w-5 text-blue-600" />
                    Ongoing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    Check for bookings that need to be completed
                  </p>
                  <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                    View Bookings
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/booking?status=COMPLETED">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    Check for bookings that have been completed
                  </p>
                  <Button className="w-full group-hover:bg-primary/90 cursor-pointer" size="sm">
                    View Bookings
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
