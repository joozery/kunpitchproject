import React from 'react';

// Passenger Lift
export const PassengerLiftIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="16" y2="18"/>
  </svg>
);

// Jacuzzi
export const JacuzziIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="8"/>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>
  </svg>
);

// Fitness / Gym
export const GymIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M6 4h12M6 8h12M6 12h12M6 16h12"/>
    <circle cx="8" cy="6" r="1"/>
    <circle cx="16" cy="6" r="1"/>
    <circle cx="8" cy="10" r="1"/>
    <circle cx="16" cy="10" r="1"/>
    <circle cx="8" cy="14" r="1"/>
    <circle cx="16" cy="14" r="1"/>
    <circle cx="8" cy="18" r="1"/>
    <circle cx="16" cy="18" r="1"/>
  </svg>
);

// Shuttle Service
export const ShuttleIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="1" y="3" width="22" height="14" rx="2" ry="2"/>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="17" cy="17" r="2"/>
    <path d="M1 9h22"/>
  </svg>
);

// Garden
export const GardenIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// Kids Playground
export const PlaygroundIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
  </svg>
);

// Library
export const LibraryIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

// Convenience Store / Minimart
export const StoreIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

// Access Control (Fingerprint / Keycard)
export const AccessControlIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// Laundry
export const LaundryIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="8"/>
    <path d="M12 4v8l4 4"/>
  </svg>
);

// Motorcycle Parking
export const MotorcycleIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="17" cy="17" r="2"/>
    <path d="M7 17h10M7 17v-4h10v4"/>
    <path d="M7 13l3-6h4l3 6"/>
  </svg>
);

// Meeting Room
export const MeetingRoomIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
    <path d="M7 7h10M7 11h10M7 15h6"/>
  </svg>
);

// Parking
export const ParkingIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
    <path d="M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9V7z"/>
  </svg>
);

// Steam Room
export const SteamRoomIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M8 12h8M8 16h8"/>
    <circle cx="12" cy="8" r="1"/>
    <circle cx="12" cy="20" r="1"/>
  </svg>
);

// 24-hour Security with CCTV
export const SecurityIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// WIFI
export const WifiIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8"/>
    <path d="M5 12s2-4 7-4 7 4 7 4"/>
    <path d="M9 12s1-2 3-2 3 2 3 2"/>
    <circle cx="12" cy="12" r="1"/>
  </svg>
);

// Swimming Pool
export const PoolIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12z"/>
    <path d="M2 10h20"/>
    <path d="M6 14h2M10 14h2M14 14h2M18 14h2"/>
  </svg>
);

// Sauna
export const SaunaIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M8 12h8M8 16h8"/>
    <path d="M12 8v8"/>
    <circle cx="12" cy="6" r="1"/>
    <circle cx="12" cy="18" r="1"/>
  </svg>
);

// Restaurant
export const RestaurantIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/>
    <line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);

// EV Charger
export const EvChargerIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <path d="M7 7h10M7 11h10M7 15h6"/>
    <path d="M12 3v18"/>
    <path d="M8 9l4-4 4 4"/>
  </svg>
);

// Allow Pet
export const PetIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 18l6-6-6-6"/>
    <path d="M3 12h12"/>
  </svg>
);

// Stadium
export const StadiumIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

// Lobby
export const LobbyIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <path d="M8 21V8a4 4 0 0 1 8 0v13"/>
    <path d="M12 12h.01"/>
  </svg>
);

// Private Lift
export const PrivateLiftIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="16" y2="18"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </svg>
);

// Lounge Area
export const LoungeIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M7 7h10M7 11h10M7 15h6"/>
    <path d="M9 9h2M9 13h2M9 17h2"/>
  </svg>
);

// Co-Working Space
export const CoWorkingIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <path d="M8 7h8M8 11h8M8 15h8"/>
    <path d="M12 7v10"/>
    <path d="M8 7v10"/>
    <path d="M16 7v10"/>
  </svg>
);

// Cafe
export const CafeIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <path d="M6 1v3M10 1v3M14 1v3"/>
    <path d="M6 12h8"/>
  </svg>
);

// Private Dining Room / Party Room
export const DiningRoomIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <path d="M8 7h8M8 11h8M8 15h6"/>
    <path d="M12 7v10"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

// Cinema Room / Theatre
export const CinemaIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <path d="M7 7h10M7 11h10M7 15h10"/>
    <path d="M9 9h2M9 13h2M9 17h2"/>
    <path d="M13 9h2M13 13h2M13 17h2"/>
  </svg>
);

// Sport Area
export const SportAreaIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
    <circle cx="7" cy="7" r="2"/>
    <circle cx="17" cy="7" r="2"/>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="17" cy="17" r="2"/>
    <path d="M12 2v20M2 12h20"/>
  </svg>
);

// Golf Simulator
export const GolfSimulatorIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 9v6M9 12h6"/>
    <path d="M12 2v4M12 18v4"/>
  </svg>
);

// Clubhouse
export const ClubhouseIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
    <path d="M8 12h8"/>
    <path d="M8 16h8"/>
  </svg>
);

// Private Pool
export const PrivatePoolIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12z"/>
    <path d="M2 10h20"/>
    <path d="M6 14h2M10 14h2M14 14h2M18 14h2"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </svg>
);

// Co-Kitchen
export const CoKitchenIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
    <path d="M8 7h8M8 11h8M8 15h6"/>
    <path d="M12 7v10"/>
    <path d="M8 7v10"/>
    <path d="M16 7v10"/>
    <circle cx="12" cy="12" r="1"/>
  </svg>
);

// Export all icons as an object for easy access
export const FacilityIcons = {
  PassengerLift: PassengerLiftIcon,
  PrivateLift: PrivateLiftIcon,
  Shuttle: ShuttleIcon,
  Parking: ParkingIcon,
  Motorcycle: MotorcycleIcon,
  EvCharger: EvChargerIcon,
  AccessControl: AccessControlIcon,
  Security: SecurityIcon,
  Gym: GymIcon,
  Pool: PoolIcon,
  PrivatePool: PrivatePoolIcon,
  Jacuzzi: JacuzziIcon,
  Sauna: SaunaIcon,
  SteamRoom: SteamRoomIcon,
  SportArea: SportAreaIcon,
  GolfSimulator: GolfSimulatorIcon,
  Stadium: StadiumIcon,
  Cinema: CinemaIcon,
  Playground: PlaygroundIcon,
  Pet: PetIcon,
  MeetingRoom: MeetingRoomIcon,
  CoWorking: CoWorkingIcon,
  Restaurant: RestaurantIcon,
  Cafe: CafeIcon,
  DiningRoom: DiningRoomIcon,
  CoKitchen: CoKitchenIcon,
  Lobby: LobbyIcon,
  Lounge: LoungeIcon,
  Clubhouse: ClubhouseIcon,
  Store: StoreIcon,
  Library: LibraryIcon,
  Laundry: LaundryIcon,
  Garden: GardenIcon,
  Wifi: WifiIcon
}; 