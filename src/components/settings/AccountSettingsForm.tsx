
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AccountSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

interface AccountSettingsFormProps {
  accountData: AccountSettings;
  handleAccountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveAccountSettings: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  emailConfirmed: boolean;
}

const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
  accountData,
  handleAccountChange,
  handleSaveAccountSettings,
  isLoading,
  isSaving,
  emailConfirmed
}) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account details and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input 
              id="first_name" 
              value={accountData.first_name} 
              onChange={handleAccountChange}
              required
              disabled={!emailConfirmed}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input 
              id="last_name" 
              value={accountData.last_name} 
              onChange={handleAccountChange}
              required
              disabled={!emailConfirmed}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={accountData.email} 
            onChange={handleAccountChange}
            required
            disabled={!emailConfirmed}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="twoFactor" disabled />
          <Label htmlFor="twoFactor">Enable two-factor authentication (Coming soon)</Label>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => toast({
              title: "Feature coming soon",
              description: "Password change will be available in a future update"
            })}
            disabled={!emailConfirmed}
          >
            Change Password
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveAccountSettings} 
          disabled={isLoading || isSaving || !emailConfirmed}
        >
          {isLoading || isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSettingsForm;
