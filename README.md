# Trovo

Trovo is a modern mobile logistics and delivery experience built with Expo and React Native. It helps users book shipments, choose delivery options, track parcels in real time, and manage account details such as addresses, payment methods, and receipts.

The app is structured as a polished delivery companion for both personal and business use, with a strong focus on a clean customer journey, fast status updates, and a scalable route-based architecture.

## Overview

Trovo includes:

- Welcome and authentication flow
- Home dashboard with tracking lookup and quick shipment actions
- Shipping flow for pickup, destination, package size, weight, and service tier
- Delivery pricing and option selection
- Live tracking screen with progress updates and courier contact action
- Shipment history and details
- Profile management, saved addresses, payment methods, notifications, and receipts

## Tech stack

- React Native
- Expo Router
- Expo SDK 58
- TypeScript
- NativeWind for styling
- Expo Image and SVG assets

## Project structure

```text
src/
├── app/
│   ├── (auth)/               # Sign-in and verification screens
│   ├── (tabs)/               # Main app tabs: Home, Ship, Shipments, Profile
│   ├── track/                # Tracking routes and delivery completion screens
│   └── _layout.tsx           # Root navigation setup
├── components/               # Shared UI components
├── constants/                # Design tokens and styling values
├── lib/                      # Booking, session, shipment, and profile logic
├── global.css                # Global styles and Tailwind base layers
└── ...
```

## Key features

### Shipment booking flow

Users can:

- Choose a pickup and drop-off location
- Select package size and weight
- Choose service speed, including same-day, standard, and express
- Review the final booking and complete the shipping journey

### Tracking experience

The app includes a dedicated tracking screen that:

- Displays shipment IDs and route information
- Simulates courier movement on a route map
- Shows progress stages from booking to delivery
- Lets users contact the courier directly
- Redirects to a delivered state when the shipment is completed

### Profile and account management

Users can manage:

- Saved addresses
- Payment methods
- Notifications
- Receipts
- Personal account details

## Getting started

### Prerequisites

- Node.js 18+
- npm or Bun
- Expo CLI via the local project dependencies

### Install dependencies

```bash
npm install
```

Or with Bun:

```bash
bun install
```

### Start the app

```bash
npx expo start
```

Then run one of the following:

```bash
npm run android
npm run ios
npm run web
```

## Available scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Development notes

This project currently uses mocked or local-state data for the shipping and session flows, which makes it ideal as a mobile prototype or a foundation for integrating a real backend API. The structure is designed to support a future connection to services for:

- authentication
- shipment creation
- pricing and quote calculations
- parcel lifecycle status updates
- payment processing
- notifications and receipt generation

## App flow

1. User opens the app and completes onboarding or sign-in
2. User searches for an existing shipment or creates a new one
3. Shipment details are collected and delivery options are shown
4. The parcel progresses through the booking and transit lifecycle
5. Users monitor status and complete the delivery journey from the tracking screen

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. If you plan to extend the app, consider keeping the screen structure consistent with the existing Expo Router layout and reusable design tokens.

