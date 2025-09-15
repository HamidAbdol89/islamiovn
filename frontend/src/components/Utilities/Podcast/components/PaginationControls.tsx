import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Vietnamese UI text constants
const UI_TEXT = {
  PREVIOUS: 'Trang trước',
  NEXT: 'Trang sau',
} as const;

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to display - ít hơn trên mobile
  const getPageNumbers = () => {
    const pages = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxVisiblePages = isMobile ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-left');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-right');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full overflow-x-auto py-2">
      <Pagination className="mt-6 w-auto min-w-min">
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem className="hidden sm:inline-flex">
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-label={UI_TEXT.PREVIOUS}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => (
            <PaginationItem key={index} className="hidden sm:inline-flex">
              {page === 'ellipsis-left' || page === 'ellipsis-right' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page as number)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem className="hidden sm:inline-flex">
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-label={UI_TEXT.NEXT}
            />
          </PaginationItem>

          {/* Mobile version - simplified */}
          <PaginationItem className="sm:hidden flex items-center space-x-2">
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-label={UI_TEXT.PREVIOUS}
              size="sm"
            />
            
            <span className="text-sm font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-label={UI_TEXT.NEXT}
              size="sm"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;