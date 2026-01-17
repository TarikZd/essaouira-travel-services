
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

  const showVisualCalendar = !!service.maxParticipants;

  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: defaultFormValues,
    reValidateMode: 'onChange',
  });
  
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [capacityMap, setCapacityMap] = useState<Record<string, number>>({});

  useEffect(() => {
      const fetchAvailability = async () => {
          // Fetch manually blocked dates
          const { data: blocked } = await supabase
              .from('blocked_dates')
              .select('blocked_date')
              .eq('service_slug', service.slug);
          
          let dates = (blocked || []).map(b => b.blocked_date); // Keep as YYYY-MM-DD strings
          const newCapacityMap: Record<string, number> = {};

          // Calculate capacity if restricted
          if (service.maxParticipants) {
               const { data: bookings } = await supabase
                  .from('bookings')
                  .select('activity_date, participants')
                  .eq('service_id', service.slug)
                  .in('status', ['confirmed', 'pending_payment']);
               
               const load: Record<string, number> = {};
               bookings?.forEach((b: any) => {
                   // Ensure activity_date is string YYYY-MM-DD
                   load[b.activity_date] = (load[b.activity_date] || 0) + b.participants;
               });
               
               Object.assign(newCapacityMap, load);

               Object.entries(load).forEach(([date, count]) => {
                   if (count >= (service.maxParticipants || 4)) {
                       dates.push(date);
                   }
               });
          }
          setCapacityMap(newCapacityMap);
          setUnavailableDates(dates);
      };
      fetchAvailability();
  }, [service.slug, service.maxParticipants]);





  const renderField = (fieldConfig: ServiceFormField) => {
    return (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name as any}
        render={({ field }) => {
          let options: (string | { label: string; value: string })[] = [];
           if (Array.isArray(fieldConfig.options)) {
              options = fieldConfig.options;
          }
          
          const spanClass = fieldConfig.name === 'specialRequests' || ['fullName', 'email'].includes(fieldConfig.name) ? 'md:col-span-2' : '';
          
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
            const participantsField = service.bookingForm.fields.find(f => f.name === 'participants');
            
            // If we have time, pair with time. If not, and we have participants, pair with participants.
            const secondaryField = timeField || participantsField;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2" key="date-group">
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
                          disabled={(date) => {
                              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                              const dateStr = format(date, 'yyyy-MM-dd');
                              const isUnavailable = unavailableDates.includes(dateStr);
                              return isPast || isUnavailable;
                          }}
                          locale={enUS}
                          initialFocus
                      />
                      </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
                
                {secondaryField && secondaryField.name === 'time' && (
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field: timeFieldProps }) => (
                      <FormItem>
                          <FormLabelWithRequired required={secondaryField.required}>{secondaryField.label}</FormLabelWithRequired>
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

                {secondaryField && secondaryField.name === 'participants' && (
                   <FormField
                    control={form.control}
                    name="participants"
                    render={({ field: pField }) => (
                     <FormItem>
                       <FormLabelWithRequired required={secondaryField.required}>{secondaryField.label}</FormLabelWithRequired>
                       <FormControl>
                         <Input 
                            type="number" 
                            min="1" 
                            {...pField} 
                            onChange={(e) => pField.onChange(parseInt(e.target.value, 10))} 
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground" 
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                    )}
                   />
                )}
              </div>
            );
          }
          if (fieldConfig.name === 'time') return <></>;
          if (fieldConfig.name === 'participants') {
             const hasTime = service.bookingForm.fields.some(f => f.name === 'time');
             if (!hasTime && !showVisualCalendar) return <></>; // Already rendered with date ONLY IF visual calendar is hidden
          }

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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>(service.pricing ? 'paypal' : 'cash');
  
  // Calculate potential price
  const formAdults = useWatch({ control: form.control, name: 'adults' });
  const formParticipants = useWatch({ control: form.control, name: 'participants' });
  const headCount = formAdults || formParticipants || 1;
  const totalPrice = service.pricing?.amount ? service.pricing.amount * headCount : 0;
  const depositAmount = 10; // Fixed deposit

  // PayPal Import (Lazy)
  const PayPalButtons = useMemo(() => dynamic(() => import('@paypal/react-paypal-js').then(mod => mod.PayPalButtons), { ssr: false, loading: () => <Loader2 className="animate-spin" /> }), []);
  const PayPalScriptProvider = useMemo(() => dynamic(() => import('@paypal/react-paypal-js').then(mod => mod.PayPalScriptProvider), { ssr: false }), []);

  async function handleBookingSave(data: FormValues, paymentDetails?: any): Promise<{ success: boolean; error?: string; bookingId?: string }> {
    const email = (data as any).email;
    const phone = `${((data as any).countryCode || '').split('__')[0]}${(data as any).phone || ''}`;
    const fullName = (data as any).fullName;
    const dateStr = (data as any).date ? format((data as any).date, 'yyyy-MM-dd') : '';

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // 1. Customer Handling
          let customerId;
          const { data: existingCustomer } = await supabase
              .from('customers')
              .select('id')
              .eq('email', email)
              .single();

          if (existingCustomer) {
              customerId = existingCustomer.id;
          } else {
              const { data: newCustomer, error: custError } = await supabase
                  .from('customers')
                  .insert({
                      email,
                      full_name: fullName,
                      phone: phone,
                      country_code: (data as any).countryCode
                  })
                  .select()
                  .single();
              
              if (custError) {
                  // If unique constraint violated (race condition), fetch again
                  if (custError.code === '23505') {
                       const { data: retryCust } = await supabase.from('customers').select('id').eq('email', email).single();
                       if (retryCust) customerId = retryCust.id;
                       else {
                         resolve({ success: false, error: 'Customer creation failed' });
                         return;
                       }
                  } else {
                      resolve({ success: false, error: custError.message || 'Customer error' });
                      return;
                  }
              } else {
                  customerId = newCustomer.id;
              }
          }

          if (!customerId) {
            resolve({ success: false, error: 'Failed to resolve customer' });
            return;
          }

          // 2. Booking Handling
          const { data: booking, error: bookingError } = await supabase
              .from('bookings')
              .insert({
                  customer_id: customerId,
                  service_id: service.slug,
                  service_name: service.name,
                  activity_date: dateStr,
                  participants: headCount,
                  currency: 'EUR',
                  total_price: totalPrice,
                  deposit_amount: depositAmount,
                  status: paymentDetails ? 'confirmed' : 'pending_payment',
                  payment_status: paymentDetails ? 'deposit_paid' : 'unpaid',
                  details: data
              })
              .select()
              .single();
              
           if (bookingError) {
             resolve({ success: false, error: bookingError.message || 'Booking creation failed' });
             return;
           }

           // 3. Payment Handling
          if (paymentDetails) {
               const { error: payError } = await supabase
                  .from('payments')
                  .insert({
                      booking_id: booking.id,
                      provider: 'paypal',
                      transaction_id: paymentDetails.id, 
                      amount: depositAmount,
                      currency: 'EUR',
                      status: 'completed',
                      metadata: paymentDetails
                  });
               if (payError) {
                 resolve({ success: false, error: 'Payment record failed', bookingId: booking.id });
                 return;
               }
           }

          toast({
            title: paymentDetails ? 'Booking Confirmed!' : 'Request Sent!',
            description: paymentDetails ? "Thank you! You will receive a confirmation from PayPal shortly." : "We have received your request and will contact you shortly.",
          });
          
          form.reset();
          resolve({ success: true, bookingId: booking.id });
        } catch (error) {
          console.error("Error saving booking:", error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          toast({
            variant: 'destructive',
            title: 'Error',
            description: paymentDetails ? 'Booking save failed. Please contact support.' : 'Please try again.',
          });
          resolve({ success: false, error: errorMessage });
        }
      });
    });
  }


  
  const selectedDateStr = form.watch('date') ? format(form.watch('date'), 'yyyy-MM-dd') : null;
  const currentBooked = selectedDateStr ? (capacityMap[selectedDateStr] || 0) : 0;
  const spotsLeft = service.maxParticipants ? (service.maxParticipants - currentBooked) : null;

  return (
    <div className="space-y-8">
      {showVisualCalendar && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-headline text-xl font-bold mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    Select a Date
                </div>
                {selectedDateStr && spotsLeft !== null && (
                    <span className={cn("text-sm font-bold px-3 py-1 rounded-full transition-all", spotsLeft > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {spotsLeft > 0 ? `${spotsLeft} Spots Left` : 'Fully Booked'}
                    </span>
                )}
            </h3>
            <div className="flex justify-center bg-muted/30 rounded-lg p-4">
                <Calendar
                    mode="single"
                    selected={form.watch('date')}
                    onSelect={(date) => date && form.setValue('date', date)}
                    disabled={(date) => {
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isUnavailable = unavailableDates.includes(dateStr);
                        return isPast || isUnavailable;
                    }}
                    locale={enUS}
                    className="rounded-md border bg-white"
                    classNames={{
                        day_selected: "bg-blue-600 text-white hover:bg-blue-600 focus:bg-blue-600",
                        day_disabled: "bg-gray-100 text-gray-300 opacity-100 cursor-not-allowed",
                    }}
                />
            </div>
            <div className="mt-4 flex gap-4 text-sm justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div>
                    <span>Available</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 text-gray-400"></div>
                    <span>Full / Closed</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>Selected</span>
                </div>
            </div>
        </div>
      )}

    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleBookingSave(data))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.bookingForm.fields.map(field => {
             if (showVisualCalendar && field.name === 'date') return null; // Hide default date picker if visual one exists
             return renderField(field);
          })}
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
                    <span>Deposit required</span>
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
                        onClick={async (data, actions) => {
                            const isValid = await form.trigger();
                            if (!isValid) {
                                toast({
                                    title: "Missing Information",
                                    description: "Please fill in all required fields before paying.",
                                    variant: "destructive"
                                });
                                return actions.reject();
                            }
                            return actions.resolve();
                        }}
                        createOrder={(data, actions) => {
                            const formData = form.getValues();
                            const date = (formData as any).date;
                            const dateStr = date ? format(date, 'yyyy-MM-dd') : 'No Date';
                            const pax = (formData as any).adults || (formData as any).participants || 1;
                            
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [{
                                    description: `Deposit: ${service.name}`,
                                    amount: { 
                                        value: depositAmount.toString(), 
                                        currency_code: "EUR",
                                        breakdown: {
                                            item_total: { value: depositAmount.toString(), currency_code: "EUR" }
                                        }
                                    },
                                    items: [{
                                        name: service.name,
                                        description: `Date: ${dateStr}, Guests: ${pax}`,
                                        unit_amount: { value: depositAmount.toString(), currency_code: "EUR" },
                                        quantity: "1",
                                        category: "DIGITAL_GOODS"
                                    }]
                                }]
                            });
                        }}
                        onApprove={async (data, actions) => {
                            if (!actions.order) return;
                            
                            let paymentCaptured = false;
                            let transactionId = '';
                            
                            try {
                                // Capture the payment first
                                const details = await actions.order.capture();
                                paymentCaptured = true;
                                transactionId = details.id || 'Unknown';
                                
                                // Get form data and attempt to save booking
                                const formData = form.getValues();
                                const result = await handleBookingSave(formData, details);
                                
                                if (!result.success) {
                                    // CRITICAL: Payment was captured but booking save failed
                                    toast({ 
                                        title: "⚠️ Critical: Booking Save Failed", 
                                        description: `Your payment was processed successfully (Transaction: ${transactionId}). However, we could not save your booking. Please contact support immediately with this transaction ID.`, 
                                        variant: "destructive",
                                        duration: 10000
                                    });
                                    console.error('CRITICAL: Payment captured but save failed', { transactionId, error: result.error });
                                }
                                // If successful, toast is shown by handleBookingSave
                            } catch (error) {
                                console.error("PayPal Error:", error);
                                
                                if (paymentCaptured) {
                                    // Payment captured but unexpected error
                                    toast({
                                        title: "⚠️ Critical Error",
                                        description: `Payment was captured (Transaction: ${transactionId}) but an error occurred. Please contact support immediately.`,
                                        variant: "destructive",
                                        duration: 10000
                                    });
                                } else {
                                    // Payment capture failed (safe - no money involved)
                                    toast({
                                        title: "Payment Error",
                                        description: "Payment could not be processed. Please try again.",
                                        variant: "destructive"
                                    });
                                }
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
    </div>
  );
}
