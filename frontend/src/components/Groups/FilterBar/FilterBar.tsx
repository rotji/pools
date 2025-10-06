import React, { useState } from 'react';
import { Button } from '../../ui';
import styles from '../../../styles/components/Groups/FilterBar.module.css';

export interface FilterOptions {
  status: string[];
  riskLevel: string[];
  groupType: string[];
  contributionRange: [number, number];
  sortBy: string;
}

export interface FilterBarProps {
  onFilter: (filters: FilterOptions) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilter,
  searchTerm,
  onSearchChange
}) => {
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    status: [],
    riskLevel: [],
    groupType: [],
    contributionRange: [0, 1000],
    sortBy: 'newest'
  });

  const statusOptions = [
    { value: 'active', label: 'Active', color: '#10b981' },
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'settling', label: 'Settling', color: '#8b5cf6' }
  ];

  const riskOptions = [
    { value: 'low', label: 'Low Risk', color: '#10b981' },
    { value: 'medium', label: 'Medium Risk', color: '#f59e0b' },
    { value: 'high', label: 'High Risk', color: '#ef4444' }
  ];

  const typeOptions = [
    { value: 'public', label: 'Public', color: '#10b981' },
    { value: 'private', label: 'Private', color: '#8b5cf6' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'contribution-low', label: 'Contribution: Low to High' },
    { value: 'contribution-high', label: 'Contribution: High to Low' },
    { value: 'members', label: 'Most Members' },
    { value: 'progress', label: 'Most Funded' }
  ];

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    if (type === 'status' || type === 'riskLevel' || type === 'groupType') {
      const currentValues = activeFilters[type] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const newFilters = { ...activeFilters, [type]: newValues };
      setActiveFilters(newFilters);
      onFilter(newFilters);
    }
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...activeFilters, sortBy };
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      status: [],
      riskLevel: [],
      groupType: [],
      contributionRange: [0, 1000],
      sortBy: 'newest'
    };
    setActiveFilters(defaultFilters);
    onFilter(defaultFilters);
    onSearchChange('');
  };

  const hasActiveFilters = 
    activeFilters.status.length > 0 || 
    activeFilters.riskLevel.length > 0 ||
    activeFilters.groupType.length > 0 ||
    searchTerm.length > 0;

  return (
    <div className={styles.filterBar}>
      <div className={styles.container}>
        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search groups by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className={styles.filtersSection}>
          {/* Status Filters */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Status:</span>
            <div className={styles.filterOptions}>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('status', option.value)}
                  className={`${styles.filterChip} ${
                    activeFilters.status.includes(option.value) ? styles.active : ''
                  }`}
                  style={{
                    borderColor: activeFilters.status.includes(option.value) ? option.color : undefined,
                    backgroundColor: activeFilters.status.includes(option.value) ? `${option.color}20` : undefined
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Level Filters */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Risk:</span>
            <div className={styles.filterOptions}>
              {riskOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('riskLevel', option.value)}
                  className={`${styles.filterChip} ${
                    activeFilters.riskLevel.includes(option.value) ? styles.active : ''
                  }`}
                  style={{
                    borderColor: activeFilters.riskLevel.includes(option.value) ? option.color : undefined,
                    backgroundColor: activeFilters.riskLevel.includes(option.value) ? `${option.color}20` : undefined
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group Type Filters */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Type:</span>
            <div className={styles.filterOptions}>
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('groupType', option.value)}
                  className={`${styles.filterChip} ${
                    activeFilters.groupType.includes(option.value) ? styles.active : ''
                  }`}
                  style={{
                    borderColor: activeFilters.groupType.includes(option.value) ? option.color : undefined,
                    backgroundColor: activeFilters.groupType.includes(option.value) ? `${option.color}20` : undefined
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort and Clear Section */}
        <div className={styles.actionsSection}>
          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select
              value={activeFilters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.sortSelect}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;