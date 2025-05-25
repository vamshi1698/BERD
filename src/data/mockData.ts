import { 
  CivilianUser, 
  AuthorityUser, 
  AdminUser 
} from '../types/user';
import { 
  Incident, 
  SafeZone 
} from '../types/incident';

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Resource {
  name: string;
  quantity: number;
  status: 'requested' | 'in-transit' | 'deployed';
}

export interface IncidentNote {
  authorId: string;
  content: string;
  timestamp: Date;
}

// Mock Users
export const mockUsers: (CivilianUser | AuthorityUser | AdminUser)[] = [
  {
  id: 'civilian-2',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  role: 'civilian',
  avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  phone: '+91 9876543211',
  createdAt: new Date('2023-01-20'),
  lastActive: new Date(),
  homeAddress: '123 MG Road, Bangalore',
  safetyStatus: 'safe',
  familyGroup: ['civilian-1', 'civilian-3'],
  emergencyContacts: [
    {
      name: 'Rahul P',
      relationship: 'Husband',
      phone: '+91 8431591698',
      email: 'rahul.sharma@example.com'
    }
  ]
},
{
  id: 'civilian-3',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  role: 'civilian',
  createdAt: new Date('2023-02-10'),
  lastActive: new Date(),
  homeAddress: '123 MG Road, Bangalore',
  safetyStatus: 'unknown',
  familyGroup: ['civilian-1', 'civilian-2'],
  emergencyContacts: [
    {
      name: 'Priya Sharma',
      relationship: 'Mother',
      phone: '+91 9876543211',
      email: 'priya.sharma@example.com'
    }
  ]
},
{
  id: 'authority-1',
  name: 'Inspector Vikram Singh',
  email: 'vikram.singh@police.gov.in',
  role: 'authority',
  avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  phone: '+91 9876543200',
  createdAt: new Date('2022-11-05'),
  lastActive: new Date(),
  authorityType: 'police',
  badgeNumber: 'BCP-1234',
  department: 'Bangalore City Police',
  jurisdiction: 'Indiranagar',
  status: 'on-duty',
  specialization: ['riot-control', 'emergency-response']
},
{
  id: 'admin',
  name: 'Ramesh babu',
  email: 'Ramesh@admin.in',
  role: 'admin',
  avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  phone: '+91 9876543200',
  createdAt: new Date('2022-11-05'),
  lastActive: new Date(),
  accessLevel: 'super',
  departments: ['all']
},

];

// Bangalore Coordinates
const bangaloreCenter = {
  latitude: 12.9716,
  longitude: 77.5946
};

// Helper to generate coordinates near Bangalore
const nearBangalore = (radiusKm = 5) => {
  const lat = bangaloreCenter.latitude + (Math.random() - 0.5) * 0.1 * radiusKm;
  const lng = bangaloreCenter.longitude + (Math.random() - 0.5) * 0.1 * radiusKm;
  return { latitude: lat, longitude: lng };
};

// Utility to shuffle arrays
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Define the first 3 incidents as variables (not directly in mockIncidents)
const baseIncidents: Incident[] = [
  {
    id: 'incident-1',
    title: 'Major Flooding on Outer Ring Road',
    description: 'Several areas submerged, traffic at standstill. Multiple vehicles stranded.',
    type: 'flood',
    severity: 'high',
    status: 'in_progress',
    location: {
      latitude: 12.9616,
      longitude: 77.5846,
      address: 'Outer Ring Road, near Bellandur Lake',
      landmark: 'Bellandur Lake'
    },
    reportedBy: 'civilian-1',
    reportedAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    images: [
      'https://s01.sgp1.digitaloceanspaces.com/inline/933197-ilnjqbojsz-1565241815.jpg'
    ],
    affectedArea: 1500,
    assignedTo: ['authority-1'],
    verifiedBy: 'authority-1',
    casualties: {
      confirmed: 0,
      estimated: 0
    },
    resources: {
      requested: [
        { id: 'res-1', type: 'vehicle', name: 'Rescue Boats', quantity: 3, status: 'en_route' },
        { id: 'res-2', type: 'personnel', name: 'Rescue Team', quantity: 10, status: 'en_route' }
      ],
      deployed: [
        { id: 'res-3', type: 'vehicle', name: 'Water Pumps', quantity: 2, status: 'in_use' }
      ]
    },
    weatherConditions: {
      rainfall: 120,
      visibility: 'poor'
    },
    notes: [
      {
        id: 'note-1',
        text: 'Water level rising rapidly. Need immediate evacuation assistance.',
        createdBy: 'civilian-1',
        createdAt: new Date(Date.now() - 3000000),
        visibility: 'public'
      },
      {
        id: 'note-2',
        text: 'Dispatching rescue boats from Bellandur station.',
        createdBy: 'authority-1',
        createdAt: new Date(Date.now() - 2400000),
        visibility: 'authority'
      }
    ]
  },
  {
    id: 'incident-2',
    title: 'Building Fire in Koramangala',
    description: 'Commercial building on fire. Smoke visible from several blocks.',
    type: 'fire',
    severity: 'critical',
    status: 'in_progress',
    location: {
      latitude: 12.9387,
      longitude: 77.6142,
      address: '80 Feet Road, Koramangala',
      landmark: 'Near Forum Mall'
    },
    reportedBy: 'civilian-2',
    reportedAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 600000), 
    images: [
      'https://s01.sgp1.digitaloceanspaces.com/inline/933197-ilnjqbojsz-1565241815.jpg'
    ],
    affectedArea: 200,
    assignedTo: ['authority-2'],
    verifiedBy: 'authority-2',
    casualties: {
      confirmed: 0,
      estimated: 5
    },
    resources: {
      requested: [
        { id: 'res-4', type: 'vehicle', name: 'Fire Engines', quantity: 5, status: 'en_route' },
        { id: 'res-5', type: 'personnel', name: 'Firefighters', quantity: 20, status: 'en_route' },
        { id: 'res-6', type: 'medical', name: 'Ambulances', quantity: 3, status: 'en_route' }
      ],
      deployed: [
        { id: 'res-7', type: 'vehicle', name: 'Fire Engines', quantity: 2, status: 'in_use' },
        { id: 'res-8', type: 'medical', name: 'Ambulances', quantity: 1, status: 'in_use' }
      ]
    },
    notes: [
      {
        id: 'note-3',
        text: 'Fire spreading to adjacent buildings. Evacuation in progress.',
        createdBy: 'authority-2',
        createdAt: new Date(Date.now() - 1200000),
        visibility: 'public'
      }
    ]
  },
  {
    id: 'incident-3',
    title: 'Traffic Accident on Airport Road',
    description: 'Multi-vehicle collision. Traffic backed up for kilometers.',
    type: 'accident',
    severity: 'medium',
    status: 'verified',
    location: {
      latitude: 13.0358,
      longitude: 77.5970,
      address: 'Airport Road, near Hebbal Flyover',
      landmark: 'Hebbal Flyover'
    },
    reportedBy: 'civilian-3',
    reportedAt: new Date(Date.now() - 5400000), // 1.5 hours ago
    updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
    images: [
      'https://e3.365dm.com/22/05/768x432/skynews-india-delhi-fire_5770982.jpg?20220513213511'
    ],
    affectedArea: 300,
    assignedTo: ['authority-1'],
    casualties: {
      confirmed: 2,
      estimated: 5
    },
    resources: {
      requested: [
        { id: 'res-9', type: 'medical', name: 'Ambulances', quantity: 3, status: 'en_route' },
        { id: 'res-10', type: 'personnel', name: 'Traffic Police', quantity: 5, status: 'en_route' }
      ],
      deployed: []
    },
    notes: [
      {
        id: 'note-4',
        text: 'Two cars and one truck involved. Injuries reported.',
        createdBy: 'civilian-3',
        createdAt: new Date(Date.now() - 5000000),
        visibility: 'public'
      }
    ]
  }
];

// Mock Safe Zones
export const mockSafeZones: SafeZone[] = [
  {
    id: 'safezone-1',
    name: 'Koramangala Indoor Stadium',
    location: {
      latitude: 12.9387,
      longitude: 77.6142,
      address: '80 Feet Road, Koramangala',
      landmark: 'Near Forum Mall'
    },
    capacity: 1000,
    currentOccupancy: 350,
    facilities: ['food', 'water', 'medical', 'sleeping', 'bathrooms'],
    contactPerson: 'Sanjay Patil',
    contactPhone: '+91 9876543222',
    status: 'open',
    type: 'shelter',
    address: undefined
  },
  {
    id: 'safezone-2',
    name: 'St. John\'s Medical Camp',
    location: {
      latitude: 12.9613,
      longitude: 77.6142,
      address: 'MG Road, near Trinity Metro',
      landmark: 'Trinity Circle'
    },
    capacity: 500,
    currentOccupancy: 120,
    facilities: ['medical', 'water', 'bathrooms'],
    contactPerson: 'Dr. Nisha Reddy',
    contactPhone: '+91 9876543223',
    status: 'open',
    type: 'medical',
    address: undefined
  },
  {
    id: 'safezone-3',
    name: 'Whitefield Community Hall',
    location: {
      latitude: 12.9698,
      longitude: 77.7499,
      address: 'Whitefield Main Road',
      landmark: 'Near Whitefield Bus Station'
    },
    capacity: 800,
    currentOccupancy: 600,
    facilities: ['food', 'water', 'sleeping', 'bathrooms'],
    contactPerson: 'Anand Krishnan',
    contactPhone: '+91 9876543224',
    status: 'open',
    type: 'shelter',
    address: undefined
  },
  {
    id: 'safezone-4',
    name: 'Electronic City Relief Center',
    location: {
      latitude: 12.8399,
      longitude: 77.6770,
      address: 'Electronic City Phase 1',
      landmark: 'Near Wipro Gate'
    },
    capacity: 1200,
    currentOccupancy: 1200,
    facilities: ['food', 'water', 'medical', 'sleeping', 'bathrooms'],
    contactPerson: 'Varsha Menon',
    contactPhone: '+91 9876543225',
    status: 'full',
    type: 'multi-purpose',
    address: undefined
  }
];

mockUsers.push(
  {
    id: 'civilian-4',
    name: 'Rohit Kumar',
    email: 'rohit.kumar@example.com',
    role: 'civilian',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    phone: '+91 9988776655',
    createdAt: new Date('2023-03-15'),
    lastActive: new Date(),
    homeAddress: '45 Residency Road, Bangalore',
    safetyStatus: 'unknown',
    familyGroup: ['civilian-2'],
    emergencyContacts: [
      {
        name: 'Priya Sharma',
        relationship: 'Friend',
        phone: '+91 9876543211',
        email: 'priya.sharma@example.com'
      }
    ]
  },
  {
    id: 'authority-2',
    name: 'Dr. Nisha Reddy',
    email: 'nisha.reddy@hospital.org',
    role: 'authority',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    phone: '+91 9123456789',
    createdAt: new Date('2022-10-10'),
    lastActive: new Date(),
    authorityType: 'medical',
    badgeNumber: 'MED-5678',
    department: 'St. John\'s Hospital',
    jurisdiction: 'MG Road',
    status: 'on-duty',
    specialization: ['emergency-medicine', 'triage']
  }
);

// (moved below, after mockIncidents declaration)

// Add 5 more random mock users
for (let i = 5; i <= 9; i++) {
  mockUsers.push({
    id: `civilian-${i}`,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: 'civilian',
    avatar: `https://randomuser.me/api/portraits/men/${i + 10}.jpg`,
    phone: `+91 90000000${i}`,
    createdAt: new Date(Date.now() - i * 10000000),
    lastActive: new Date(),
    homeAddress: `${i * 10} Residency Road, Bangalore`,
    safetyStatus: i % 2 === 0 ? 'safe' : 'unknown',
    familyGroup: [],
    emergencyContacts: [
      {
        name: `Contact ${i}`,
        relationship: 'Friend',
        phone: `+91 90000000${i + 1}`,
        email: `contact${i}@example.com`
      }
    ]
  });
}

// (Moved below, after mockIncidents declaration)

// Add 5 more random mock safe zones
for (let i = 6; i <= 10; i++) {
  mockSafeZones.push({
    id: `safezone-${i}`,
    name: `Safe Zone ${i}`,
    location: {
      latitude: 12.9 + Math.random() * 0.1,
      longitude: 77.5 + Math.random() * 0.1,
      address: `${i * 7} Safe Street, Bangalore`,
      landmark: `Landmark SZ${i}`
    },
    capacity: 500 + Math.floor(Math.random() * 1000),
    currentOccupancy: Math.floor(Math.random() * 500),
    facilities: ['food', 'water', 'medical', 'bathrooms'].filter(() => Math.random() > 0.5),
    contactPerson: `Contact SZ${i}`,
    contactPhone: `+91 9000000${i}`,
    status: (['open', 'full', 'closed'] as ('open' | 'full' | 'closed')[])[Math.floor(Math.random() * 3)],
    type: (['shelter', 'medical', 'food', 'multi-purpose'] as ('shelter' | 'medical' | 'food' | 'multi-purpose')[])[Math.floor(Math.random() * 4)],
    address: undefined
  });
}

// Now, build the main mockIncidents array from baseIncidents and generated ones
const mockIncidents: Incident[] = [
  ...baseIncidents
];

// Add more mock incidents
mockIncidents.push(
  {
    id: 'incident-4',
    title: 'Riot near City Market',
    description: 'Crowd gathering and unrest reported. Police deployed.',
    type: 'riot',
    severity: 'medium',
    status: 'reported',
    location: {
      ...nearBangalore(4),
      address: 'City Market, Bangalore',
      landmark: 'KR Market'
    },
    reportedBy: 'civilian-4',
    reportedAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(Date.now() - 7000000),
    images: [
'https://i0.wp.com/www.opindia.com/wp-content/uploads/2020/02/Delhi-riots-wikipedia-article.jpg?fit=696%2C391&ssl=1'
    ],
    affectedArea: 500,
    assignedTo: ['authority-1'],
    verifiedBy: '',
    casualties: {
      confirmed: 0,
      estimated: 0
    },
    resources: {
      requested: [
        { id: 'res-11', type: 'personnel', name: 'Police Units', quantity: 15, status: 'en_route' }
      ],
      deployed: []
    },
    notes: [
      {
        id: 'note-5',
        text: 'Situation tense but under control.',
        createdBy: 'authority-1',
        createdAt: new Date(Date.now() - 6900000),
        visibility: 'authority'
      }
    ]
  },
  {
    id: 'incident-5',
    title: 'Power Outage in Whitefield',
    description: 'Widespread power failure affecting residential and commercial areas.',
    type: 'infrastructure',
    severity: 'low',
    status: 'resolved',
    location: {
      ...nearBangalore(8),
      address: 'Whitefield Main Road',
      landmark: 'Whitefield Bus Station'
    },
    reportedBy: 'civilian-3',
    reportedAt: new Date(Date.now() - 10800000), // 3 hours ago
    updatedAt: new Date(Date.now() - 9000000), // 2.5 hours ago
    images: ['https://ichef.bbci.co.uk/news/480/cpsprodpb/3419/production/_114873331_mediaitem114873329.jpg.webp'],
    affectedArea: 2000,
    assignedTo: ['authority-2'],
    verifiedBy: 'authority-2',
    casualties: {
      confirmed: 0,
      estimated: 0
    },
    resources: {
      requested: [
        { id: 'res-12', type: 'personnel', name: 'Electricians', quantity: 5, status: 'en_route' }
      ],
      deployed: [
        { id: 'res-13', type: 'equipment', name: 'Generators', quantity: 2, status: 'in_use' }
      ]
    },
    notes: [
      {
        id: 'note-6',
        text: 'Power restored to most areas.',
        createdBy: 'authority-2',
        createdAt: new Date(Date.now() - 8700000),
        visibility: 'public'
      }
    ]
  }
);

// Add 5 more random mock incidents with detailed fields
for (let i = 6; i <= 10; i++) {
  const typeArr = ['fire', 'flood', 'accident', 'riot', 'medical'] as import('../types/incident').IncidentType[];
  const severityArr = ['low', 'medium', 'high', 'critical'] as import('../types/incident').IncidentSeverity[];
  const statusArr = ['reported', 'verified', 'in_progress', 'resolved'] as import('../types/incident').IncidentStatus[];
  const type = typeArr[Math.floor(Math.random() * typeArr.length)];
  const severity = severityArr[Math.floor(Math.random() * severityArr.length)];
  const status = statusArr[Math.floor(Math.random() * statusArr.length)];
  const images = [
'https://imgs.search.brave.com/ArpDWlwloWWWZ1kgsGsvAJj-PivRZETZvHx-G3GhM1Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vZ2lpZGdT/RXJEdHc1dHFoaS1P/QVVzUmdVSHZXUTJm/Vl9mcWNIMHdYSy11/Zy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldGbi9aWE11YVc1/a2FXRnVaWGh3L2Nt/VnpjeTVqYjIwdk1q/QXkvTkM4eE1TOVFU/VkJNTFRJdS9hbkJu/UDNjOU1qY3c',   
 'https://imgs.search.brave.com/u9AC-3V1lmgwR4rkTtbeFcXB3SaH8jC0mdqn0UgkEmY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vWjlTaHBu/UnlFNE9LMjQycGp2/cWNtclhhdFFsM0NT/a1JTSk9Zalo4QWY1/RS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkz/ZDNjdS9ZV3hxWVhw/bFpYSmhMbU52L2JT/OTNjQzFqYjI1MFpX/NTAvTDNWd2JHOWha/SE12TWpBeS9NaTh3/T1M5b1h6VTNPVEEz/L01qVTNMbXB3Wno5/bWFYUTkvTVRFM01D/dzNNamttY1hWaC9i/R2wwZVQwNE1B',
    'https://imgs.search.brave.com/ZHMMJsnktGbQjCfAh0LxfeVZt-w03mC2PJPpVbjlW7A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vZUNxR2Q3/RVhzR0h3ODkyQU1G/NXAzZ1ZETUtjWWsz/b1AyTGRzUkZOMmdI/Zy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlq/TG01ay9kSFpwYldj/dVkyOXRMekl3L01q/TXRNRFl2TVc1dE5q/RnovZEd0ZlltVnVa/MkZzZFhKMS9MV0Zq/WTJsa1pXNTBYelkw/L01IZzBPREJmTVRo/ZlNuVnUvWlY4eU15/NXFjR2NfWkc5My9i/bk5wZW1VOU1qUTFP/akUyL013',
'https://imgs.search.brave.com/_8lIqzaOahBrafKud1LfIM2Tfiu5xedDgAT93UVFM6g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20veTVOR05S/R21KZEpBd1R1LWtI/TV9YTVFEQ1hQYm1a/ZjZLZXdOWVY5T1h4/Yy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTl1/Y0hJdS9ZbkpwWjJo/MGMzQnZkR05rL2Jp/NWpiMjB2WkdsdGN6/TXYvWkdWbVlYVnNk/Qzl6ZEhKcC9jQzlt/WVd4elpTOWpjbTl3/L0x6WXpORFo0TkRJ/ek1Tc3cvS3pBdmNt/VnphWHBsTHpFeC9N/REF2Y1hWaGJHbDBl/UzgxL01DOW1iM0p0/WVhRdmFuQmwvWnk4/X2RYSnNQV2gwZEhB/Ni9MeTl1Y0hJdFlu/SnBaMmgwL2MzQnZk/QzV6TXk1aGJXRjYv/YjI1aGQzTXVZMjl0/THpNMi9MMlUzTHpR/eU1tRTBNR05pL05E/SXlORGxqTTJVeFlU/YzEvTmpkaFltRTVZ/ek12WVhBeS9OREl4/TXpRMk1ESTRNakUy/L055NXFjR2M'
  ];
  const randomImages = Array.from({length: Math.floor(Math.random() * 3)}, () => images[Math.floor(Math.random() * images.length)]);
  const resourceTypes = [
    { id: `res-${i}a`, type: 'vehicle' as 'vehicle', name: 'Rescue Vehicle', quantity: Math.floor(Math.random() * 5) + 1, status: 'en_route' as 'en_route' },
    { id: `res-${i}b`, type: 'personnel' as 'personnel', name: 'Rescue Team', quantity: Math.floor(Math.random() * 10) + 1, status: 'en_route' as 'en_route' },
    { id: `res-${i}c`, type: 'medical' as 'medical', name: 'Ambulance', quantity: Math.floor(Math.random() * 3) + 1, status: 'en_route' as 'en_route' }
  ];
  const requestedResources = resourceTypes.filter(() => Math.random() > 0.5);
  const deployedResources = resourceTypes.filter(() => Math.random() > 0.7);

  mockIncidents.push({
    id: `incident-${i}`,
    title: [
      'Transformer Fire in Jayanagar',
      'Flash Flood in HSR Layout',
      'Bus Accident on Mysore Road',
      'Protest at Town Hall',
      'Medical Emergency at IT Park'
    ][i - 6],
    description: [
      'A transformer caught fire causing power outage in the area.',
      'Sudden heavy rain caused waterlogging and traffic jams.',
      'A city bus collided with a car, several injuries reported.',
      'Large group protesting, traffic diversions in place.',
      'Employee collapsed, ambulance dispatched to IT Park.'
    ][i - 6],
    type,
    severity,
    status,
    location: {
      ...nearBangalore(Math.random() * 10),
      address: [
        'Jayanagar 4th Block',
        '27th Main, HSR Layout',
        'Mysore Road, near NICE junction',
        'Town Hall Circle',
        'Manyata Tech Park'
      ][i - 6],
      landmark: [
        'Near Jain Temple',
        'Near Agara Lake',
        'Near Gopalan Mall',
        'Opposite BBMP Office',
        'Block B, Gate 3'
      ][i - 6]
    },
    reportedBy: `civilian-${Math.floor(Math.random() * 9) + 1}`,
    reportedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 5000000)),
    images: randomImages,
    affectedArea: Math.floor(Math.random() * 2000),
    assignedTo: [`authority-${Math.floor(Math.random() * 2) + 1}`],
    verifiedBy: '',
    casualties: {
      confirmed: Math.floor(Math.random() * 3),
      estimated: Math.floor(Math.random() * 5)
    },
    resources: {
      requested: requestedResources,
      deployed: deployedResources
    },
    notes: [
      {
        id: `note-${i}a`,
        text: [
          'Fire brigade on the way.',
          'Water level rising, avoid the area.',
          'Police and ambulance at the scene.',
          'Situation peaceful, but heavy police presence.',
          'Medical team attending to the patient.'
        ][i - 6],
        createdBy: `authority-${Math.floor(Math.random() * 2) + 1}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 4000000)),
        visibility: Math.random() > 0.5 ? 'public' : 'authority'
      }
    ]
  });
}

// Export the mockIncidents array
export { mockIncidents };

// Shuffle all incidents on load and in randomizeMockData
function shuffleIncidents() {
  mockIncidents.splice(0, mockIncidents.length, ...shuffleArray(mockIncidents));
}

// Shuffle once on module load
shuffleIncidents();

// Exported function to shuffle on login/signout
export function randomizeMockData() {
  // Shuffle users, incidents, and safe zones
  mockUsers.splice(0, mockUsers.length, ...shuffleArray(mockUsers));
  shuffleIncidents();
  mockSafeZones.splice(0, mockSafeZones.length, ...shuffleArray(mockSafeZones));
}