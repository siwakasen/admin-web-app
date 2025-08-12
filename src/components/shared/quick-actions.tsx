import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/interfaces";
import Link from "next/link";
import { 
  Car, 
  MapPin, 
  Receipt, 
  UserPlus, 
  Plus 
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
  );
}
