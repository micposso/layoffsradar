import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmailSubscriberSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2 } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof insertEmailSubscriberSchema>;

export default function EmailSignup() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(insertEmailSubscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      apiRequest("POST", "/api/subscribers", data),
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
      <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-muted/50">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <div>
          <div className="font-semibold">Successfully subscribed!</div>
          <div className="text-sm text-muted-foreground">
            Check your email for confirmation.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" id="subscribe">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter your email address"
                      {...field}
                      className="pl-10"
                      data-testid="input-email-subscribe"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-shrink-0"
            data-testid="button-subscribe"
          >
            {mutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </Form>
      <p className="mt-3 text-sm text-muted-foreground">
        Get weekly email updates about new WARN layoff notices. Unsubscribe anytime.
      </p>
    </div>
  );
}
