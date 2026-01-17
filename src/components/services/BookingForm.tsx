
'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { useTransition, useMemo, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Image from 'next/image';

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
import { CalendarIcon, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { services, type Service, FormField as ServiceFormField } from '@/lib/services';
import { countryCodes } from '@/lib/country-codes';
import { supabase } from '@/lib/supabase';

type BookingFormProps = {
  service: Service;
};

const routes: Record<string, string[]> = {
    "Essaouira": ["Marrakech", "Aéroport Marrakech", "Agadir", "Agafay", "Taghazout", "Imsouane", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Aéroport Agadir", "Aéroport Essaouira"],
    "Aéroport Essaouira": ["Marrakech", "Aéroport Marrakech", "Agadir", "Agafay", "Taghazout", "Imsouane", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Aéroport Agadir", "Essaouira"],
    "Marrakech": ["Essaouira", "Aéroport Essaouira", "Agadir", "Agafay", "Taghazout", "Imsouane", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Aéroport Agadir"],
    "Aéroport Marrakech": ["Essaouira", "Aéroport Essaouira", "Agadir", "Agafay", "Taghazout", "Imsouane", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Aéroport Agadir"],
    "Agadir": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agafay", "Taghazout", "Imsouane", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Aéroport Agadir"],
    "Aéroport Agadir": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agafay", "Taghazout", "Imsouane", "El Jadida", "Oualidia", "Imlil", "Ouirgane", "Taroudant", "Agadir"],
    "Agafay": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "Taghazout": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "Imsouane": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "El Jadida": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "Oualidia": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "Imlil": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "Ouirgane": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
    "Taroudant": ["Essaouira", "Aéroport Essaouira", "Marrakech", "Aéroport Marrakech", "Agadir", "Aéroport Agadir"],
};

const FormLabelWithRequired: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <FormLabel className="text-foreground">
      {children}
      {required && <span className="text-primary ml-1">*</span>}
    </FormLabel>
);

const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0');
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
});

export default function BookingForm({ service }: BookingFormProps) {
  // ... (previous hook logic remains same until return) ...
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  

  const fullService = services.find(s => s.id === service.id);

  const dynamicSchema = useMemo(() => {
    const serviceWithFields = services.find(s => s.slug === service.slug);
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
    const serviceWithFields = services.find(s => s.slug === service.slug);
    if (!serviceWithFields) return {};

    const defaults: Partial<FormValues> = {};
    serviceWithFields.bookingForm.fields.forEach(field => {
        if (field.name === 'countryCode') {
            (defaults as any)[field.name] = '+1__US';
        } else if (field.type === 'number') {
            (defaults as any)[field.name] = ['adults', 'participants'].includes(field.name) ? 1 : 0;
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
        date: (data as any).date ? format((data as any).date, 'yyyy-MM-dd') : '',
        serviceName: service.name,
        serviceId: service.slug,
        phone: `${((data as any).countryCode || '').split('__')[0]}${(data as any).phone || ''}`,
        createdAt: new Date().toISOString(),
      };
      
      try {
                const { error } = await supabase.from('leads').insert({
          service_id: service.id, // Assuming service object has numeric ID, check logic if string needed or mixed
          service_name: service.name,
          customer_name: (data as any).fullName,
          customer_email: (data as any).email,
          customer_phone: submissionData.phone,
          travel_date: submissionData.date,
          details: submissionData,
          status: 'new'
        });

        if (error) throw error;
        toast({
          title: 'Request Sent!',
          description: "We have received your request and will redirect you to WhatsApp for confirmation.",
        });
        handleWhatsAppRedirect(data);
        form.reset();
      } catch (error) {
        console.error("Error saving booking:", error);
        toast({
          variant: 'destructive',
          title: 'Oops! Something went wrong.',
          description: error instanceof Error ? error.message : 'There was an issue with your request.',
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
          
          const spanClass = fieldConfig.name === 'specialRequests' || ['fullName', 'email', 'pickupLocation', 'dropoffLocation'].includes(fieldConfig.name) ? 'md:col-span-2' : '';
          
          if (fieldConfig.name === 'phone') {
            const countryCodeField = service.bookingForm.fields.find(f => f.name === 'countryCode');
            if (!countryCodeField) return <></>;
            return (
                    <div className="md:col-span-2" key="phone-group">
                    <FormLabelWithRequired required={fieldConfig.required}>Phone Number</FormLabelWithRequired>
                    <div className="flex gap-2 mt-2">
                        <FormField
                            control={form.control}
                            name={"countryCode"}
                            render={({ field }) => (
                            <FormItem className="w-[140px]">
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-background border-input text-foreground h-10 px-3" aria-label="Country Code">
                                    <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60">
                                {countryCodes.map((country, index) => (
                                <SelectItem key={`${country.dial_code}__${country.code}`} value={`${country.dial_code}__${country.code}`}>
                                  <div className="flex items-center gap-2">
                                     <div className="relative w-5 h-3.5 shrink-0 overflow-hidden rounded-[2px] shadow-sm">
                                        <Image 
                                            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`} 
                                            alt={country.code} 
                                            fill 
                                            className="object-cover" 
                                        />
                                     </div>
                                     <span className="text-xs font-medium text-muted-foreground">{country.dial_code}</span>
                                  </div>
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
                                <Input type="tel" placeholder="555 123-4567" {...field} className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>
            );
          }
          if (fieldConfig.name === 'countryCode') return <></>;

          if (fieldConfig.name === 'adults') {
            const childrenField = service.bookingForm.fields.find(f => f.name === 'children');
            return (
              <div className="grid grid-cols-2 gap-6 md:col-span-2" key="participants-group">
                <FormItem>
                  <FormLabelWithRequired required={fieldConfig.required}>{fieldConfig.label}</FormLabelWithRequired>
                  <FormControl>
                    <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
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
                        <Input type="number" min="0" {...childrenFieldProps} onChange={(e) => childrenFieldProps.onChange(parseInt(e.target.value, 10))} className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                  />
                )}
              </div>
            );
          }
          if (fieldConfig.name === 'children') return <></>;
          
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
                              'w-full pl-3 text-left font-normal bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground',
                              !field.value && 'text-muted-foreground'
                          )}
                          >
                          {field.value ? format(field.value, 'PPP', { locale: enUS }) : <span>Pick a date</span>}
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
                          locale={enUS}
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
                          <Select onValueChange={timeFieldProps.onChange} defaultValue={timeFieldProps.value} value={timeFieldProps.value}>
                            <FormControl>
                                <SelectTrigger className="bg-background border-input text-foreground">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                                {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            );
          }
          if (fieldConfig.name === 'time') return <></>;

          return (
            <FormItem key={fieldConfig.name} className={spanClass}>
              <FormLabelWithRequired required={fieldConfig.required}>{fieldConfig.label}</FormLabelWithRequired>
                {fieldConfig.type === 'select' ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-input text-foreground">
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
                    <Textarea placeholder={fieldConfig.placeholder} {...field} className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[100px]" />
                  </FormControl>
                ) : (
                  <FormControl>
                    <Input type={fieldConfig.type} placeholder={fieldConfig.placeholder} {...field} className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                  </FormControl>
                )}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  // ... inside component ...
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>('cash');
  
  // Calculate potential price
  const formAdults = useWatch({ control: form.control, name: 'adults' }) || 1;
  const totalPrice = service.pricing?.amount ? service.pricing.amount * formAdults : 0;
  const depositAmount = Math.ceil(totalPrice * 0.2); // 20% Deposit

  // PayPal Import (Lazy)
  const PayPalButtons = useMemo(() => dynamic(() => import('@paypal/react-paypal-js').then(mod => mod.PayPalButtons), { ssr: false, loading: () => <Loader2 className="animate-spin" /> }), []);
  const PayPalScriptProvider = useMemo(() => dynamic(() => import('@paypal/react-paypal-js').then(mod => mod.PayPalScriptProvider), { ssr: false }), []);

  function handleBookingSave(data: FormValues, paymentDetails?: any) {
    startTransition(async () => {
      const submissionData = {
        ...data,
        date: (data as any).date ? format((data as any).date, 'yyyy-MM-dd') : '',
        serviceName: service.name,
        serviceId: service.slug,
        phone: `${((data as any).countryCode || '').split('__')[0]}${(data as any).phone || ''}`,
        createdAt: new Date().toISOString(),
        paymentStatus: paymentDetails ? 'paid_deposit' : 'pay_on_arrival',
        paymentDetails: paymentDetails || null,
      };
      
      try {
        const { error } = await supabase.from('leads').insert({
          service_id: service.id,
          service_name: service.name,
          customer_name: (data as any).fullName,
          customer_email: (data as any).email,
          customer_phone: submissionData.phone,
          travel_date: submissionData.date,
          details: submissionData,
          status: paymentDetails ? 'confirmed' : 'new'
        });

        if (error) throw error;
        toast({
          title: paymentDetails ? 'Booking Confirmed!' : 'Request Sent!',
          description: paymentDetails ? "Your deposit is received. Have a great trip!" : "Redirecting to WhatsApp for confirmation...",
        });
        
        handleWhatsAppRedirect(data);
        form.reset();
      } catch (error) {
        console.error("Error saving booking:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please try again or contact us on WhatsApp.',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleBookingSave(data))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.bookingForm.fields.map(renderField)}
        </div>

        {/* Pricing Summary (If applicable) */}
        {service.pricing && (
            <div className="bg-muted p-4 rounded-xl border border-border space-y-2">
                <div className="flex justify-between text-muted-foreground">
                    <span>Price per person</span>
                    <span>{service.pricing.amount}€</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-foreground border-t border-border pt-2 mt-2">
                    <span>Estimated Total</span>
                    <span className="text-primary">{totalPrice}€</span>
                </div>
                <div className="flex justify-between text-sm text-accent">
                    <span>Deposit required (20%)</span>
                    <span>{depositAmount}€</span>
                </div>
            </div>
        )}

        {/* Payment Selection */}
        {service.pricing && (
            <div className="grid grid-cols-2 gap-4">
                <Button 
                    type="button"
                    variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                    className={cn("h-auto py-4 flex flex-col items-center gap-2", paymentMethod === 'paypal' ? "border-primary bg-primary/10 text-primary" : "bg-transparent border-input text-muted-foreground")}
                    onClick={() => setPaymentMethod('paypal')}
                >
                    <span className="font-bold">Pay Deposit</span>
                    <span className="text-xs opacity-80">Secured by PayPal</span>
                </Button>
                <Button 
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className={cn("h-auto py-4 flex flex-col items-center gap-2", paymentMethod === 'cash' ? "border-primary bg-primary/10 text-primary" : "bg-transparent border-input text-muted-foreground")}
                    onClick={() => setPaymentMethod('cash')}
                >
                    <span className="font-bold">Pay Later</span>
                    <span className="text-xs opacity-80">Cash / Card</span>
                </Button>
            </div>
        )}

        {paymentMethod === 'paypal' && service.pricing ? (
             <div className="p-4 bg-white rounded-xl border border-input">
                 <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "EUR" }}>
                    <PayPalButtons 
                        style={{ layout: "vertical", shape: "rect" }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [{
                                    amount: { value: depositAmount.toString(), currency_code: "EUR" },
                                    description: `Deposit for ${service.name}`
                                }]
                            });
                        }}
                        onApprove={async (data, actions) => {
                            const details = await actions.order?.capture();
                            const formData = form.getValues();
                            const isValid = await form.trigger();
                            if (isValid) {
                                handleBookingSave(formData, details);
                            } else {
                                toast({ title: "Incomplete Form", description: "Please fill all fields before paying.", variant: "destructive" });
                            }
                        }}
                    />
                 </PayPalScriptProvider>
             </div>
        ) : (
            <Button type="submit" disabled={isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/20">
            {isPending ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
                </>
            ) : ( 
                <span className="flex items-center">
                {service.bookingTitle || 'Confirm Booking'}
                <Send className="ml-2 h-5 w-5" />
                </span>
            )}
            </Button>
        )}
      </form>
    </Form>
  );
}
