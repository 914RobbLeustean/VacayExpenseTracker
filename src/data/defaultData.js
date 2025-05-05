import { COLORS } from '../utils/colors';

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'accommodation', name: 'Accommodation', color: COLORS.categories[0] },
  { id: 'food', name: 'Food & Drinks', color: COLORS.categories[1] },
  { id: 'activities', name: 'Activities', color: COLORS.categories[2] },
  { id: 'transportation', name: 'Transportation', color: COLORS.categories[3] },
  { id: 'shopping', name: 'Shopping', color: COLORS.categories[4] },
  { id: 'other', name: 'Other', color: COLORS.categories[5] }
];

export const DEFAULT_BUDGET_TEMPLATE = {
  accommodation: 0,
  food: 0,
  activities: 0,
  transportation: 0,
  shopping: 0,
  other: 0
};

export const MONEY_SAVING_TIPS = {
  accommodation: [
    "Consider booking hostels or homestays instead of hotels",
    "Try house-sitting or home exchange programs",
    "Book accommodations with kitchen access to save on meals"
  ],
  food: [
    "Eat where locals eat - usually cheaper and more authentic",
    "Visit local markets and prepare some meals yourself",
    "Look for lunch specials rather than dining out for dinner",
    "Look for tips reccomended on Reddit and Tiktok"
  ],
  activities: [
    "Look for free walking tours or city attractions",
    "Check for museum free days or discounted hours",
    "Research city passes that bundle attractions at a discount"
  ],
  transportation: [
    "Use public transportation instead of taxis",
    "Consider weekly transit passes if staying longer",
    "Walk or rent bikes for short distances"
  ],
  shopping: [
    "Set a specific souvenir budget before your trip",
    "Look for local markets rather than tourist shops",
    "Consider practical souvenirs you'll actually use"
  ],
  other: [
    "Use free WiFi instead of expensive data plans",
    "Bring basic medications from home",
    "Check if your hotel offers free laundry facilities"
  ]
};