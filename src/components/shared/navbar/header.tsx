'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
export function HeaderNavigation() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbItems =
    segments.length === 0 ? (
      <BreadcrumbItem>
        <BreadcrumbPage>Home</BreadcrumbPage>
      </BreadcrumbItem>
    ) : (
      segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const capitalizedSegment =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

        const hrefPath = '/' + segments.slice(0, index + 1).join('/');

        return (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {isLast ? (
                <BreadcrumbPage>{capitalizedSegment}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={hrefPath}>
                  {capitalizedSegment}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        );
      })
    );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
