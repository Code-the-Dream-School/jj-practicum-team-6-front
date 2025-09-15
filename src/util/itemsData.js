// Shared Dummy or mock data to eliminate duplication and have ease - new file added
// hardcoding the coordinates (lat and long) temporary for now
export const mockItems = [
  {
    id: 1,
    title: "Black iPhone 13 Pro",
    status: "Lost",
    location: "Central Park, NY",
    date: "2025-09-12",
    lat: 40.7829,
    lng: -73.9654,
    description: "Lost my black 13 Pro with a blue case.",
    imageUrl: "/iphone.jpg",
    userId: 123,
  },
  {
    id: 2,
    title: "Brown Leather Wallet",
    status: "Found",
    location: "Times Square, NY",
    date: "2025-09-12",
    lat: 40.758,
    lng: -73.9855,
    description: "Found wallet near subway station.",
    imageUrl: "/wallet.jpg",
    userId: 456,
  },
  {
    id: 3,
    title: "House Keys",
    status: "Lost",
    location: "Brooklyn Bridge",
    date: "2025-09-11",
    lat: 40.7061,
    lng: -73.9969,
    description: "Set of keys with blue keychain.",
    imageUrl: "/keys.jpg",
    userId: 123,
  },
  {
    id: 4,
    title: "AirPods Pro",
    status: "Found",
    location: "Madison Square Park",
    date: "2025-09-11",
    lat: 40.7414,
    lng: -73.9882,
    description: "Found AirPods on bench.",
    imageUrl: "/airpods.jpg",
    userId: 789,
  },
  {
    id: 5,
    title: "Red Backpack",
    status: "Lost",
    location: "Washington Square Park",
    date: "2025-09-10",
    lat: 40.7308,
    lng: -73.9973,
    description: "Red JanSport backpack with laptop inside.",
    imageUrl: "/backpack.jpg",
    userId: 123,
  },
  {
    id: 6,
    title: "Gold Ring",
    status: "Found",
    location: "High Line Park",
    date: "2025-09-09",
    lat: 40.748,
    lng: -74.0048,
    description: "Wedding ring found near entrance.",
    imageUrl: "/ring.jpg",
    userId: 456,
  },

  {
    id: 7,
    title: "Blue Nike Sneakers",
    status: "Lost",
    location: "Central Park West",
    date: "2025-09-08",
    lat: 40.7812,
    lng: -73.9665,
    description: "Size 10 blue Nike Air Max sneakers left on park bench.",
    imageUrl: "/sneakers.jpg",
    userId: 123,
  },

  {
    id: 8,
    title: "Silver Laptop",
    status: "Found",
    location: "Penn Station",
    date: "2025-09-08",
    lat: 40.7505,
    lng: -73.9934,
    description: "MacBook Pro found in waiting area, has stickers on it.",
    imageUrl: "/laptop.jpg",
    userId: 789,
  },
  {
    id: 9,
    title: "Black Sunglasses",
    status: "Lost",
    location: "Riverside Park",
    date: "2025-09-07",
    lat: 40.7829,
    lng: -73.9814,
    description: "Ray-Ban sunglasses in black case, prescription lenses.",
    imageUrl: "/sunglasses.jpg",
    userId: 456,
  },
  {
    id: 10,
    title: "Red Umbrella",
    status: "Found",
    location: "Grand Central Terminal",
    date: "2025-09-07",
    lat: 40.7527,
    lng: -73.9772,
    description: "Large red umbrella left near information booth.",
    imageUrl: "/umbrella.jpg",
    userId: 123,
  },
  {
    id: 11,
    title: "Golden Retriever Collar",
    status: "Found",
    location: "Bryant Park",
    date: "2025-09-06",
    lat: 40.7536,
    lng: -73.9832,
    description: "Blue collar with name tag 'Buddy', phone number worn off.",
    imageUrl: "/collar.jpg",
    userId: 789,
  },
  {
    id: 12,
    title: "White Earbuds",
    status: "Lost",
    location: "Union Square",
    date: "2025-09-06",
    lat: 40.7359,
    lng: -73.9911,
    description: "Apple EarPods in white case, slightly used.",
    imageUrl: "/earbuds.jpg",
    userId: 456,
  },
];

// Utility functions
export const getRecentItems = (count = 6) => {
  return mockItems.slice(0, count);
};

export const getItemById = (id) => {
  return mockItems.find((item) => item.id === parseInt(id));
};

export const filterItems = (
  items,
  { search = "", status = "All", sort = "Newest" }
) => {
  let filtered = [...items];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (status !== "All") {
    filtered = filtered.filter((item) => item.status === status);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case "Name":
        return a.title.localeCompare(b.title);
      case "Oldest":
        return new Date(a.date) - new Date(b.date);
      case "Newest":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return filtered;
};

export const mockStats = [
  { number: "70,000+", label: "Lost Items / Year" },
  { number: "40%", label: "Never Returned" },
  { number: "80%", label: "Prefer Map Search" },
];
