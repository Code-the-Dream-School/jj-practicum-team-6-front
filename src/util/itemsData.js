export const mockItems = [
  {
    id: "9a1b2c3d-4e5f-6789-abcd-ef0123456789",
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
    id: "3f2e1d0c-9b8a-7654-3210-fedcba987654",
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
    id: "7c6b5a4f-3e2d-1c0b-9a8f-76543210abcd",
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
    id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
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
    id: "0f1e2d3c-4b5a-6789-0abc-def123456789",
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
    id: "fa12bc34-de56-78ab-90cd-ef1234567890",
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
    id: "123e4567-e89b-12d3-a456-426614174000",
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
    id: "abcdef12-3456-7890-abcd-ef1234567890",
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
    id: "00112233-4455-6677-8899-aabbccddeeff",
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
    id: "deadbeef-0000-1111-2222-333344445555",
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
    id: "cafebabe-1234-5678-9abc-def012345678",
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
    id: "feedface-9876-5432-10fe-dcba98765432",
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

export const getRecentItems = (count = 6) => {
  return mockItems.slice(0, count);
};

export const getItemById = (id) => {
  return mockItems.find((item) => String(item.id) === String(id));
};

export const filterItems = (
  items,
  { search = "", status = "All", sort = "Newest" } = {}
) => {
  let filtered = [...items];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(searchLower) ||
        (item.location || "").toLowerCase().includes(searchLower) ||
        (item.description || "").toLowerCase().includes(searchLower)
    );
  }

  if (status !== "All") {
    filtered = filtered.filter((item) => item.status === status);
  }

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
