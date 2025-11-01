import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, MapPin, CheckCircle2 } from "lucide-react";

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
  marketingOptIn: z.boolean().default(false),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

export default function Subscribe() {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const form = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      statePreference: "ALL",
      marketingOptIn: false,
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: SubscribeFormData) => {
      const payload = {
        email: data.email,
        statePreference: (data.statePreference && data.statePreference !== "ALL") ? data.statePreference : "",
        marketingOptIn: data.marketingOptIn ? 1 : 0,
      };
      return apiRequest("POST", "/api/subscribers", payload);
    },
    onSuccess: () => {
      setIsSubscribed(true);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubscribeFormData) => {
    subscribeMutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container px-4 mx-auto md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {!isSubscribed ? (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-4 text-4xl font-bold text-foreground font-display">
                    Subscribe to Layoff Alerts
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Get notified when new WARN notices are filed. Stay informed about employment changes across America.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Subscription Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your alert preferences to receive relevant notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormDescription>
                                We'll send layoff alerts to this email address
                              </FormDescription>
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
                                  <SelectTrigger data-testid="select-state">
                                    <SelectValue placeholder="All states (no filter)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ALL">All states (no filter)</SelectItem>
                                  {US_STATES.map((state) => (
                                    <SelectItem key={state.code} value={state.code}>
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Only receive alerts for layoffs in a specific state
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="marketingOptIn"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-marketing"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Marketing communications
                                </FormLabel>
                                <FormDescription>
                                  Receive updates about new features, insights, and data analysis from LAYOFFS RADAR
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={subscribeMutation.isPending}
                          data-testid="button-subscribe"
                        >
                          {subscribeMutation.isPending ? "Subscribing..." : "Subscribe to Alerts"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <div className="mt-8 text-sm text-center text-muted-foreground">
                  <p>By subscribing, you agree to receive email notifications about WARN layoff notices.</p>
                  <p className="mt-1">You can unsubscribe at any time.</p>
                </div>
              </>
            ) : (
              <Card className="text-center">
                <CardContent className="pt-6 pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Successfully Subscribed!
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Check your inbox for a welcome email from LAYOFFS RADAR Alert.
                  </p>
                  <Button
                    onClick={() => setIsSubscribed(false)}
                    variant="outline"
                    data-testid="button-subscribe-another"
                  >
                    Subscribe Another Email
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
