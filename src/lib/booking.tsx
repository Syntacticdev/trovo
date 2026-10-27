import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Size = 'small' | 'medium' | 'large';
export type ServiceId = 'same-day' | 'express' | 'standard';

// TODO: replace with prices from your quote API
export const SERVICES = [
    { id: 'same-day', label: 'Same-day', eta: 'Arrives in about 4 hrs', delivery: 'Today', price: 6500 },
    { id: 'express', label: 'Express', eta: 'Delivered by tomorrow', delivery: 'Tomorrow', price: 3800 },
    { id: 'standard', label: 'Standard', eta: '2 to 3 days', delivery: 'In 2 to 3 days', price: 2200 },
] as const;

export const PICKUP_FEE = 300;

// 4100 -> "₦4,100"
export const formatNaira = (n: number) => '₦' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

type Draft = {
    pickup: string;
    dropoff: string;
    size: Size;
    weight: string; // kg,
    service: ServiceId;
};

const initialDraft: Draft = { pickup: '', dropoff: '', size: 'medium', weight: '', service: 'express' };

type BookingContextValue = {
    draft: Draft;
    update: (patch: Partial<Draft>) => void;
    reset: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

// Holds the shipment being booked while the user moves through the /ship screens
export function BookingProvider({ children }: { children: ReactNode }) {
    const [draft, setDraft] = useState<Draft>(initialDraft);
    const update = useCallback((patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })), []);
    const reset = useCallback(() => setDraft(initialDraft), []);
    const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset]);
    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    )
}

export function useBooking() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
    return ctx;
}