
import { z } from 'zod';
import type { ZodType } from 'zod';

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'tel' | 'time';
  required: boolean;
  placeholder?: string;
  options?: string[] | { label: string; value: string }[];
  validation: ZodType<any, any, any>;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  description: string;
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
    name: 'Transfers',
    slug: 'airport-transfers',
    description: 'Start and end your journey with ease. We offer reliable, comfortable, and timely transfers to and from Essaouira-Mogador Airport (ESU) and Marrakech-Menara Airport (RAK). Travel in modern, air-conditioned vehicles with professional drivers who know the region inside and out.',
    features: ['Professional & Punctual Drivers', 'Modern, Air-Conditioned Vehicles', '24/7 Availability', 'Fixed & Transparent Pricing'],
    images: {
      card: 'card-transfers',
      hero: 'hero-transfers',
      gallery: ['gallery-transfers-1', 'gallery-transfers-2'],
    },
    bookingForm: {
      fields: [
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
      ],
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Transfer Request* 🚗

*Service:* Transfers
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.extras.pickupLocation}
*Drop off:* ${data.extras.dropoffLocation}
*Adults:* ${data.adults}
*Children:* ${data.children}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 5,
    name: 'Outdoor Cooking Adventure',
    slug: 'outdoor-cooking-adventure',
    description: 'Join us for a unique culinary journey into the Moroccan countryside. You\'ll visit a local market to select fresh, seasonal ingredients, then learn to prepare a traditional tagine in a stunning outdoor setting. A true taste of Moroccan culture and hospitality.',
    features: ['Guided Market Visit', 'Hands-on Cooking Class', 'Enjoy Your Meal in Nature', 'Learn Traditional Recipes'],
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
      fields: [
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad',
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
          name: 'dietaryRestrictions',
          label: 'Dietary Restrictions',
          type: 'text',
          required: false,
          placeholder: 'e.g., vegetarian, nut allergy',
          validation: z.string().optional(),
        },
      ],
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Outdoor Cooking Request* 🍲

*Service:* Outdoor Cooking Adventure
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.extras.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children}
*Dietary Needs:* ${data.extras.dietaryRestrictions || 'None'}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 4,
    name: 'Wild Beaches Excursion',
    slug: 'wild-beaches-excursion',
    description: 'Escape the crowds and discover the untouched beauty of the wild beaches south of Essaouira. This half-day excursion takes you to secluded coves, dramatic cliffs, and pristine sands. Enjoy a traditional lunch in a local village.',
    features: ['Visit Secluded & Untouched Beaches', 'Stunning Coastal Scenery', 'Includes Traditional Lunch', 'Comfortable 4x4 Transportation'],
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
      fields: [
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad',
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
          name: 'lunchPreference',
          label: 'Lunch Preference',
          type: 'select',
          required: true,
          options: ['Standard (Chicken Tagine)', 'Vegetarian', 'Fish (if available)'],
          validation: z.string().min(1, 'Please select a lunch preference.'),
        }
      ],
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Wild Beaches Request* 🏖️

*Service:* Wild Beaches Excursion
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.extras.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children}
*Lunch Preference:* ${data.extras.lunchPreference}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 3,
    name: 'Essaouira Souk Tour',
    slug: 'essaouira-souk-tour',
    description: 'Immerse yourself in the vibrant heart of Essaouira with a guided tour of its historic medina and bustling souks. Discover hidden alleyways, shop for local handicrafts, and taste the authentic flavors of Morocco with an expert local guide.',
    features: ['Expert Local Guide', 'Discover Hidden Gems', 'Cultural & Historical Insights', 'Tasting of Local Delicacies'],
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
      fields: [
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad',
          validation: z.string().min(1, 'Pick up location is required'),
        },
      ],
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Souk Tour Request* 🛍️

*Service:* Essaouira Souk Tour
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.extras.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
  {
    id: 2,
    name: 'Quad Biking Adventure',
    slug: 'quad-biking-adventure',
    description: 'Experience the thrill of riding a quad bike across Essaouira\'s stunning landscapes. Our guided tours take you through vast sand dunes, along wild beaches, and into hidden forests. Perfect for adventure seekers of all skill levels.',
    features: ['High-Quality Quad Bikes', 'Professional Guides & Safety Briefing', 'Explore Dunes, Beaches & Forests', 'All Safety Gear Provided'],
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
      fields: [
        {
          name: 'pickupLocation',
          label: 'Pick up Location',
          type: 'text',
          required: true,
          placeholder: 'e.g., your hotel or riad',
          validation: z.string().min(1, 'Pick up location is required'),
        },
        {
          name: 'packageType',
          label: 'Package Type',
          type: 'select',
          required: true,
          options: ['2-Hour Discovery', 'Half-Day Adventure', 'Full-Day Expedition'],
          validation: z.string().min(1, 'Package type is required'),
        },
      ],
    },
    whatsappNumber: '212628438838',
    whatsappMessage: (data) => `
*New Quad Biking Request* 🏍️

*Service:* Quad Biking Adventure
*Name:* ${data.fullName}
*Email:* ${data.email}
*Date:* ${data.date}
*Time:* ${data.time}
*Phone:* ${data.phone}
*Pick up:* ${data.extras.pickupLocation}
*Adults:* ${data.adults}
*Children:* ${data.children}
*Package:* ${data.extras.packageType}
*Special Requests:* ${data.specialRequests || 'None'}
`,
  },
].sort((a, b) => {
    const order = [1, 5, 4, 3, 2];
    return order.indexOf(a.id) - order.indexOf(b.id);
});
