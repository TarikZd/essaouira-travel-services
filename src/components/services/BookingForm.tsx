
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
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
import type { Service } from '@/lib/services';

type BookingFormProps = {
  service: Service;
};

export default function BookingForm({ service }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Dynamically create the Zod schema
  const dynamicSchema = service.bookingForm.fields.reduce(
    (schema, field) => {
      return schema.extend({ [field.name]: field.validation });
    },
    z.object({
      fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
      email: z.string().email({ message: 'Please enter a valid email address.' }),
      date: z.date({ required_error: 'A date for the booking is required.' }),
      participants: z.coerce.number().min(1, { message: 'At least one participant is required.' }),
      phone: z.string().min(5, { message: 'Please enter a valid phone number.' }),
      specialRequests: z.string().optional(),
    })
  );

  type FormValues = z.infer<typeof dynamicSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      fullName: '',
      email: '',
      participants: 1,
      phone: '',
      specialRequests: '',
      ...service.bookingForm.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
    },
  });

  const handleWhatsAppRedirect = (data: FormValues) => {
    const formattedDate = format(data.date, 'PPP');
    
    const extras = service.bookingForm.fields.reduce((acc, field) => {
      acc[field.name] = (data as any)[field.name];
      return acc;
    }, {} as Record<string, string>);

    const messagePayload = {
      ...data,
      date: formattedDate,
      extras,
    };

    const message = service.whatsappMessage(messagePayload);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${service.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      const extras = service.bookingForm.fields.reduce((acc, field) => {
          acc[field.name] = (data as any)[field.name];
          return acc;
        }, {} as Record<string, string>);
        
      const submissionData = {
        ...data,
        date: formattedDate,
        serviceName: service.name,
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
                      disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participants"
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
          {service.bookingForm.fields.map((customField) => (
            <FormField
              key={customField.name}
              control={form.control}
              name={customField.name as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{customField.label}</FormLabel>
                  {customField.type === 'select' ? (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder={customField.placeholder || 'Select an option'} />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {customField.options?.map((option) => (
                           <SelectItem key={option} value={option}>
                             {option}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  ) : (
                    <FormControl>
                      <Input type={customField.type} placeholder={customField.placeholder} {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
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
