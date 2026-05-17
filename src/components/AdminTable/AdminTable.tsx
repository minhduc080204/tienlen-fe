import type { ReactNode } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TableColumn<T> {
  header: string;
  key: keyof T | string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  
  // Sorting (optional)
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  
  // Pagination (optional)
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;

  // Extra Header Actions (search bar, filter buttons, etc.)
  filtersNode?: ReactNode;
}

export function AdminTable<T>({
  columns,
  data,
  loading = false,
  sortField,
  sortOrder,
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  filtersNode
}: AdminTableProps<T>) {

  const handleSortClick = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search & Filters row */}
      {filtersNode && (
        <div className="bg-stone-900/60 backdrop-blur-md border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
          {filtersNode}
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-md">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-900/70 border-b border-stone-800 text-stone-400 font-semibold text-xs uppercase tracking-wider">
                {columns.map((col, idx) => {
                  const isSortable = col.sortable && onSort;
                  const colKey = col.key as string;
                  const isSorted = sortField === colKey;

                  return (
                    <th
                      key={idx}
                      onClick={() => isSortable && handleSortClick(colKey)}
                      className={`
                        p-4 select-none
                        ${isSortable ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}
                        ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                      `}
                    >
                      <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                        <span>{col.header}</span>
                        {isSortable && (
                          <ArrowUpDown size={12} className={`
                            text-stone-500 hover:text-yellow-400 transition-colors
                            ${isSorted ? 'text-yellow-500' : ''}
                            ${isSorted && sortOrder === 'desc' ? 'rotate-180' : ''}
                          `} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-900 text-sm text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                      <span className="text-stone-400 font-medium">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-12 text-center text-stone-500 font-medium">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-stone-900/30 transition-colors border-b border-stone-900/50"
                  >
                    {columns.map((col, colIdx) => {
                      const value = (row as any)[col.key] !== undefined ? (row as any)[col.key] : null;
                      return (
                        <td
                          key={colIdx}
                          className={`
                            p-4 font-medium
                            ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                          `}
                        >
                          {col.render ? col.render(row) : String(value ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        {onPageChange && totalPages > 1 && (
          <div className="bg-stone-900/40 px-4 py-3.5 border-t border-stone-800 flex items-center justify-between gap-4 text-xs font-semibold text-stone-400 select-none">
            <div>
              Hiển thị <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
              <span className="text-white">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{' '}
              trong tổng số <span className="text-white">{totalItems}</span> bản ghi
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md bg-stone-900 border border-stone-800 hover:border-stone-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = currentPage === pageNum;

                return (
                  <button
                    key={idx}
                    onClick={() => onPageChange(pageNum)}
                    className={`
                      px-2.5 py-1 rounded-md transition-all border
                      ${isCurrent 
                        ? 'bg-yellow-500 text-stone-950 font-bold border-yellow-500' 
                        : 'bg-stone-900 border-stone-800 hover:border-stone-700 hover:text-white'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md bg-stone-900 border border-stone-800 hover:border-stone-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
