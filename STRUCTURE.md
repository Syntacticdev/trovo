```
trovo/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx                           # Auth stack
│   │   ├── verify.tsx                            # 02 Verify number
│   │   └── welcome.tsx                           # 01 Welcome
│   ├── (tabs)/
│   │   ├── profile/
│   │   │   ├── addresses/
│   │   │   │   ├── [id].tsx                      # 16 Edit address
│   │   │   │   └── index.tsx                     # 15 Saved addresses
│   │   │   ├── payments/
│   │   │   │   ├── add.tsx                       # 18 Add card
│   │   │   │   └── index.tsx                     # 17 Payment methods
│   │   │   ├── _layout.tsx                       # Profile stack
│   │   │   ├── edit.tsx                          # 14 Edit profile
│   │   │   ├── index.tsx                         # 13 Profile
│   │   │   ├── notifications.tsx                 # 19 Notifications
│   │   │   └── receipts.tsx                      # 20 Receipts
│   │   ├── ship/
│   │   │   ├── _layout.tsx                       # Booking stack
│   │   │   ├── address.tsx                       # 05 Pick address
│   │   │   ├── booked.tsx                        # 08 Booked
│   │   │   ├── index.tsx                         # 04 Package details
│   │   │   ├── options.tsx                       # 06 Delivery options
│   │   │   └── review.tsx                        # 07 Review and pay
│   │   ├── shipments/
│   │   │   ├── [id].tsx                          # 12 Shipment details
│   │   │   ├── _layout.tsx                       # History stack
│   │   │   └── index.tsx                         # 11 Shipments
│   │   ├── _layout.tsx                           # Bottom tabs: Home, Ship, History, Profile
│   │   └── index.tsx                             # 03 Home
│   ├── track/
│   │   ├── [id]/
│   │   │   ├── delivered.tsx                     # 10 Delivered
│   │   │   └── index.tsx                         # 09 Live tracking
│   │   └── _layout.tsx                           # Tracking stack, full screen (no tab bar)
│   └── _layout.tsx                               # Root Stack and sign-in gate (Stack.Protected)
├── assets/
│   └── svg/
│       ├── brand/
│       │   └── *.svg                             # 1 SVG assets
│       ├── icons/
│       │   └── *.svg                             # 19 SVG assets
│       └── illustrations/
│           └── *.svg                             # 3 SVG assets
├── components/
│   └── Button.tsx                                # Primary pill button
├── constants/
│   └── tokens.ts                                 # Design tokens
├── lib/
│   └── session.tsx                               # Auth state
└── app.json                                      # Scheme and expo-router plugin
```
