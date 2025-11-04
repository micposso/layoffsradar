import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmailSubscriberSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2, Settings, MapPin } from "lucide-react";
import { z } from "zod";
import { Link } from "wouter";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  statePreference: z.string().optional(),
  marketingOptIn: z.number().int().min(0).max(1).default(0),
});

type FormData = z.infer<typeof subscribeSchema>;

export default function EmailSignup() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      statePreference: "ALL",
      marketingOptIn: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        email: data.email,
        statePreference: (data.statePreference && data.statePreference !== "ALL") ? data.statePreference : "",
        marketingOptIn: data.marketingOptIn || 0,
      };
      return apiRequest("POST", "/api/subscribers", payload);
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive weekly updates about new WARN notices.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-muted/50" data-testid="success-message-subscribe">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <div>
          <div className="font-semibold" data-testid="text-success-title">Successfully subscribed!</div>
          <div className="text-sm text-muted-foreground" data-testid="text-success-description">
            Check your email for confirmation.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" id="subscribe">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      {...field}
                      data-testid="input-email-subscribe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    State Filter (Optional)
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-state-subscribe">
                        <SelectValue placeholder="All states" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">All states</SelectItem>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#E2C044] text-black hover:bg-[#d4b33d] border border-[#d4b33d]"
            data-testid="button-subscribe"
          >
            {mutation.isPending ? "Subscribing..." : "Subscribe to Alerts"}
          </Button>
        </form>
      </Form>
      
      <div className="flex flex-col items-start justify-between gap-2 mt-4 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground" data-testid="text-privacy-notice">
          Unsubscribe anytime. We respect your privacy.
        </p>
        <Link href="/subscribe">
          <Button variant="ghost" size="sm" className="gap-2 h-auto px-2 py-1 text-sm" data-testid="link-customize-preferences">
            <Settings className="w-3 h-3" />
            More options
          </Button>
        </Link>
      </div>
    </div>
  );
}
