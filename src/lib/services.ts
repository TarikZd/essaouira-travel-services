import { z } from 'zod';
import type { ZodType } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatDate = (date: any) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return format(date, 'dd MMMM yyyy', { locale: fr });
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
    { name: 'fullName', label: 'Nom Complet', type: 'text', required: true, placeholder: 'Jean Dupont', validation: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }) },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'jean.dupont@example.com', validation: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }) },
    { name: 'countryCode', label: 'Code Pays', type: 'select', required: true, validation: z.string().min(1, 'Le code pays est requis.') },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: true, placeholder: '06 00 00 00 00', validation: z.string().min(5, { message: 'Numéro de téléphone invalide.' })},
    { name: 'date', label: 'Date', type: 'date', required: true, validation: z.date({ required_error: 'La date est requise.' }) },
    { name: 'time', label: 'Heure', type: 'time', required: true, validation: z.string().min(1, "L'heure est requise.") },
    { name: 'adults', label: 'Adultes', type: 'number', required: true, validation: z.coerce.number().min(1, 'Au moins 1 adulte requis.') },
    { name: 'children', label: 'Enfants (-12 ans)', type: 'number', required: false, validation: z.coerce.number().min(0, "Ne peut pas être négatif.").optional() },
    { name: 'specialRequests', label: 'Demandes Spéciales', type: 'textarea', required: false, placeholder: 'Siège bébé, bagages supplémentaires...', validation: z.string().optional() }
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
    id: 1,
    name: 'Transferts Privés',
    slug: 'airport-transfers',
    description: 'Voyagez en toute confiance et confort avec notre service de transfert privé à Essaouira. Nous assurons une liaison fluide entre Marrakech, Agadir, les aéroports et les villes côtières. Nos chauffeurs professionnels et véhicules modernes vous garantissent un trajet sans stress vers votre destination.',
    aboutTitle: 'À propos de votre transfert',
    bookingTitle: 'Réservez votre transfert',
    features: ['Service vers Aéroports & Villes Majeures', 'Véhicules Privés Climatisés', 'Chauffeurs Professionnels & Ponctuels', 'Disponibilité 24/7 pour tous les vols'],
    rating: 4.9,
    reviewsCount: 342,
    difficulty: 'Moderate' as const,
    images: {
      card: 'card-transfers',
      hero: 'hero-transfers',
      gallery: ['gallery-transfers-1', 'gallery-transfers-2'],
    },
    bookingForm: {
      fields: getFieldsForService([
        {
          name: 'pickupLocation',
          label: 'Lieu de prise en charge',
          type: 'select',
          required: true,
          options: ['Essaouira', 'Aéroport Essaouira', 'Marrakech', 'Aéroport Marrakech', 'Agadir', 'Aéroport Agadir', 'Agafay', 'Taghazout', 'Imsouane', 'El Jadida', 'Oualidia', 'Imlil', 'Ouirgane', 'Taroudant'],
          validation: z.string().min(1, 'Le lieu de départ est requis'),
        },
        {
            name: 'dropoffLocation',
            label: 'Lieu de dépose',
            type: 'select',
            required: true,
            options: [],
            validation: z.string().min(1, "Le lieu d'arrivée est requis"),
        },
      ]),
    },
    whatsappNumber: '212690606068',
    whatsappMessage: (data: Record<string, any>) => `
*Nouvelle Demande de Transfert*

*Service:* Transferts Privés
*Nom:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Heure:* ${data.time}
*Tél:* ${data.phone}
*Départ:* ${data.pickupLocation}
*Arrivée:* ${data.dropoffLocation}
*Adultes:* ${data.adults}
*Enfants:* ${data.children || 0}
*Demande Spéciale:* ${data.specialRequests || 'Aucune'}
`,
  },
  {
    id: 5,
    name: 'Cours de Cuisine Berbère',
    slug: 'outdoor-cooking-adventure',
    description: 'Plongez dans la culture berbère authentique avec un cours de cuisine pratique dans la campagne d\'Essaouira. Votre journée commence par une visite guidée du souk local pour choisir des ingrédients frais. Ensuite, apprenez les secrets ancestraux pour préparer un tajine ou un couscous parfait dans une cuisine traditionnelle en plein air.',
    aboutTitle: 'À propos du cours de cuisine',
    bookingTitle: 'Réservez votre aventure culinaire',
    features: ['Expérience Authentique Berbère', 'Visite Guidée du Souk', 'Cuisine Traditionnelle Marocaine', 'Déjeuner dans la Campagne'],
    pricing: {
      amount: 80,
      unit: 'par personne',
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
          name: 'pickupLocation',
          label: 'Lieu de prise en charge',
          type: 'text',
          required: true,
          placeholder: 'ex: votre hôtel ou Riad',
          validation: z.string().min(1, 'Le lieu est requis'),
        },
        {
          name: 'dishPreference',
          label: 'Plat Préféré',
          type: 'select',
          required: true,
          options: ['Mechoui', 'Barbecue', 'Tajine Viande', 'Tajine Poulet', 'Couscous', 'Poisson Frais (si dispo)', 'Végétarien'],
          validation: z.string().min(1, 'Veuillez choisir un plat.'),
        },
        {
          name: 'dietaryRestrictions',
          label: 'Restrictions Alimentaires',
          type: 'text',
          required: false,
          placeholder: 'ex: végétarien, sans gluten',
          validation: z.string().optional(),
        },
      ]),
    },
    whatsappNumber: '212690606068',
    whatsappMessage: (data: Record<string, any>) => `
*Nouvelle Demande Cours de Cuisine*

*Service:* Cours de Cuisine Berbère
*Nom:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Heure:* ${data.time}
*Tél:* ${data.phone}
*Départ:* ${data.pickupLocation}
*Adultes:* ${data.adults}
*Enfants:* ${data.children || 0}
*Plat:* ${data.dishPreference}
*Régime:* ${data.dietaryRestrictions || 'Aucun'}
*Demande Spéciale:* ${data.specialRequests || 'Aucune'}
`,
  },
  {
    id: 4,
    name: 'Plages Sauvages 4x4',
    slug: 'wild-beaches-excursion',
    description: 'Sortez des sentiers battus pour découvrir le littoral sauvage et intact au sud d\'Essaouira. Nos 4x4 confortables vous emmènent vers des plages secrètes, des falaises spectaculaires et des villages de pêcheurs cachés. Cette aventure d\'une demi-journée inclut un délicieux déjeuner traditionnel chez l\'habitant.',
    aboutTitle: 'À propos du tour 4x4',
    bookingTitle: 'Réservez votre tour 4x4',
    features: ['Exploration de Plages Cachées', 'Transport en 4x4 Confortable', 'Paysages Côtiers Spectaculaires', 'Déjeuner Authentique Inclus'],
    pricing: {
      amount: 70,
      unit: 'par personne',
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
          name: 'pickupLocation',
          label: 'Lieu de prise en charge',
          type: 'text',
          required: true,
          placeholder: 'ex: votre hôtel ou Riad',
          validation: z.string().min(1, 'Le lieu est requis'),
        },
      ]),
    },
    whatsappNumber: '212690606068',
    whatsappMessage: (data: Record<string, any>) => `
*Nouvelle Demande Plages Sauvages*

*Service:* Plages Sauvages 4x4
*Nom:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Heure:* ${data.time}
*Tél:* ${data.phone}
*Départ:* ${data.pickupLocation}
*Adultes:* ${data.adults}
*Enfants:* ${data.children || 0}
*Demande Spéciale:* ${data.specialRequests || 'Aucune'}
`,
  },
  {
    id: 3,
    name: 'Visite Guidée des Souks',
    slug: 'essaouira-souk-tour',
    description: 'Entrez dans l\'histoire vivante d\'Essaouira avec une visite guidée à pied à travers sa médina enchanteresse. Laissez notre expert local vous guider dans les ruelles labyrinthiques vers les souks vibrants, les remparts historiques et les ateliers d\'artisans cachés. Découvrez les histoires, les vues et les saveurs qui rendent cette ville magique.',
    aboutTitle: 'À propos de la visite',
    bookingTitle: 'Réservez votre visite guidée',
    features: ['Guide Local Expert', 'Visite des Remparts & du Port', 'Exploration des Souks & Artisans', 'Thé à la Menthe Inclus'],
    pricing: {
      amount: 25,
      unit: 'par personne',
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
          name: 'pickupLocation',
          label: 'Point de Rencontre',
          type: 'text',
          required: true,
          placeholder: 'ex: Bab Sbaa (porte principale)',
          validation: z.string().min(1, 'Le point de rencontre est requis'),
        },
      ]),
    },
    whatsappNumber: '212690606068',
    whatsappMessage: (data: Record<string, any>) => `
*Nouvelle Demande Visite Souk*

*Service:* Visite Guidée des Souks
*Nom:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Heure:* ${data.time}
*Tél:* ${data.phone}
*Lieu:* ${data.pickupLocation}
*Adultes:* ${data.adults}
*Enfants:* ${data.children || 0}
*Demande Spéciale:* ${data.specialRequests || 'Aucune'}
`,
  },
  {
    id: 2,
    name: 'Aventure Quad Côtière',
    slug: 'quad-biking-adventure',
    description: 'Libérez votre côté aventurier avec une excursion en quad palpitante le long du littoral spectaculaire d\'Essaouira. Traversez de vastes dunes de sable, longez des plages balayées par le vent et naviguez à travers des forêts d\'arganiers. Nos guides experts assurent une expérience sûre et inoubliable pour tous les niveaux.',
    aboutTitle: 'À propos du Quad à Essaouira',
    bookingTitle: 'Réservez votre aventure Quad',
    features: ['Dunes, Plages & Forêts', 'Quads Modernes & Entretenus', 'Briefing Sécurité & Équipement', 'Guides Professionnels'],
    pricing: {
      amount: 50,
      unit: 'par personne (2 heures)',
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
          name: 'pickupLocation',
          label: 'Lieu de prise en charge',
          type: 'text',
          required: true,
          placeholder: 'ex: votre hôtel ou Riad',
          validation: z.string().min(1, 'Le lieu est requis'),
        },
        {
          name: 'packageType',
          label: 'Durée du Tour',
          type: 'select',
          required: true,
          options: ['Balade Découverte 2h', 'Demi-journée Aventure', 'Expédition Dunes Journée'],
          validation: z.string().min(1, 'Veuillez choisir une durée.'),
        },
      ]),
    },
    whatsappNumber: '212690606068',
    whatsappMessage: (data: Record<string, any>) => `
*Nouvelle Demande Quad*

*Service:* Aventure Quad Côtière
*Nom:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Heure:* ${data.time}
*Tél:* ${data.phone}
*Départ:* ${data.pickupLocation}
*Adultes:* ${data.adults}
*Enfants:* ${data.children || 0}
*Durée:* ${data.packageType}
*Demande Spéciale:* ${data.specialRequests || 'Aucune'}
`,
  },
  {
    id: 6,
    name: 'Pêche en Bord de Mer',
    slug: 'shore-fishing-essaouira',
    description: 'Découvrez la pêche traditionnelle en surfcasting sur les plages sauvages d\'Essaouira. Accompagné d\'un pêcheur local expérimenté, vous apprendrez à lire l\'océan et à maîtriser les techniques de lancer depuis le rivage. Une expérience paisible et authentique, les pieds dans le sable, idéale pour se reconnecter avec la nature.',
    aboutTitle: 'À propos de la pêche',
    bookingTitle: 'Réservez votre session de pêche',
    features: ['Matériel de Pêche Fourni', 'Pêcheur local Expérimenté', 'Rafraîchissements Inclus', 'Cadre Sauvage & Paisible'],
    pricing: {
      amount: 40,
      unit: 'par personne',
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
          name: 'pickupLocation',
          label: 'Lieu de prise en charge',
          type: 'text',
          required: true,
          placeholder: 'ex: votre hôtel ou Riad',
          validation: z.string().min(1, 'Le lieu est requis'),
        },
        {
          name: 'packageType',
          label: 'Durée de la session',
          type: 'select',
          required: true,
          options: ['Demi-journée (Matin)', 'Demi-journée (Après-midi)', 'Journée Complète'],
          validation: z.string().min(1, 'Veuillez choisir une durée.'),
        },
      ]),
    },
    whatsappNumber: '212690606068',
    whatsappMessage: (data: Record<string, any>) => `
*Nouvelle Demande Pêche*

*Service:* Pêche en Bord de Mer (Surfcasting)
*Nom:* ${data.fullName.toUpperCase()}
*Email:* ${data.email}
*Date:* ${formatDate(data.date)}
*Heure:* ${data.time}
*Tél:* ${data.phone}
*Départ:* ${data.pickupLocation}
*Adultes:* ${data.adults}
*Enfants:* ${data.children || 0}
*Durée:* ${data.packageType}
*Demande Spéciale:* ${data.specialRequests || 'Aucune'}
`,
  },
].sort((a, b) => {
    const order = [1, 5, 4, 6, 3, 2];
    return order.indexOf(a.id) - order.indexOf(b.id);
});
