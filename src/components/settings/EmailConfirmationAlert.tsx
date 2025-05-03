
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EmailConfirmationAlertProps {
  emailConfirmed: boolean;
}

const EmailConfirmationAlert: React.FC<EmailConfirmationAlertProps> = ({ emailConfirmed }) => {
  if (emailConfirmed) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Email Not Confirmed</AlertTitle>
      <AlertDescription>
        Please confirm your email address to enable editing of settings. Check your inbox for a confirmation link.
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationAlert;
