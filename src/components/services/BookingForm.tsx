
'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition, useMemo } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { submitBooking } from '@/app/actions';
import { services, type Service } from '@/lib/services';
import { countryCodes } from '@/lib/country-codes';

type BookingFormProps = {
  service: Service;
};

const routes: Record<string, string[]> = {
    "Essaouira": ["Marrakech", "Marrakesh Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport", "Essaouira Airport"],
    "Essaouira Airport": ["Marrakech", "Marrakesh Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport", "Essaouira"],
    "Marrakech": ["Essaouira", "Essaouira Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport"],
    "Marrakesh Airport": ["Essaouira", "Essaouira Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport"],
    "Agadir": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport"],
    "Agadir Airport": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir"],
};

export default function BookingForm({ service }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fullService = services.find(s => s.id === service.id);

  // Base schema for common fields
  let baseSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    date: z.date({ required_error: 'A date for the booking is required.' }),
    phone: z.string().min(5, { message: 'Please enter a valid phone number.' }),
    specialRequests: z.string().optional(),
  });
  
  if(service.slug !== 'airport-transfers'){
    baseSchema = baseSchema.extend({
      participants: z.coerce.number().min(1, { message: 'At least one participant is required.' }),
    });
  } else {
    baseSchema = baseSchema.extend({
      countryCode: z.string().min(1, 'Country code is required.'),
      time: z.string().min(1, 'Time is required'),
    });
  }

  // Dynamically create the Zod schema
  const dynamicSchema = service.bookingForm.fields.reduce(
    (schema, field) => {
      const fieldService = services.find(s => s.id === service.id)?.bookingForm.fields.find(f => f.name === field.name);
      if (!fieldService) return schema;
      return schema.extend({ [field.name]: fieldService.validation });
    },
    baseSchema
  );

  type FormValues = z.infer<typeof dynamicSchema>;
  
  const isTransfer = service.slug === 'airport-transfers';

  const defaultFormValues: Partial<FormValues> = {
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
    ...service.bookingForm.fields.reduce((acc, field) => ({ ...acc, [field.name]: field.type === 'number' ? 0 : '' }), {}),
  };

  if(isTransfer){
    (defaultFormValues as any).adults = 1;
    (defaultFormValues as any).children = 0;
    (defaultFormValues as any).countryCode = '+212';
    (defaultFormValues as any).time = '';
  } else {
    (defaultFormValues as any).participants = 1;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: defaultFormValues,
  });
  
  const pickupLocationValue = useWatch({
    control: form.control,
    name: 'pickupLocation' as any, 
  });

  const destinationOptions = useMemo(() => {
    if (service.slug !== 'airport-transfers' || !pickupLocationValue) {
      const destField = service.bookingForm.fields.find(f => f.name === 'dropoffLocation');
      if (Array.isArray(destField?.options)) {
        return destField?.options.filter(opt => typeof opt === 'string');
      }
      return [];
    }
    return routes[pickupLocationValue] || [];
  }, [pickupLocationValue, service.slug, service.bookingForm.fields]);


  const handleWhatsAppRedirect = (data: FormValues) => {
    if (!fullService) return;
    const formattedDate = format(data.date, 'PPP');
    
    const extras = service.bookingForm.fields.reduce((acc, field) => {
      acc[field.name] = (data as any)[field.name];
      return acc;
    }, {} as Record<string, string>);
    
    const fullPhoneNumber = isTransfer ? `${(data as any).countryCode}${(data as any).phone}` : data.phone;
    const time = isTransfer ? (data as any).time : '';

    const messagePayload = {
      ...data,
      date: formattedDate,
      phone: fullPhoneNumber,
      time,
      extras,
    };

    const message = fullService.whatsappMessage(messagePayload);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${fullService.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      const extras = service.bookingForm.fields.reduce((acc, field) => {
          acc[field.name] = (data as any)[field.name];
          return acc;
        }, {} as Record<string, string>);
        
      const fullPhoneNumber = isTransfer ? `${(data as any).countryCode}${(data as any).phone}` : data.phone;
      const participants = isTransfer ? (data as any).adults + (data as any).children : (data as any).participants;
      const time = isTransfer ? (data as any).time : undefined;

      const submissionData = {
        ...data,
        date: formattedDate,
        serviceName: service.name,
        phone: fullPhoneNumber,
        participants,
        time,
        extras
      };
      
      const result = await submitBooking(submissionData);
      
      if (result.success) {
        toast({
          title: 'Booking Request Sent!',
          description: "We've received your request and will redirect you to WhatsApp to confirm.",
        });
        handleWhatsAppRedirect(data);
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.error || 'There was a problem with your request.',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isTransfer ? (
            <div className="md:col-span-2">
              <FormLabel>Phone Number</FormLabel>
              <div className="flex gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name={"countryCode" as any}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.dial_code}>
                                {country.code} ({country.dial_code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-2/3">
                        <FormControl>
                          <Input type="tel" placeholder="555 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isTransfer && (
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          

          {!isTransfer && (
             <FormField
                control={form.control}
                name={"participants" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Participants</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}

          {service.bookingForm.fields.map((customField) => {
            let options: (string | { label: string; value: string })[] = [];
            if (customField.name === 'dropoffLocation') {
                options = destinationOptions;
            } else if (Array.isArray(customField.options)) {
                options = customField.options;
            }

            return (
              <FormField
                key={customField.name}
                control={form.control}
                name={customField.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{customField.label}</FormLabel>
                    {customField.type === 'select' ? (
                       <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder={customField.placeholder || 'Select an option'} />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {options?.map((option) => {
                             const value = typeof option === 'string' ? option : option.value;
                             const label = typeof option === 'string' ? option : option.label;
                             return (
                               <SelectItem key={value} value={value}>
                                 {label}
                               </SelectItem>
                             )
                           })}
                         </SelectContent>
                       </Select>
                    ) : customField.type === 'number' ? (
                      <FormControl>
                        <Input type="number" min={customField.name === 'children' ? 0 : 1} {...field} />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <Input type={customField.type} placeholder={customField.placeholder} {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}
        </div>
        <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us anything else we need to know"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : 'Send Booking Inquiry'}
        </Button>
      </form>
    </Form>
  );
}
