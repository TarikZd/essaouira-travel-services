
'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition, useMemo, useEffect } from 'react';
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
import { services, type Service, FormField as ServiceFormField } from '@/lib/services';
import { countryCodes } from '@/lib/country-codes';
import { saveBooking } from '@/firebase/firestore/bookings';
import { useFirestore } from '@/firebase';

type BookingFormProps = {
  service: Service;
};

const routes: Record<string, string[]> = {
    "Essaouira": ["Marrakech", "Marrakesh Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport", "Essaouira Airport"],
    "Essaouira Airport": ["Marrakech", "Marrakesh Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport", "Essaouira"],
    "Marrakech": ["Essaouira", "Essaouira Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport", "Agadir"],
    "Marrakesh Airport": ["Essaouira", "Essaouira Airport", "Agadir", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport", "Agadir"],
    "Agadir": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir Airport"],
    "Agadir Airport": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agafay", "Taghazout", "Imsouen", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir"],
    "Agafay": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "Taghazout": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "Imsouen": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "El Jadida": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "Oualidia": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "Imlil": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "Ouirgane": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
    "Taroudant": ["Essaouira", "Essaouira Airport", "Marrakech", "Marrakesh Airport", "Agadir", "Agadir Airport"],
};

const FormLabelWithRequired: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <FormLabel>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </FormLabel>
);

export default function BookingForm({ service }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();

  const fullService = services.find(s => s.id === service.id);

  const dynamicSchema = useMemo(() => {
    const serviceWithFields = services.find(s => s.id === service.id);
    if (!serviceWithFields) {
        return z.object({});
    }

    const schema = serviceWithFields.bookingForm.fields.reduce(
      (schema, field) => {
        return schema.extend({ [field.name]: field.validation });
      },
      z.object({})
    );

    return schema as z.ZodObject<any, any, any>;
  }, [service]);


  type FormValues = z.infer<typeof dynamicSchema>;
  
  const isTransfer = service.slug === 'airport-transfers';

  const defaultFormValues: Partial<FormValues> = useMemo(() => {
    const serviceWithFields = services.find(s => s.id === service.id);
    if (!serviceWithFields) return {};

    const defaults: Partial<FormValues> = {};
    serviceWithFields.bookingForm.fields.forEach(field => {
        if (field.name === 'countryCode') {
            (defaults as any)[field.name] = '+212';
        } else if (field.type === 'number') {
            (defaults as any)[field.name] = field.name === 'adults' ? 1 : 0;
        } else if (field.type !== 'date') {
            (defaults as any)[field.name] = '';
        }
    });
    return defaults;
  }, [service]);

  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: defaultFormValues,
    reValidateMode: 'onChange',
  });
  
  const pickupLocationValue = useWatch({
    control: form.control,
    name: 'pickupLocation' as any, 
  });

  const destinationOptions = useMemo(() => {
    if (service.slug !== 'airport-transfers' || !pickupLocationValue) {
      const destField = service.bookingForm.fields.find(f => f.name === 'dropoffLocation');
      if (Array.isArray(destField?.options)) {
        return destField?.options.filter((opt): opt is string => typeof opt === 'string');
      }
      return [];
    }
    return routes[pickupLocationValue] || [];
  }, [pickupLocationValue, service.slug, service.bookingForm.fields]);

  useEffect(() => {
    if (isTransfer) {
      form.setValue('dropoffLocation' as any, '');
    }
  }, [pickupLocationValue, isTransfer, form]);


  const handleWhatsAppRedirect = (data: FormValues) => {
    if (!fullService) return;
    
    const allData = { ...form.getValues() };

    const message = fullService.whatsappMessage(allData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${fullService.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const submissionData = {
        ...data,
        date: data.date ? format(data.date, 'yyyy-MM-dd') : '',
        serviceName: service.name,
        serviceId: service.slug,
        phone: `${data.countryCode || ''}${data.phone || ''}`,
        createdAt: new Date().toISOString(),
      };
      
      try {
        await saveBooking(firestore, submissionData);
        toast({
          title: 'Booking Request Sent!',
          description: "We've received your request and will redirect you to WhatsApp to confirm.",
        });
        handleWhatsAppRedirect(data);
        form.reset();
      } catch (error) {
        console.error("Error saving booking:", error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error instanceof Error ? error.message : 'There was a problem with your request.',
        });
      }
    });
  }

  const renderField = (fieldConfig: ServiceFormField) => {
    return (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name as any}
        render={({ field }) => {
          let options: (string | { label: string; value: string })[] = [];
          if (fieldConfig.name === 'dropoffLocation' && isTransfer) {
              options = destinationOptions;
          } else if (Array.isArray(fieldConfig.options)) {
              options = fieldConfig.options;
          }
          
          const spanClass = fieldConfig.name === 'specialRequests' || ['fullName', 'email', 'pickupLocation'].includes(fieldConfig.name) ? 'md:col-span-2' : '';
          
          if (fieldConfig.name === 'phone') {
            const countryCodeField = service.bookingForm.fields.find(f => f.name === 'countryCode');
            if (!countryCodeField) return null;
            return (
                <div className="md:col-span-2" key="phone-group">
                    <FormLabelWithRequired required={fieldConfig.required}>Phone Number</FormLabelWithRequired>
                    <div className="flex gap-2 mt-2">
                        <FormField
                            control={form.control}
                            name={"countryCode"}
                            render={({ field }) => (
                            <FormItem className="w-1/3">
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {countryCodes.map((country) => (
                                    <SelectItem key={`${country.code}-${country.dial_code}`} value={country.dial_code}>
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
            );
          }
          if (fieldConfig.name === 'countryCode') return null;

          if (fieldConfig.name === 'adults') {
            const childrenField = service.bookingForm.fields.find(f => f.name === 'children');
            return (
              <div className="grid grid-cols-2 gap-6 md:col-span-2" key="participants-group">
                <FormItem>
                  <FormLabelWithRequired required={fieldConfig.required}>{fieldConfig.label}</FormLabelWithRequired>
                  <FormControl>
                    <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {childrenField && (
                  <FormField
                    control={form.control}
                    name={"children"}
                    render={({ field: childrenFieldProps }) => (
                    <FormItem>
                        <FormLabelWithRequired required={childrenField.required}>{childrenField.label}</FormLabelWithRequired>
                        <FormControl>
                        <Input type="number" min="0" {...childrenFieldProps} onChange={(e) => childrenFieldProps.onChange(parseInt(e.target.value, 10))} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                  />
                )}
              </div>
            );
          }
          if (fieldConfig.name === 'children') return null;
          
          if (fieldConfig.name === 'date') {
            const timeField = service.bookingForm.fields.find(f => f.name === 'time');
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2" key="date-time-group">
                <FormItem className="flex flex-col">
                  <FormLabelWithRequired required={fieldConfig.required}>{fieldConfig.label}</FormLabelWithRequired>
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
                {timeField && (
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field: timeFieldProps }) => (
                      <FormItem>
                          <FormLabelWithRequired required={timeField.required}>{timeField.label}</FormLabelWithRequired>
                          <FormControl>
                          <Input type="time" {...timeFieldProps} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            );
          }
          if (fieldConfig.name === 'time') return null;

          return (
            <FormItem key={fieldConfig.name} className={spanClass}>
              <FormLabelWithRequired required={fieldConfig.required}>{fieldConfig.label}</FormLabelWithRequired>
                {fieldConfig.type === 'select' ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={fieldConfig.placeholder || 'Select an option'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options?.map((option, index) => {
                        const value = typeof option === 'string' ? option : option.value;
                        const label = typeof option === 'string' ? option : option.label;
                        return (
                          <SelectItem key={`${fieldConfig.name}-${value}-${index}`} value={value}>
                            {label}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                ) : fieldConfig.type === 'textarea' ? (
                  <FormControl>
                    <Textarea placeholder={fieldConfig.placeholder} {...field} />
                  </FormControl>
                ) : (
                  <FormControl>
                    <Input type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field} />
                  </FormControl>
                )}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.bookingForm.fields.map(renderField)}
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : ( service.bookingTitle || 'Send Booking Inquiry' )}
        </Button>
      </form>
    </Form>
  );
}
