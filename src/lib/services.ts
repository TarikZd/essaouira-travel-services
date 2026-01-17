import { z } from 'zod';
import type { ZodType } from 'zod';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const formatDate = (date: any) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return format(date, 'dd MMMM yyyy', { locale: enUS });
};

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'tel' | 'time' | 'date' | 'textarea' | 'email';
  required: boolean;
  placeholder?: string;
  options?: string[] | { label: string; value: string }[];
  validation: ZodType<any, any, any>;
};

const commonFields: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe', validation: z.string().min(2, { message: 'Name must be at least 2 characters.' }) },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john.doe@example.com', validation: z.string().email({ message: 'Please enter a valid email address.' }) },
    { name: 'countryCode', label: 'Country Code', type: 'select', required: true, validation: z.string().min(1, 'Country code is required.') },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '06 00 00 00 00', validation: z.string().min(5, { message: 'Invalid phone number.' })},
    { name: 'date', label: 'Date', type: 'date', required: true, validation: z.date({ required_error: 'Date is required.' }) },
    { name: 'time', label: 'Time', type: 'time', required: true, validation: z.string().min(1, "Time is required.") },
    { name: 'adults', label: 'Adults', type: 'number', required: true, validation: z.coerce.number().min(1, 'At least 1 adult required.') },
    { name: 'children', label: 'Children (Under 12)', type: 'number', required: false, validation: z.coerce.number().min(0, "Cannot be negative.").optional() },
    { name: 'specialRequests', label: 'Special Requests', type: 'textarea', required: false, placeholder: 'Baby seat, extra luggage...', validation: z.string().optional() }
];

const getFieldsForService = (specificFields: FormField[]): FormField[] => {
    // This helper function can be used to add/reorder common fields if needed
    const fieldOrder = [
        'fullName', 'email', 'countryCode', 'phone', 'pickupLocation', 'dropoffLocation', 'date', 'time', 
        'adults', 'children', 'packageType', 'dishPreference', 'lunchPreference', 'dietaryRestrictions', 'specialRequests'
    ];
    
    const allFields = [...commonFields, ...specificFields];

    // Sort fields based on the predefined order
    allFields.sort((a, b) => {
        const indexA = fieldOrder.indexOf(a.name);
        const indexB = fieldOrder.indexOf(b.name);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return allFields;
};


export type Service = {
  id: number;
  name: string;
  slug: string;
  description: string;
  aboutTitle: string;
  bookingTitle: string;
  features: string[];
  pricing?: {
    amount: number;
    unit: string;
  };
  rating?: number;
  reviewsCount?: number;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  images: {
    card: string;
    hero: string;
    gallery: string[];
  };
  bookingForm: {
    fields: FormField[];
  };
  whatsappNumber: string;
  whatsappMessage: (data: Record<string, any>) => string;
};

export const services: Service[] = [
  {
    id: 7,
    name: 'Moroccan Petit Four Class',
    slug: 'moroccan-petit-four-class',
    description: 'Immerse yourself in the art of Moroccan patisserie. In this workshop, you will learn to craft iconic treats: **Ghriba** (tender, cracked almond cookies), **Kaab el Ghazal** (delicate Gazelle Horns with almond paste), **Fekkas** (crunchy Moroccan biscotti), and **Briouates** (honey-dipped triangular pastries). A sweet, hands-on experience culminating in a traditional tea ceremony.',
    aboutTitle: 'About the pastry class',
    bookingTitle: 'Book your pastry class',
    features: ['Learn 4 Iconic Pastries', 'Hands-on Baking Session', 'Traditional Tea Ceremony', 'Take Home Your Box'],
    pricing: {
      amount: 40,
      unit: 'per person',
    },
    rating: 5.0,
    reviewsCount: 85,
    difficulty: 'Easy' as const,
    images: {
      card: 'card-cooking',
      hero: 'hero-cooking',
      gallery: ['gallery-cooking-1', 'gallery-cooking-2', 'gallery-cooking-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pastryPreference',
          label: 'Preferred Pastry Style',
          type: 'select',
          required: true,
          options: ['Mix / Assortment', 'Ghriba', 'Kaab el Ghazal', 'Fekkas', 'Briouates'],
          validation: z.string().min(1, 'Please select a preference.'),
        },
        {
          name: 'participants',
          label: 'Number of People',
          type: 'number',
          required: true,
          validation: z.coerce.number().min(1, 'At least 1 person.'),
        },
      ]).filter(f => !['time', 'adults', 'children'].includes(f.name)),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data: Record<string, any>) => `
*New Petit Four Class Request*

*Service:* Moroccan Petit Four Class
*Name:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Tel:* ${data.phone}
*People:* ${data.participants}
*Preference:* ${data.pastryPreference}
*Special Request:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 5,
    name: 'Moroccan Cooking Class',
    slug: 'outdoor-cooking-adventure',
    description: 'Immerse yourself in authentic Moroccan culture with a hands-on cooking class in the Essaouira countryside. Your day begins with a guided tour of the local souk to pick fresh ingredients. Then, learn ancestral secrets to prepare a perfect tagine or couscous in a traditional outdoor kitchen.',
    aboutTitle: 'About the cooking class',
    bookingTitle: 'Book your culinary adventure',
    features: ['Authentic Moroccan Experience', 'Guided Souk Tour', 'Traditional Moroccan Cooking', 'Lunch in the Countryside'],
    pricing: {
      amount: 45,
      unit: 'per person',
    },
    rating: 5.0,
    reviewsCount: 156,
    difficulty: 'Easy' as const,
    images: {
      card: 'card-cooking',
      hero: 'hero-cooking',
      gallery: ['gallery-cooking-1', 'gallery-cooking-2', 'gallery-cooking-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'dishPreference',
          label: 'Preferred Dish',
          type: 'select',
          required: true,
          options: ['Tagine', 'Couscous', 'Pastilla', 'Moroccan Petit Four'],
          validation: z.string().min(1, 'Please select a dish.'),
        },

        {
          name: 'participants',
          label: 'Number of People',
          type: 'number',
          required: true,
          validation: z.coerce.number().min(1, 'At least 1 person.'),
        },
      ]).filter(f => !['time', 'adults', 'children'].includes(f.name)),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data: Record<string, any>) => `
*New Cooking Class Request*

*Service:* Moroccan Cooking Class
*Name:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Tel:* ${data.phone}
*People:* ${data.participants}
*Dish:* ${data.dishPreference}
*Special Request:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 4,
    name: 'Wild Beaches Hiking Tour',
    slug: 'wild-beaches-excursion',
    description: 'Go off the beaten path to discover the wild and untouched coastline south of Essaouira. Our guided hiking trails take you to secret beaches, spectacular cliffs, and hidden fishing villages. This half-day adventure includes a delicious traditional lunch with a local family.',
    aboutTitle: 'About the Hiking tour',
    bookingTitle: 'Book your Hiking tour',
    features: ['Hidden Beach Exploration', 'Scenic Coastal Trails', 'Spectacular Coastal Scenery', 'Authentic Lunch Included'],
    pricing: {
      amount: 45,
      unit: 'per person',
    },
    rating: 4.8,
    reviewsCount: 204,
    difficulty: 'Moderate' as const,
    images: {
      card: 'card-beaches',
      hero: 'hero-beaches',
      gallery: ['gallery-beaches-1', 'gallery-beaches-2', 'gallery-beaches-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'participants',
          label: 'Number of People',
          type: 'number',
          required: true,
          validation: z.coerce.number().min(1, 'At least 1 person.'),
        },
      ]).filter(f => !['time', 'adults', 'children'].includes(f.name)),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data: Record<string, any>) => `
*New Hiking Tour Request*

*Service:* Wild Beaches Hiking Tour
*Name:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Tel:* ${data.phone}
*People:* ${data.participants}
*Special Request:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 3,
    name: 'Guided Souk & Medina Tour',
    slug: 'essaouira-souk-tour',
    description: 'Step into the living history of Essaouira with a guided walking tour through its enchanting medina. Let our local expert guide you through labyrinthine alleys to vibrant souks, historic ramparts, and hidden artisan workshops. Discover the stories, sights, and flavors that make this city magical.',
    aboutTitle: 'About the tour',
    bookingTitle: 'Book your guided tour',
    features: ['Expert Local Guide', 'Ramparts & Port Visit', 'Souk & Artisan Exploration', 'Mint Tea Included'],
    pricing: {
      amount: 20,
      unit: 'per person',
    },
    rating: 4.9,
    reviewsCount: 521,
    difficulty: 'Easy' as const,
    images: {
      card: 'card-souk',
      hero: 'hero-souk',
      gallery: ['gallery-souk-1', 'gallery-souk-2', 'gallery-souk-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'participants',
          label: 'Number of People',
          type: 'number',
          required: true,
          validation: z.coerce.number().min(1, 'At least 1 person.'),
        },
      ]).filter(f => !['time', 'adults', 'children'].includes(f.name)),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data: Record<string, any>) => `
*New Souk Tour Request*

*Service:* Guided Souk Tour
*Name:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Tel:* ${data.phone}
*People:* ${data.participants}
*Special Request:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 2,
    name: 'Coastal Quad Adventure',
    slug: 'quad-biking-adventure',
    description: 'Unleash your adventurous side with a thrilling quad bike excursion along Essaouira’s spectacular coastline. Ride across vast sand dunes, along wind-swept beaches, and navigate through argan forests. Our expert guides ensure a safe and unforgettable experience for all skill levels.',
    aboutTitle: 'About Essaouira Quad Biking',
    bookingTitle: 'Book your Quad adventure',
    features: ['Dunes, Beaches & Forests', 'Modern & Maintained Quads', 'Safety Briefing & Gear', 'Professional Guides'],
    pricing: {
      amount: 50,
      unit: 'per person (2 hours)',
    },
    rating: 4.7,
    reviewsCount: 89,
    difficulty: 'Moderate' as const,
    images: {
      card: 'card-quad',
      hero: 'hero-quad',
      gallery: ['gallery-quad-1', 'gallery-quad-2', 'gallery-quad-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'packageType',
          label: 'Tour Duration',
          type: 'select',
          required: true,
          options: ['2-Hour Discovery Ride', 'Half-Day Adventure', 'Full-Day Dune Expedition'],
          validation: z.string().min(1, 'Please select a duration.'),
        },
        {
          name: 'participants',
          label: 'Number of People',
          type: 'number',
          required: true,
          validation: z.coerce.number().min(1, 'At least 1 person.'),
        },
      ]).filter(f => !['time', 'adults', 'children'].includes(f.name)),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data: Record<string, any>) => `
*New Quad Request*

*Service:* Coastal Quad Adventure
*Name:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Tel:* ${data.phone}
*Duration:* ${data.packageType}
*People:* ${data.participants}
*Special Request:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 6,
    name: 'Shore Fishing Experience',
    slug: 'shore-fishing-essaouira',
    description: 'Discover traditional surfcasting fishing on the wild beaches of Essaouira. Accompanied by an experienced local fisherman, you will learn to read the ocean and master casting techniques from the shore. A peaceful and authentic experience, feet in the sand, ideal for reconnecting with nature.',
    aboutTitle: 'About the fishing session',
    bookingTitle: 'Book your fishing session',
    features: ['Fishing Gear Provided', 'Experienced Local Fisherman', 'Refreshments Included', 'Wild & Peaceful Setting'],
    pricing: {
      amount: 45,
      unit: 'per person',
    },
    rating: 4.8,
    reviewsCount: 42,
    difficulty: 'Easy' as const,
    images: {
      card: 'card-fishing',
      hero: 'hero-fishing',
      gallery: ['gallery-fishing-1', 'gallery-fishing-2', 'gallery-fishing-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'packageType',
          label: 'Session Duration',
          type: 'select',
          required: true,
          options: ['Half Day (Morning)', 'Half Day (Afternoon)'],
          validation: z.string().min(1, 'Please select a duration.'),
        },
        {
          name: 'participants',
          label: 'Number of People',
          type: 'number',
          required: true,
          validation: z.coerce.number().min(1, 'At least 1 person.'),
        },
      ]).filter(f => !['time', 'adults', 'children'].includes(f.name)),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data: Record<string, any>) => `
*New Fishing Request*

*Service:* Shore Fishing (Surfcasting)
*Name:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Tel:* ${data.phone}
*Duration:* ${data.packageType}
*People:* ${data.participants}
*Special Request:* ${data.specialRequests || 'None'}
`,
  },
].sort((a, b) => {
    const order = [5, 7, 6, 4, 3, 2];
    return order.indexOf(a.id) - order.indexOf(b.id);
});
