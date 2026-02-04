
import { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'air-conditioner',
    title: 'Air Conditioner',
    description: 'Expert AC repair, jet cleaning, and gas refilling for all brands.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    services: [
      { id: 'ac-1', name: 'Anti-Bacterial Jet Service', description: 'Deep jet-pump cleaning for 2x cooling efficiency.', price: 599, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1581092921461-70320a44040a?auto=format&fit=crop&q=80&w=800', issuesResolved: ['Low cooling', 'Bad odor', 'High bills'] },
      { id: 'ac-2', name: 'Advanced AC Repair', description: 'PCB, motor, or capacitor replacement.', price: 349, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800' },
      { id: 'ac-3', name: 'Gas Refill & Leak Fix', description: 'Accurate gas charging (R32/R410/R22).', price: 2499, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1794714?auto=format&fit=crop&q=80&w=800' },
      { id: 'ac-4', name: 'Professional Installation', description: 'Safe mounting and stabilization.', price: 1499, estimatedTime: '2 hours', imageUrl: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'electrician',
    title: 'Electrician',
    description: 'Complete electrical solutions, wiring, and switchboard repairs.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    services: [
      { id: 'ele-1', name: 'Switchboard Repair', description: 'Socket and switch replacement.', price: 199, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
      { id: 'ele-2', name: 'Full House Wiring', description: 'Checkup and new wiring points.', price: 999, estimatedTime: '4 hours', imageUrl: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    description: 'Fixing leakages, tap repairs, and tank cleaning.',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
    services: [
      { id: 'plu-1', name: 'Tap & Leakage Fix', description: 'Repairing dripping taps and pipes.', price: 149, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800' },
      { id: 'plu-2', name: 'Tank Cleaning', description: 'Deep cleaning for overhead water tanks.', price: 499, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1603566629039-dd61e883f07d?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'washing-machine',
    title: 'Washing Machine',
    description: 'Top/Front load repair and deep drum cleaning.',
    imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800',
    services: [
      { id: 'wm-1', name: 'Drum Deep Clean', description: 'Scaling and sludge removal.', price: 699, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800' },
      { id: 'wm-2', name: 'Motor/PCB Repair', description: 'Fixing spin and wash cycle issues.', price: 549, estimatedTime: '90 mins', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'tv-repair',
    title: 'TV',
    description: 'LED/Smart TV panel and motherboard motherboard repair.',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
    services: [
      { id: 'tv-1', name: 'Backlight Replacement', description: 'Fixing sound-but-no-picture issues.', price: 999, estimatedTime: '2 hours', imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800' },
      { id: 'tv-2', name: 'Smart TV Setup', description: 'Software and Wi-Fi configuration.', price: 299, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'refrigerator',
    title: 'Refrigerator',
    description: 'Gas refilling and compressor repair for single/double door.',
    imageUrl: 'https://images.unsplash.com/photo-1571175432291-fe8a829e06b9?auto=format&fit=crop&q=80&w=800',
    services: [
      { id: 'ref-1', name: 'Gas Charging', description: 'Refrigerant refill and leak fix.', price: 1800, estimatedTime: '90 mins', imageUrl: 'https://images.unsplash.com/photo-1571175432291-fe8a829e06b9?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  { id: 'deep-freezer', title: 'Deep Freezer', description: 'Commercial freezer cooling repair.', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', services: [{ id: 'df-1', name: 'Cooling Fix', description: 'Thermostat/Compressor repair.', price: 899, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'ceiling-fan', title: 'Ceiling & Table Fan', description: 'Repairing high speed and noise issues.', imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800', services: [{ id: 'fn-1', name: 'Capacitor Replacement', description: 'Speed increase service.', price: 149, estimatedTime: '20 mins', imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'water-purifier', title: 'Water Purifier', description: 'RO filter change and TDS calibration.', imageUrl: 'https://images.unsplash.com/photo-1603566629039-dd61e883f07d?auto=format&fit=crop&q=80&w=800', services: [{ id: 'wp-1', name: 'Standard RO Service', description: 'Filter and pre-filter change.', price: 599, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1603566629039-dd61e883f07d?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'dishwasher', title: 'Dishwasher', description: 'Control board and drainage repair.', imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800', services: [{ id: 'dw-1', name: 'General Repair', description: 'Fixing error codes and drain.', price: 699, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'dispenser', title: 'Dispenser', description: 'Hot and cold water dispenser repair.', imageUrl: 'https://images.unsplash.com/photo-1603566629039-dd61e883f07d?auto=format&fit=crop&q=80&w=800', services: [{ id: 'ds-1', name: 'Thermostat Fix', description: 'Heating/Cooling repair.', price: 349, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1603566629039-dd61e883f07d?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'visi-cooler', title: 'Visi Cooler', description: 'Display fridge service for showrooms.', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', services: [{ id: 'vc-1', name: 'Cooling Maintenance', description: 'Gas check and motor service.', price: 999, estimatedTime: '90 mins', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'water-cooler', title: 'Water Cooler', description: 'Commercial water cooler expert repair.', imageUrl: 'https://images.unsplash.com/photo-1585837500580-e15009fa98c7?auto=format&fit=crop&q=80&w=800', services: [{ id: 'wc-1', name: 'Gas Refill', description: 'R134a charging.', price: 1200, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1585837500580-e15009fa98c7?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'air-cooler', title: 'Air Cooler', description: 'Motor, pump, and cleaning service.', imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800', services: [{ id: 'ac-c', name: 'Motor Repair', description: 'Speed control fix.', price: 299, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'cctv-camera', title: 'CCTV Camera', description: 'Installation and cabling for security.', imageUrl: 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&q=80&w=800', services: [{ id: 'cc-1', name: 'Cam Install', description: 'Precise mounting.', price: 399, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'it-repair', title: 'Computer & Laptop', description: 'Hardware and software troubleshooting.', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800', services: [{ id: 'it-1', name: 'OS Installation', description: 'Windows/Mac setup.', price: 499, estimatedTime: '60 mins', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'printer', title: 'Printer', description: 'Cartridge refill and jam repairs.', imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800', services: [{ id: 'pr-1', name: 'Cartridge Refill', description: 'Black/Color refill.', price: 349, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'stabilizer', title: 'Stabilizer', description: 'Fixing input-output and voltage issues.', imageUrl: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800', services: [{ id: 'st-1', name: 'PCB Repair', description: 'Mainboard component fix.', price: 299, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'chimney', title: 'Chimneys', description: 'Deep cleaning and motor servicing.', imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800', services: [{ id: 'ch-1', name: 'Deep Clean', description: 'Blower and filter cleaning.', price: 899, estimatedTime: '90 mins', imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'microwave', title: 'Microwave oven', description: 'Heating and panel board repairs.', imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=800', services: [{ id: 'mw-1', name: 'Magnetron Repair', description: 'Fixing heating problems.', price: 449, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'induction', title: 'Electric Induction', description: 'Repair for heating and panel buttons.', imageUrl: 'https://images.unsplash.com/photo-1585659722982-796ca5cca2a0?auto=format&fit=crop&q=80&w=800', services: [{ id: 'in-1', name: 'Panel Repair', description: 'Button/Touch fix.', price: 249, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1585659722982-796ca5cca2a0?auto=format&fit=crop&q=80&w=800' }] },

  { id: 'geyser', title: 'Geysers', description: 'Instant and storage water heater repair.', imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800', services: [{ id: 'gy-1', name: 'Element Fix', description: 'Heating element replacement.', price: 399, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'home-theatre', title: 'Home theatre/ Sound box', description: 'Audio setup and amplifier repair.', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', services: [{ id: 'ht-1', name: 'Speaker Repair', description: 'Voice coil replacement.', price: 299, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'inverter', title: 'Inverter Batteries', description: 'Battery water and terminal checkup.', imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800', services: [{ id: 'ib-1', name: 'Full Checkup', description: 'Voltage and water topping.', price: 249, estimatedTime: '30 mins', imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800' }] },
  { id: 'vacuum', title: 'Vacuum cleaner', description: 'Suction motor and filter servicing.', imageUrl: 'https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=800', services: [{ id: 'vc-v', name: 'Motor Repair', description: 'Suction power optimization.', price: 399, estimatedTime: '45 mins', imageUrl: 'https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=800' }] }
];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1581092162384-8987c1794714?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
];

export const BANNERS = [
  {
    id: 1,
    title: "Professional AC Care",
    subtitle: "Emergency Repairs & Expert Maintenance at Your Doorstep",
    image: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=100&w=1600"
  },
  {
    id: 2,
    title: "100% Genuine Spare Parts",
    subtitle: "Transparent Pricing & Verified Background Technicians",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=100&w=1600"
  }
];

export const TERMS_SECTIONS = [
  {
    id: 1,
    title: "Acceptance of Terms",
    content: "By accessing and using Antarc Services, you agree to be bound by these Terms and Conditions. Our services are available to our customers and surrounding urban areas."
  },
  {
    id: 2,
    title: "Service Scope",
    content: "Antarc Services provides repair, installation, and maintenance for residential and commercial electronic appliances. Emergency services are subject to technician availability."
  },
  {
    id: 3,
    title: "Payment Terms",
    content: "Payment is expected upon completion of the service. We accept Cash, UPI, and Digital Wallets. Visiting charges are applicable even if no repair is performed."
  }
];

export const MOCK_ENQUIRIES = [
  {
    id: 'EC-78290-REQ',
    serviceName: 'Anti-Bacterial AC Service',
    status: 'Technician Assigned',
    brand: 'Voltas',
    date: '24 May, 2024',
    location: 'Near New Mondha, VIP Road, Nanded'
  },
  {
    id: 'EC-55102-REQ',
    serviceName: 'Refrigerator Repair',
    status: 'Completed',
    brand: 'Samsung',
    date: '20 May, 2024',
    location: 'Vazirabad, Nanded'
  }
];
