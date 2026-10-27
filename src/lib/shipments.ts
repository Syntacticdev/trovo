import type { ServiceId } from './booking';

export type ShipmentStatus = 'In transit' | 'Out for delivery' | 'Delivered';

export type Shipment = {
    id: string;
    service: ServiceId;
    status: ShipmentStatus;
    from: string;
    to: string;
    destination: string; // short form for the list, e.g. "Ikeja, Lagos"
    price: number; // delivery price in naira
    pickupFee: number;
    date: string;
    paidWith: string;
};

// TODO: replace with your shipments API (list + detail endpoints)
export const shipments: Shipment[] = [
    {
        id: 'TRV-48213',
        service: 'express',
        status: 'Delivered',
        from: '12 Ring Rd, Ibadan',
        to: 'Allen Ave, Ikeja, Lagos',
        destination: 'Ikeja, Lagos',
        price: 3800,
        pickupFee: 300,
        date: 'Oct 24',
        paidWith: 'Visa ending 4417',
    },
    {
        id: 'TRV-48090',
        service: 'same-day',
        status: 'Out for delivery',
        from: '12 Ring Rd, Ibadan',
        to: 'Bodija Market Rd, Ibadan',
        destination: 'Bodija, Ibadan',
        price: 1500,
        pickupFee: 300,
        date: 'Oct 22',
        paidWith: 'Visa ending 4417',
    },
    {
        id: 'TRV-47711',
        service: 'standard',
        status: 'Delivered',
        from: '12 Ring Rd, Ibadan',
        to: 'Wuse 2, Abuja',
        destination: 'Wuse, Abuja',
        price: 2200,
        pickupFee: 300,
        date: 'Oct 15',
        paidWith: 'Visa ending 4417',
    },
    {
        id: 'TRV-47502',
        service: 'express',
        status: 'Delivered',
        from: '44 Adeola Odeku, Lagos',
        to: '12 Ring Rd, Ibadan',
        destination: 'Ring Rd, Ibadan',
        price: 3500,
        pickupFee: 300,
        date: 'Oct 9',
        paidWith: 'Visa ending 4417',
    },
];

export const getShipment = (id?: string) => shipments.find((s) => s.id === id);

// TODO: replace with a call to your tracking API. Live tracking polls this every few seconds
// and opens the delivered screen when the status comes back as 'Delivered'.
export async function fetchShipment(id?: string): Promise<Shipment | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getShipment(id);
}