/**
 * Physical branches. Used by the Locations page, the pickup and dine-in
 * checkout steps, and the branch picker in the footer.
 *
 *   services   which order types this branch supports — must match the ids in
 *              data/orderTypes.js ('delivery' | 'pickup' | 'dine-in')
 *   deliveryAreas  neighbourhoods this branch delivers to, shown on the card
 *   mapUrl     external maps link opened by "View location"
 */
export const branches = [
  {
    id: 'zamalek',
    name: 'Zamalek',
    address: '18 Brazil Street, Zamalek, Cairo',
    phone: '19555',
    hours: '10:00 AM – 2:00 AM',
    services: ['delivery', 'pickup', 'dine-in'],
    deliveryAreas: ['Zamalek', 'Downtown', 'Garden City', 'Agouza'],
    image: '/assets/images/restaurant/branch-zamalek.jpg',
    mapUrl: 'https://www.openstreetmap.org/search?query=Zamalek%20Cairo',
  },
  {
    id: 'new-cairo',
    name: 'New Cairo — 90th Street',
    address: '5 North 90th Street, Fifth Settlement, New Cairo',
    phone: '19555',
    hours: '10:00 AM – 3:00 AM',
    services: ['delivery', 'pickup', 'dine-in'],
    deliveryAreas: ['Fifth Settlement', 'Rehab', 'Madinaty', 'Katameya'],
    image: '/assets/images/restaurant/branch-new-cairo.jpg',
    mapUrl: 'https://www.openstreetmap.org/search?query=New%20Cairo',
  },
  {
    id: 'maadi',
    name: 'Maadi',
    address: '9 Road 9, Maadi Sarayat, Cairo',
    phone: '19555',
    hours: '11:00 AM – 1:00 AM',
    services: ['delivery', 'pickup', 'dine-in'],
    deliveryAreas: ['Maadi', 'Degla', 'Zahraa El Maadi', 'Basatin'],
    image: '/assets/images/restaurant/branch-maadi.jpg',
    mapUrl: 'https://www.openstreetmap.org/search?query=Maadi%20Cairo',
  },
  {
    id: 'sheikh-zayed',
    name: 'Sheikh Zayed',
    address: 'Arkan Plaza, Sheikh Zayed City, Giza',
    phone: '19555',
    hours: '10:00 AM – 2:00 AM',
    services: ['delivery', 'pickup'],
    deliveryAreas: ['Sheikh Zayed', 'Beverly Hills', '6th of October', 'Dreamland'],
    image: '/assets/images/restaurant/branch-sheikh-zayed.jpg',
    mapUrl: 'https://www.openstreetmap.org/search?query=Sheikh%20Zayed%20City',
  },
  {
    id: 'heliopolis',
    name: 'Heliopolis',
    address: '31 Baghdad Street, Korba, Heliopolis, Cairo',
    phone: '19555',
    hours: '10:00 AM – 1:00 AM',
    services: ['delivery', 'pickup', 'dine-in'],
    deliveryAreas: ['Heliopolis', 'Nasr City', 'Sheraton', 'Almaza'],
    image: '/assets/images/restaurant/branch-heliopolis.jpg',
    mapUrl: 'https://www.openstreetmap.org/search?query=Heliopolis%20Cairo',
  },
  {
    id: 'alexandria',
    name: 'Alexandria — Corniche',
    address: '120 El Geish Road, Stanley, Alexandria',
    phone: '19555',
    hours: '11:00 AM – 2:00 AM',
    services: ['delivery', 'pickup', 'dine-in'],
    deliveryAreas: ['Stanley', 'Roushdy', 'San Stefano', 'Gleem'],
    image: '/assets/images/restaurant/branch-alexandria.jpg',
    mapUrl: 'https://www.openstreetmap.org/search?query=Stanley%20Alexandria',
  },
]

export function getBranchById(branchId) {
  return branches.find((branch) => branch.id === branchId)
}

/** Branches that support a given order type, e.g. only those that do dine-in. */
export function getBranchesForOrderType(orderTypeId) {
  return branches.filter((branch) => branch.services.includes(orderTypeId))
}
