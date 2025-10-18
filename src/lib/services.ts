
import { z } from 'zod';
import type { ZodType } from 'zod';

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
    { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe', validation: z.string().min(2, { message: 'Full name must be at least 2 characters.' }) },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john.doe@example.com', validation: z.string().email({ message: 'Please enter a valid email address.' }) },
    { name: 'countryCode', label: 'Country Code', type: 'select', required: true, validation: z.string().min(1, 'Country code is required.') },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '555 123-4567', validation: z.string().min(5, { message: 'Please enter a valid phone number.' })},
    { name: 'date', label: 'Date', type: 'date', required: true, validation: z.date({ required_error: 'A date for the booking is required.' }) },
    { name: 'time', label: 'Time', type: 'time', required: true, validation: z.string().min(1, 'A time is required.') },
    { name: 'adults', label: 'Adults', type: 'number', required: true, validation: z.coerce.number().min(1, 'At least one adult is required.') },
    { name: 'children', label: 'Children (under 12)', type: 'number', required: false, validation: z.coerce.number().min(0, 'Number of children cannot be negative.').optional() },
    { name: 'specialRequests', label: 'Special Requests', type: 'textarea', required: false, placeholder: 'Tell us anything else we need to know', validation: z.string().optional() }
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
  whatsappMessage: (data: any) => string;
};

export const services: Service[] = [
  {
    id: 1,
    name: 'Private Transfers',
    slug: 'airport-transfers',
    description: 'Travel with confidence and comfort with our private transfer service in Essaouira. We ensure a seamless connection between Marrakech, Agadir, and local airports, coastal towns, and more. Our professional drivers and modern vehicles guarantee a stress-free journey to your Moroccan destination.',
    aboutTitle: 'About Your Private Transfer',
    bookingTitle: 'Book Your Transfer',
    features: ['Service to Major Airports & Cities', 'Private, Air-Conditioned Vehicles', 'Professional & Punctual Drivers', '24/7 Availability for All Flights'],
    images: {
      card: 'card-transfers',
      hero: 'hero-transfers',
      gallery: ['gallery-transfers-1', 'gallery-transfers-2'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'select',
          required: true,
          options: ['Essaouira', 'Essaouira Airport', 'Marrakech', 'Marrakesh Airport', 'Agadir', 'Agadir Airport', 'Agafay', 'Taghazout', 'Imsouen', 'El Jadida', 'Oualidia', 'Imlil', 'Ouirgane', 'Taroudant'],
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
            name: 'dropoffLocation',
            label: 'Drop off Location',
            type: 'select',
            required: true,
            options: [],
            validation: z.string().min(1, 'Drop off location is required'),
        },
      ]),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Transfer Request* 🚗

*Service:* Private Transfers
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.pickupLocation}
*Drop off:* ${data.dropoffLocation}
*Adults:* ${data.adults}
*Children:* ${data.children || 0}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 5,
    name: 'Berber Cooking Class',
    slug: 'outdoor-cooking-adventure',
    description: 'Immerse yourself in authentic Berber culture with a hands-on cooking class in a serene Essaouira countryside setting. Your day begins with a guided trip to a local souk to pick fresh, vibrant ingredients. Then, you\'ll learn the age-old secrets of crafting a perfect Moroccan tagine or couscous in a traditional outdoor kitchen. It’s a genuine connection to the heart of Moroccan culinary heritage.',
    aboutTitle: 'About the Cooking Class',
    bookingTitle: 'Book Your Culinary Adventure',
    features: ['Authentic Berber-Led Experience', 'Guided Souk Shopping for Ingredients', 'Hands-On Traditional Moroccan Cooking', 'Dine in a Beautiful Countryside Setting'],
    pricing: {
      amount: 80,
      unit: 'per person',
    },
    difficulty: 'Easy',
    images: {
      card: 'card-cooking',
      hero: 'hero-cooking',
      gallery: ['gallery-cooking-1', 'gallery-cooking-2', 'gallery-cooking-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad in Essaouira',
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
          name: 'dishPreference',
          label: 'Dish Preference',
          type: 'select',
          required: true,
          options: ['Mechoui', 'Barbecue', 'Meat Tajin', 'Chicken Tajin', 'Couscous', 'Fresh Fish (if available)', 'Vegetarian Option'],
          validation: z.string().min(1, 'Please select your preferred dish.'),
        },
        {
          name: 'dietaryRestrictions',
          label: 'Dietary Restrictions',
          type: 'text',
          required: false,
          placeholder: 'e.g., vegetarian, gluten-free',
          validation: z.string().optional(),
        },
      ]),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Cooking Class Request* 🍲

*Service:* Berber Cooking Class
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children || 0}
*Dish Preference:* ${data.dishPreference}
*Dietary Needs:* ${data.dietaryRestrictions || 'None'}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 4,
    name: 'Secret Beaches 4x4 Tour',
    slug: 'wild-beaches-excursion',
    description: 'Journey off the beaten path to uncover the wild, untouched coastline south of Essaouira. Our comfortable 4x4 vehicles will take you to secret beaches, dramatic sea cliffs, and hidden fishing villages. This half-day adventure includes a delicious, traditionally prepared lunch with a local Berber family, offering a true taste of Moroccan hospitality.',
    aboutTitle: 'About the 4x4 Tour',
    bookingTitle: 'Book Your 4x4 Coastal Tour',
    features: ['Explore Hidden Beaches and Coves', 'Travel in a Comfortable 4x4 Vehicle', 'Stunning Coastal & Cliffside Scenery', 'Authentic Moroccan Lunch Included'],
    pricing: {
      amount: 70,
      unit: 'per person',
    },
    difficulty: 'Moderate',
    images: {
      card: 'card-beaches',
      hero: 'hero-beaches',
      gallery: ['gallery-beaches-1', 'gallery-beaches-2', 'gallery-beaches-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad in Essaouira',
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
          name: 'lunchPreference',
          label: 'Lunch Preference',
          type: 'select',
          required: true,
          options: ['Mechoui', 'Barbecue', 'Meat Tajin', 'Chicken Tajin', 'Couscous', 'Fresh Fish (if available)', 'Vegetarian Option'],
          validation: z.string().min(1, 'Please select a lunch preference.'),
        }
      ]),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Wild Beaches Request* 🏖️

*Service:* Secret Beaches 4x4 Tour
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children || 0}
*Lunch Preference:* ${data.lunchPreference}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 3,
    name: 'Souk Walking Tour',
    slug: 'essaouira-souk-tour',
    description: 'Step into the living history of Essaouira with a guided walking tour through its enchanting medina. Let our local expert lead you through labyrinthine alleys to vibrant souks, historic ramparts, and hidden artisan workshops. Discover the stories, sights, and flavors that make this UNESCO World Heritage city so magical.',
    aboutTitle: 'About the Medina Tour',
    bookingTitle: 'Book Your Walking Tour',
    features: ['Insider Knowledge from a Local Guide', 'Visit the Historic Ramparts & Port', 'Explore Bustling Souks & Artisan Shops', 'Taste Traditional Moroccan Mint Tea'],
    pricing: {
      amount: 25,
      unit: 'per person',
    },
    difficulty: 'Easy',
    images: {
      card: 'card-souk',
      hero: 'hero-souk',
      gallery: ['gallery-souk-1', 'gallery-souk-2', 'gallery-souk-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pickupLocation',
          label: 'Meeting Point',
          type: 'text',
          required: true,
          placeholder: 'e.g., Bab Sbaa (main gate)',
          validation: z.string().min(1, 'A meeting point is required'),
        },
      ]),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Souk Tour Request* 🛍️

*Service:* Souk Walking Tour
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Meeting Point:* ${data.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children || 0}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 2,
    name: 'Coastal Quad Biking',
    slug: 'quad-biking-adventure',
    description: 'Unleash your inner adventurer on a thrilling quad biking tour along Essaouira\'s spectacular coastline. Ride across vast sand dunes, cruise along windswept beaches, and navigate through shady argan forests. Our expert guides ensure a safe and unforgettable experience for all skill levels.',
    aboutTitle: 'About Quad Biking in Essaouira',
    bookingTitle: 'Book Your Quad Bike Adventure',
    features: ['Ride Through Dunes, Beaches & Forests', 'High-Quality, Well-Maintained Quads', 'Full Safety Briefing & Equipment', 'Guided by Professional Instructors'],
    pricing: {
      amount: 50,
      unit: 'per person (2 hours)',
    },
    difficulty: 'Moderate',
    images: {
      card: 'card-quad',
      hero: 'hero-quad',
      gallery: ['gallery-quad-1', 'gallery-quad-2', 'gallery-quad-3'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad in Essaouira',
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
          name: 'packageType',
          label: 'Tour Duration',
          type: 'select',
          required: true,
          options: ['2-Hour Discovery Ride', 'Half-Day Coastal Adventure', 'Full-Day Dune Expedition'],
          validation: z.string().min(1, 'Please select a tour duration.'),
        },
      ]),
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Quad Biking Request* 🏍️

*Service:* Coastal Quad Biking
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children || 0}
*Tour Duration:* ${data.packageType}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
].sort((a, b) => {
    const order = [1, 5, 4, 3, 2];
    return order.indexOf(a.id) - order.indexOf(b.id);
});

    