
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailConfirmationAlertProps {
  emailConfirmed: boolean;
  onResendEmail?: () => void;
}

const EmailConfirmationAlert: React.FC<EmailConfirmationAlertProps> = ({ 
  emailConfirmed, 
  onResendEmail 
}) => {
  if (emailConfirmed) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Email Not Confirmed</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>Please confirm your email address to enable editing of settings. Check your inbox for a confirmation link.</span>
        {onResendEmail && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResendEmail}
            className="whitespace-nowrap"
          >
            Resend Email
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationAlert;
