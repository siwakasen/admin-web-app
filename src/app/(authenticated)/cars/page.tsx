"use client";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllCars, useGetAllCarsHistory } from "@/hooks/cars.hook";
import { CarsTable } from "./_components/cars-table";
import { Car } from "@/interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carsHistory, setCarsHistory] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [metaHistory, setMetaHistory] = useState({
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

  const handlePageChangeHistory = (page: number) => {
    setCurrentPageHistory(page);
  };

  const handleCreateCar = () => {
    redirect("/cars/create");
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setRefetch(!refetch);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetAllCars({
        limit: 10,
        page: currentPage,
        search: searchQuery,
      });
      if (response) {
        setCars(response.data);
        setMeta(response.meta);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage, refetch]);

  useEffect(() => {
    setLoadingHistory(true);
    const fetchData = async () => {
      const response = await useGetAllCarsHistory({
        limit: 10,
        page: currentPageHistory,
      });
      if (response) {
        setCarsHistory(response.data);
        setMetaHistory(response.meta);
      }
      setLoadingHistory(false);
    };
    fetchData();
  }, [currentPageHistory, refetch]);

  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-40 p-6">
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
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pr-10"
                />
                <Button
                  onClick={handleSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CarsTable
              cars={cars}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
              onRefetch={() => setRefetch(!refetch)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex gap-2 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Deleted Cars
                </CardTitle>
                <p className="text-muted-foreground">
                  The data below consists of deleted cars. These cars will not be displayed on the main website.
                </p>
                <p className="text-muted-foreground">
                  This information is retained as a history for customer bookings.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CarsTable
              cars={carsHistory}
              meta={metaHistory}
              loading={loadingHistory}
              onPageChange={handlePageChangeHistory}
              onRefetch={() => setRefetch(!refetch)}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
