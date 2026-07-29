import React, { createContext, useContext, useState, useEffect } from 'react';
import { DepositRecord, DepositFilterOptions, DepositStatus, Rider } from '../types';
import { INITIAL_DEPOSITS, INITIAL_RIDERS } from '../data/mockData';

interface DepositContextType {
  deposits: DepositRecord[];
  riders: Rider[];
  addRider: (newRider: Omit<Rider, 'id'> & { id?: string }) => Rider;
  deleteRider: (id: string) => void;
  addDeposit: (newDeposit: Omit<DepositRecord, 'id' | 'createdAt' | 'status'>) => DepositRecord;
  updateDepositStatus: (id: string, status: DepositStatus, auditNotes?: string, adminEmail?: string) => void;
  deleteDeposit: (id: string) => void;
  filteredDeposits: DepositRecord[];
  filterOptions: DepositFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<DepositFilterOptions>>;
  resetFilters: () => void;
  stats: {
    todayTotalCash: number;
    todayTotalOnline: number;
    todayTotalGrand: number;
    todayCount: number;
    pendingCount: number;
    verifiedCount: number;
    discrepancyCount: number;
  };
  selectedDepositForDenominations: DepositRecord | null;
  setSelectedDepositForDenominations: (record: DepositRecord | null) => void;
  selectedDepositForScreenshot: DepositRecord | null;
  setSelectedDepositForScreenshot: (record: DepositRecord | null) => void;
}

const STORAGE_KEY_DEPOSITS = 'dc_portal_deposits_v1';
const STORAGE_KEY_RIDERS = 'dc_portal_riders_v1';

const defaultFilterOptions: DepositFilterOptions = {
  startDate: '',
  endDate: '',
  searchQuery: '',
  riderFilter: '',
  statusFilter: 'ALL',
  dcCodeFilter: 'ALL',
};

const DepositContext = createContext<DepositContextType | undefined>(undefined);

export const DepositProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEPOSITS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load deposits from localStorage', e);
    }
    return INITIAL_DEPOSITS;
  });

  const [riders, setRiders] = useState<Rider[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RIDERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load riders from localStorage', e);
    }
    return INITIAL_RIDERS;
  });

  const [filterOptions, setFilterOptions] = useState<DepositFilterOptions>(defaultFilterOptions);

  const [selectedDepositForDenominations, setSelectedDepositForDenominations] = useState<DepositRecord | null>(null);
  const [selectedDepositForScreenshot, setSelectedDepositForScreenshot] = useState<DepositRecord | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEPOSITS, JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RIDERS, JSON.stringify(riders));
  }, [riders]);

  const addRider = (newRiderData: Omit<Rider, 'id'> & { id?: string }): Rider => {
    const id = newRiderData.id?.trim() || `RDR-${Math.floor(100 + Math.random() * 900)}`;
    const createdRider: Rider = {
      id,
      name: newRiderData.name.trim(),
      routeNo: newRiderData.routeNo?.trim() || 'General Route',
      phone: newRiderData.phone?.trim() || undefined,
      status: 'ACTIVE',
    };

    setRiders((prev) => {
      // Check if rider ID exists, if so update, otherwise append
      const exists = prev.some((r) => r.id === createdRider.id);
      if (exists) {
        return prev.map((r) => (r.id === createdRider.id ? createdRider : r));
      }
      return [createdRider, ...prev];
    });

    return createdRider;
  };

  const deleteRider = (riderId: string) => {
    setRiders((prev) => prev.filter((r) => r.id !== riderId));
  };

  const addDeposit = (newDepositData: Omit<DepositRecord, 'id' | 'createdAt' | 'status'>): DepositRecord => {
    const id = `DEP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: DepositRecord = {
      ...newDepositData,
      id,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    setDeposits((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateDepositStatus = (id: string, status: DepositStatus, auditNotes?: string, adminEmail?: string) => {
    setDeposits((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            auditNotes: auditNotes !== undefined ? auditNotes : item.auditNotes,
            verifiedBy: adminEmail || item.verifiedBy,
            verifiedAt: status !== 'PENDING' ? new Date().toISOString() : undefined,
          };
        }
        return item;
      })
    );
  };

  const deleteDeposit = (id: string) => {
    setDeposits((prev) => prev.filter((item) => item.id !== id));
  };

  const resetFilters = () => {
    setFilterOptions(defaultFilterOptions);
  };

  // Filter deposits calculation
  const filteredDeposits = deposits.filter((item) => {
    // Search query check (rider name, rider ID, route, ID)
    if (filterOptions.searchQuery.trim()) {
      const q = filterOptions.searchQuery.toLowerCase();
      const matches =
        item.riderName.toLowerCase().includes(q) ||
        item.riderId.toLowerCase().includes(q) ||
        item.routeNo.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.onlineTransactionId && item.onlineTransactionId.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Status filter
    if (filterOptions.statusFilter !== 'ALL') {
      if (item.status !== filterOptions.statusFilter) return false;
    }

    // Start date filter
    if (filterOptions.startDate) {
      if (item.depositDate < filterOptions.startDate) return false;
    }

    // End date filter
    if (filterOptions.endDate) {
      if (item.depositDate > filterOptions.endDate) return false;
    }

    return true;
  });

  // Today stats calculation
  const todayIso = new Date().toISOString().split('T')[0];
  const todayDeposits = deposits.filter((d) => d.depositDate === todayIso);

  const stats = {
    todayTotalCash: todayDeposits.reduce((acc, curr) => acc + curr.totalCash, 0),
    todayTotalOnline: todayDeposits.reduce((acc, curr) => acc + curr.onlineAmount, 0),
    todayTotalGrand: todayDeposits.reduce((acc, curr) => acc + curr.totalAmount, 0),
    todayCount: todayDeposits.length,
    pendingCount: deposits.filter((d) => d.status === 'PENDING').length,
    verifiedCount: deposits.filter((d) => d.status === 'VERIFIED').length,
    discrepancyCount: deposits.filter((d) => d.status === 'DISCREPANCY').length,
  };

  return (
    <DepositContext.Provider
      value={{
        deposits,
        riders,
        addRider,
        deleteRider,
        addDeposit,
        updateDepositStatus,
        deleteDeposit,
        filteredDeposits,
        filterOptions,
        setFilterOptions,
        resetFilters,
        stats,
        selectedDepositForDenominations,
        setSelectedDepositForDenominations,
        selectedDepositForScreenshot,
        setSelectedDepositForScreenshot,
      }}
    >
      {children}
    </DepositContext.Provider>
  );
};

export const useDeposits = () => {
  const context = useContext(DepositContext);
  if (!context) {
    throw new Error('useDeposits must be used within a DepositProvider');
  }
  return context;
};
