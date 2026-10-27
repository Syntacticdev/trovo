import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Profile = { name: string; phone: string; email: string; photo?: string };
export type AddressLabel = 'Home' | 'Office' | 'Other';
export type Address = { id: string; label: AddressLabel; street: string; city: string; note: string };
export type Card = { id: string; brand: string; last4: string; expiry: string };
export type NotificationKey = 'delivery' | 'receipts' | 'offers';

// TODO: replace the starting values with your user API, and send every change below to the API too
const initialProfile: Profile = { name: 'Tola Adeyemi', phone: '+234 801 234 5678', email: 'tola@mailbox.example' };
const initialAddresses: Address[] = [
    { id: 'home', label: 'Home', street: '12 Ring Rd', city: 'Ibadan', note: '' },
    { id: 'office', label: 'Office', street: '44 Adeola Odeku', city: 'Lagos', note: 'Ask for reception' },
    { id: 'other', label: 'Other', street: '7 Wuse Close', city: 'Abuja', note: '' },
];
const initialCards: Card[] = [
    { id: 'visa-4417', brand: 'Visa', last4: '4417', expiry: '08/28' },
    { id: 'mc-2093', brand: 'Mastercard', last4: '2093', expiry: '02/27' },
];

type ProfileContextValue = {
    profile: Profile;
    updateProfile: (patch: Partial<Profile>) => void;
    addresses: Address[];
    saveAddress: (address: Omit<Address, 'id'> & { id?: string }) => void;
    removeAddress: (id: string) => void;
    cards: Card[];
    defaultCardId: string;
    addCard: (card: Omit<Card, 'id'>) => void;
    setDefaultCard: (id: string) => void;
    notifications: Record<NotificationKey, boolean>;
    setNotification: (key: NotificationKey, value: boolean) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState(initialProfile);
    const [addresses, setAddresses] = useState(initialAddresses);
    const [cards, setCards] = useState(initialCards);
    const [defaultCardId, setDefaultCardId] = useState(initialCards[0].id);
    const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
        delivery: true,
        receipts: true,
        offers: false,
    });

    const updateProfile = useCallback((patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch })), []);

    const saveAddress = useCallback((address: Omit<Address, 'id'> & { id?: string }) => {
        setAddresses((list) =>
            address.id
                ? list.map((a) => (a.id === address.id ? { ...a, ...address, id: a.id } : a))
                : [...list, { ...address, id: String(Date.now()) }],
        );
    }, []);

    const removeAddress = useCallback((id: string) => setAddresses((list) => list.filter((a) => a.id !== id)), []);

    const addCard = useCallback((card: Omit<Card, 'id'>) => {
        const id = String(Date.now());
        setCards((list) => [...list, { ...card, id }]);
        setDefaultCardId((current) => current || id); // the first card becomes the default
    }, []);

    const setDefaultCard = useCallback((id: string) => setDefaultCardId(id), []);

    const setNotification = useCallback(
        (key: NotificationKey, value: boolean) => setNotifications((n) => ({ ...n, [key]: value })),
        [],
    );

    const value = useMemo(
        () => ({
            profile,
            updateProfile,
            addresses,
            saveAddress,
            removeAddress,
            cards,
            defaultCardId,
            addCard,
            setDefaultCard,
            notifications,
            setNotification,
        }),
        [profile, updateProfile, addresses, saveAddress, removeAddress, cards, defaultCardId, addCard, setDefaultCard, notifications, setNotification],
    );

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
    return ctx;
}