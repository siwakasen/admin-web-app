"use client";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTravelPackages } from "@/hooks/travel.hook";
import { ToastApi } from "@/lib/helper/toast-api";
import { TravelPackagesTable } from "./_components/table";
import { TravelPackages } from "@/interfaces";
import { useEffect, useState } from "react";
import { convertTravelImageUrl } from "@/lib/helper/images-url";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { redirect } from "next/navigation";

export default function TravelPackagesPage() {
  const [packages, setPackages] = useState<TravelPackages[]>([]);
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

  const handleCreateTravelPackage = () => {
    redirect("/travel-packages/create");
  };

  const handleEditTravelPackage = (id: number) => {
    redirect(`/travel-packages/edit/${id}`);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetTravelPackages({
        limit: 10,
        page: currentPage,
      });
      if (response) {
        setPackages(response.data);
        setMeta(response.meta);
      }
      // ToastApi(response);
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
                  Travel Packages
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage and view all available travel packages
                </p>
              </div>
              <div>
                <Button onClick={handleCreateTravelPackage} className="flex items-center gap-2 bg-green-600 hover:bg-green-700" variant="default">
                  <PlusSquare className="h-4 w-4" />
                  <span>Create New Package</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TravelPackagesTable
              packages={packages}
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
