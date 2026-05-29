import { useState, useMemo, useEffect, useCallback } from "react";

export interface TableConfig<T> {
    itemsPerPage?: number;
    searchField?: keyof T | ((item: T, term: string) => boolean);
    initialSortDirection?: "asc" | "desc";
    sortField?: keyof T | ((a: T, b: T, dir: "asc" | "desc") => number);
    filterFn?: (item: T) => boolean;
}

export function useAdminTable<T>(items: T[] | null | undefined, config: TableConfig<T> = {}) {
    const {
        itemsPerPage = 15,
        searchField,
        initialSortDirection = "desc",
        sortField,
        filterFn,
    } = config;

    const [searchTerm, setSearchTerm] = useState("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortDirection);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredItems = useMemo(() => {
        if (!items)
            return [];

        let result = [...items];
        if (filterFn) {
            result = result.filter(filterFn);
        }

        if (searchTerm && searchField) {
            const term = searchTerm.toLowerCase();
            result = result.filter((item) => {
                if (typeof searchField === "function") {
                    return searchField(item, term);
                }
                const val = item[searchField];
                return val ? String(val).toLowerCase().includes(term) : false;
            });
        }

        if (sortField) {
            result.sort((a, b) => {
                if (typeof sortField === "function") {
                    return sortField(a, b, sortDirection);
                }
                const valA = a[sortField];
                const valB = b[sortField];

                if (valA instanceof Date && valB instanceof Date) {
                    return sortDirection === "asc"
                        ? valA.getTime() - valB.getTime()
                        : valB.getTime() - valA.getTime();
                }

                if (typeof valA === "number" && typeof valB === "number") {
                    return sortDirection === "asc" ? valA - valB : valB - valA;
                }

                const strA = String(valA || "").toLowerCase();
                const strB = String(valB || "").toLowerCase();
                return sortDirection === "asc"
                    ? strA.localeCompare(strB)
                    : strB.localeCompare(strA);
            });
        }

        return result;
    }, [items, searchTerm, sortDirection, filterFn, searchField, sortField]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

    const toggleSort = useCallback(() => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        sortDirection,
        setSortDirection,
        currentPage,
        setCurrentPage,
        filteredItems,
        paginatedItems,
        totalPages,
        toggleSort,
    };
}
