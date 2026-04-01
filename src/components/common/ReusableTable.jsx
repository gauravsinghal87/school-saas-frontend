import React, { useState, useMemo, useCallback, useRef } from "react";


const Icon = {
    Search: () => (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="9" cy="9" r="6" /><path d="m15 15 3 3" strokeLinecap="round" />
        </svg>
    ),
    ChevronUp: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M10 7.293 4.707 12.586 3.293 11.172 10 4.465l6.707 6.707-1.414 1.414L10 7.293z" />
        </svg>
    ),
    ChevronDown: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M10 12.707l5.293-5.293 1.414 1.414L10 15.535l-6.707-6.707 1.414-1.414L10 12.707z" />
        </svg>
    ),
    ChevronLeft: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
        </svg>
    ),
    ChevronRight: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
        </svg>
    ),
    ChevronsLeft: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M15.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L12.414 10l3.293 3.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414z" />
        </svg>
    ),
    ChevronsRight: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.293 14.707a1 1 0 010-1.414L7.586 10 4.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L13.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
        </svg>
    ),
    Edit: () => (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
            <path d="M11.5 4.5 15.5 8.5M4 13l.886-3.544A1 1 0 015.15 8.74l8.5-8.5a1 1 0 011.414 0l1.697 1.697a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-.716.293H4v-2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Trash: () => (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
            <path d="M6 2h8M2 5h16M8 9v6M12 9v6M4 5l1 13h10L16 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Plus: () => (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
        </svg>
    ),
    Empty: () => (
        <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 mx-auto" stroke="currentColor" strokeWidth={1.2}>
            <rect x="8" y="12" width="48" height="42" rx="4" />
            <path d="M8 22h48M20 12v10M44 12v10M22 34h20M22 42h12" strokeLinecap="round" />
        </svg>
    ),
};


function SortIcon({ column, sortConfig }) {
    const isActive = sortConfig.key === column.key;
    return (
        <span className="flex flex-col ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <span className={isActive && sortConfig.dir === "asc" ? "text-primary" : ""}><Icon.ChevronUp /></span>
            <span className={`-mt-1 ${isActive && sortConfig.dir === "desc" ? "text-primary" : ""}`}><Icon.ChevronDown /></span>
        </span>
    );
}

function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                <Icon.Search />
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-9 pl-9 pr-4 text-sm rounded-xl border border-border bg-surface-card text-text-primary placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}

function PageSizeSelect({ value, options, onChange }) {
    return (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="hidden sm:inline">Rows</span>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-9 px-2 pr-7 rounded-xl text-sm border border-border bg-surface-card text-text-primary outline-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
                {options.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
        </div>
    );
}

function Pagination({ page, totalPages, total, pageSize, onPage }) {
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    const pageWindow = useMemo(() => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, 4, 5];
        if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [page - 2, page - 1, page, page + 1, page + 2];
    }, [page, totalPages]);

    const base = "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
    const ghost = `${base} text-text-secondary hover:bg-surface-page hover:text-text-primary`;
    const active = `${base} bg-primary text-white shadow-sm`;
    const inactive = `${base} text-text-secondary hover:bg-surface-page`;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
            <p className="text-xs text-text-secondary order-2 sm:order-1">
                {total === 0 ? "No results" : `Showing ${from}–${to} of ${total} records`}
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button className={ghost} onClick={() => onPage(1)} disabled={page === 1} title="First"><Icon.ChevronsLeft /></button>
                <button className={ghost} onClick={() => onPage(page - 1)} disabled={page === 1} title="Previous"><Icon.ChevronLeft /></button>
                <div className="flex items-center gap-1 mx-1">
                    {pageWindow[0] > 1 && (
                        <>
                            <button className={inactive} onClick={() => onPage(1)}>1</button>
                            {pageWindow[0] > 2 && <span className="w-8 text-center text-xs text-text-secondary">…</span>}
                        </>
                    )}
                    {pageWindow.map((p) => (
                        <button key={p} className={p === page ? active : inactive} onClick={() => onPage(p)}>{p}</button>
                    ))}
                    {pageWindow[pageWindow.length - 1] < totalPages && (
                        <>
                            {pageWindow[pageWindow.length - 1] < totalPages - 1 && (
                                <span className="w-8 text-center text-xs text-text-secondary">…</span>
                            )}
                            <button className={inactive} onClick={() => onPage(totalPages)}>{totalPages}</button>
                        </>
                    )}
                </div>
                <button className={ghost} onClick={() => onPage(page + 1)} disabled={page === totalPages || totalPages === 0} title="Next"><Icon.ChevronRight /></button>
                <button className={ghost} onClick={() => onPage(totalPages)} disabled={page === totalPages || totalPages === 0} title="Last"><Icon.ChevronsRight /></button>
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <tr>
            <td colSpan={100}>
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-secondary">
                    <Icon.Empty />
                    <p className="text-sm font-medium mt-1">{message}</p>
                </div>
            </td>
        </tr>
    );
}

function SkeletonRows({ rows, cols }) {
    return Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border">
            {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-4 py-3.5">
                    <div className="h-4 rounded-full bg-border animate-pulse" style={{ width: `${55 + ((r * 3 + c * 7) % 35)}%` }} />
                </td>
            ))}
        </tr>
    ));
}

function DefaultActionCell({ row, onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-1">
            {onEdit && (
                <button
                    onClick={() => onEdit(row)}
                    title="Edit"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-150"
                >
                    <Icon.Edit />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={() => onDelete(row)}
                    title="Delete"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-150"
                >
                    <Icon.Trash />
                </button>
            )}
        </div>
    );
}

 
export default function DataTable({
    title,
    actionCell,
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No records found",
    searchable = true,
    searchPlaceholder = "Search…",
    pageSizeOptions = [10, 20, 50],
    defaultPageSize = 10,
    onEdit,
    onDelete,
    actions,
    rowKey = "id",
    // server mode
    serverMode = false,
    page: externalPage,
    total: externalTotal,
    onSearch,
    onPageChange,
    onPageSizeChange,
}) {
    const isServer = serverMode;

    const [internalSearch, setInternalSearch] = useState("");
    const [internalPage, setInternalPage] = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
    const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });
    const debounceRef = useRef(null);

    const handleSearch = useCallback((val) => {
        setInternalSearch(val);
        if (isServer) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onSearch?.(val);
                onPageChange?.(1);
            }, 400);
        } else {
            setInternalPage(1);
        }
    }, [isServer, onSearch, onPageChange]);

    const handlePageChange = useCallback((p) => {
        isServer ? onPageChange?.(p) : setInternalPage(p);
    }, [isServer, onPageChange]);

    const handlePageSizeChange = useCallback((size) => {
        if (isServer) {
            onPageSizeChange?.(size);
            onPageChange?.(1);
        } else {
            setInternalPageSize(size);
            setInternalPage(1);
        }
    }, [isServer, onPageSizeChange, onPageChange]);

    const handleSort = useCallback((col) => {
        if (!col.sortable) return;
        setSortConfig((prev) =>
            prev.key === col.key
                ? { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key: col.key, dir: "asc" }
        );
        if (!isServer) setInternalPage(1);
    }, [isServer]);

    const filtered = useMemo(() => {
        if (isServer || !internalSearch.trim()) return data;
        const q = internalSearch.toLowerCase();
        return data.filter((row) =>
            columns.some((col) => {
                const val = row[col.key];
                return val != null && String(val).toLowerCase().includes(q);
            })
        );
    }, [data, internalSearch, columns, isServer]);

    const sorted = useMemo(() => {
        if (!sortConfig.key) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortConfig.key] ?? "";
            const bv = b[sortConfig.key] ?? "";
            const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
            return sortConfig.dir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortConfig]);

    const activePage = isServer ? (externalPage ?? 1) : Math.min(internalPage, Math.max(1, Math.ceil(sorted.length / internalPageSize)));
    const activePageSize = isServer ? defaultPageSize : internalPageSize;
    const activeTotal = isServer ? (externalTotal ?? 0) : sorted.length;
    const activeTotalPages = Math.max(1, Math.ceil(activeTotal / activePageSize));

    const displayRows = isServer
        ? data
        : sorted.slice((activePage - 1) * internalPageSize, activePage * internalPageSize);

    const countBadge = isServer ? externalTotal : filtered.length;
    const showActions = onEdit || onDelete;
    const allCols = showActions
        ? [...columns, { key: "__actions__", label: "Actions", sortable: false }]
        : columns;

    return (
        <>


            <div className="flex flex-col rounded-2xl border border-border bg-surface-card overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3 min-w-0">
                        {title && (
                            <h2 className="text-base font-bold text-text-heading truncate">{title}</h2>
                        )}
                        {!loading && countBadge != null && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                {countBadge}
                            </span>
                        )}


                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {searchable && (
                            <SearchBar value={internalSearch} onChange={handleSearch} placeholder={searchPlaceholder} />
                        )}
                        {actions}

                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-surface-page">
                                {allCols.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => handleSort(col)}
                                        style={col.width ? { width: col.width } : {}}
                                        className={`group px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary select-none whitespace-nowrap border-b border-border ${col.sortable ? "cursor-pointer hover:text-text-primary transition-colors" : ""}`}
                                    >
                                        <span className="inline-flex items-center">
                                            {col.label}
                                            {col.sortable && <SortIcon column={col} sortConfig={sortConfig} />}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonRows rows={Math.min(defaultPageSize, 8)} cols={allCols.length} />
                            ) : displayRows.length === 0 ? (
                                <EmptyState message={emptyMessage} />
                            ) : (
                                displayRows.map((row, idx) => (
                                    <tr
                                        key={row[rowKey] ?? idx}
                                        className="border-b border-border last:border-0 hover:bg-surface-page transition-colors duration-100"
                                    >
                                        {allCols.map((col) => (
                                            <td key={col.key} className="px-4 py-3.5 text-text-primary whitespace-nowrap">

                                                {col.key === "__actions__" ? (
                                                    actionCell ? (
                                                        actionCell(row)
                                                    ) : (
                                                        <DefaultActionCell row={row} onEdit={onEdit} onDelete={onDelete} />
                                                    )
                                                ) : col.render ? col.render(row[col.key], row, idx) : (
                                                    <span className="block truncate max-w-[200px]">{row[col.key] ?? "—"}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-border">
                    <PageSizeSelect value={activePageSize} options={pageSizeOptions} onChange={handlePageSizeChange} />
                    <Pagination page={activePage} totalPages={activeTotalPages} total={activeTotal} pageSize={activePageSize} onPage={handlePageChange} />
                </div>
            </div>
        </>

    );
}