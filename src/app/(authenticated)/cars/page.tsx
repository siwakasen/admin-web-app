"use client";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllCars } from "@/hooks/cars.hook";
import { CarsTable } from "./_components/cars-table";
import { Car } from "@/interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { redirect } from "next/navigation";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateCar = () => {
    redirect("/cars/create");
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetAllCars({
        limit: 10,
        page: currentPage,
      });
      if (response) {
        setCars(response.data);
        setMeta(response.meta);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage, refetch]);

  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex gap-2 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Cars
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage and view all available cars
                </p>
              </div>
              <div>
                <Button onClick={handleCreateCar} className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700" variant="default">
                  <PlusSquare className="h-4 w-4" />
                  <span className="hidden md:block">Add New Car</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CarsTable
              cars={cars}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
              onRefetch={() => setRefetch(!refetch)}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
