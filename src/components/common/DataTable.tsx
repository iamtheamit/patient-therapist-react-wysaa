import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Column Definition ────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  cell: (row: T, rowIndex: number) => React.ReactNode;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string;
  caption?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  skeletonRows?: number;
  /** Rows per page options. Pass [] to disable pagination entirely. */
  pageSizeOptions?: number[];
  /** Default rows per page */
  defaultPageSize?: number;
}

// ─── Internal ─────────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc' | null;
interface SortState {
  key: string;
  dir: SortDir;
}

// ─── Component ────────────────────────────────────────────────────────────────

function DataTable<T>({
  columns,
  data,
  getRowKey,
  caption,
  emptyTitle = 'No Records Found',
  emptyMessage = 'There are no items matching the current filters.',
  className = '',
  onRowClick,
  isLoading = false,
  skeletonRows = 5,
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: '', dir: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // ── Sorting ──────────────────────────────────────────────────────────────────
  const handleSort = (key: string) => {
    setPage(1);
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: '', dir: null };
    });
  };

  // Reset page whenever data length changes (React recommended pattern for adjusting state when props change)
  const [prevDataLength, setPrevDataLength] = useState(data.length);
  if (data.length !== prevDataLength) {
    setPrevDataLength(data.length);
    setPage(1);
  }

  const sortedData = useMemo(() => {
    if (!sort.key || sort.dir === null) return data;
    return [...data].sort((a, b) => {
      const aStr = String((a as Record<string, unknown>)[sort.key] ?? '').toLowerCase();
      const bStr = String((b as Record<string, unknown>)[sort.key] ?? '').toLowerCase();
      return sort.dir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [data, sort]);

  // ── Pagination ────────────────────────────────────────────────────────────────
  const isPaginationEnabled = pageSizeOptions.length > 0;
  const totalRows = sortedData.length;
  const totalPages = isPaginationEnabled ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;
  const safePage = Math.min(page, totalPages);
  const visibleRows = isPaginationEnabled
    ? sortedData.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sortedData;

  const startRow = totalRows === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = Math.min(safePage * pageSize, totalRows);

  // ── Sort Icon ─────────────────────────────────────────────────────────────────
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sort.key !== colKey || sort.dir === null)
      return (
        <ChevronsUpDown className="w-3.5 h-3.5 text-[#c3c6d6] group-hover:text-[#0052cc] transition" />
      );
    if (sort.dir === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-[#0052cc]" />;
    return <ChevronDown className="w-3.5 h-3.5 text-[#0052cc]" />;
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────────
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {columns.map((col) => (
        <td key={col.key} className="px-4 py-3.5">
          <div className="h-3.5 bg-slate-100 rounded-lg w-full" />
        </td>
      ))}
    </tr>
  );

  // ── Page numbers ──────────────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++)
        pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs overflow-hidden ${className}`}
    >
      {/* Caption */}
      {caption && (
        <div className="px-5 py-3 border-b border-[#c3c6d6]/30">
          <p className="text-[10px] font-bold text-[#505f76] uppercase tracking-widest">
            {caption}
          </p>
        </div>
      )}

      {/* Scroll container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          {/* Head */}
          <thead>
            <tr className="border-b border-[#c3c6d6]/30 bg-[#f8f9fb]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#505f76] whitespace-nowrap select-none ${
                    col.width ?? ''
                  } ${col.sortable ? 'cursor-pointer group' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#c3c6d6]/20">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => <SkeletonRow key={i} />)
            ) : visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <AlertCircle className="w-10 h-10 text-slate-200" />
                    <div>
                      <p className="text-sm font-bold text-[#191c1e]">{emptyTitle}</p>
                      <p className="text-xs text-[#505f76] mt-1 max-w-xs mx-auto">{emptyMessage}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowIndex)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-blue-50/50 active:bg-blue-50'
                      : 'hover:bg-[#f8f9fb]/60'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-xs text-[#191c1e] align-middle whitespace-nowrap"
                    >
                      {col.cell(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: row info + page-size selector + pagination */}
      {!isLoading && (
        <div className="px-4 py-3 border-t border-[#c3c6d6]/20 bg-[#f8f9fb]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: count */}
          <p className="text-[10px] text-[#505f76] shrink-0">
            {totalRows === 0 ? (
              '0 records'
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-[#191c1e]">
                  {startRow}–{endRow}
                </span>{' '}
                of <span className="font-semibold text-[#191c1e]">{totalRows}</span> records
              </>
            )}
          </p>

          {isPaginationEnabled && totalRows > 0 && (
            <div className="flex items-center gap-3">
              {/* Page size */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#505f76]">Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="text-[10px] font-semibold text-[#191c1e] border border-[#c3c6d6]/60 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 cursor-pointer"
                >
                  {pageSizeOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1.5 rounded-lg border border-[#c3c6d6]/50 text-[#505f76] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-1.5 text-[10px] text-[#505f76]">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`min-w-[28px] h-7 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        safePage === p
                          ? 'bg-[#0052cc] text-white shadow-sm'
                          : 'border border-[#c3c6d6]/50 text-[#505f76] hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-1.5 rounded-lg border border-[#c3c6d6]/50 text-[#505f76] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
