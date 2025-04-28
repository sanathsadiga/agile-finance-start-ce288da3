
# Setting Up Supabase Environment Variables

To properly connect your application to Supabase, you need to set up environment variables.

## How to Set Up Environment Variables

1. Create a `.env` file in the root of your project
2. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on the "Settings" icon (gear icon) in the sidebar menu
3. Select "API" from the settings menu
4. Under "Project API keys", you will find:
   - Project URL: Copy this as your `VITE_SUPABASE_URL`
   - `anon` `public` key: Copy this as your `VITE_SUPABASE_ANON_KEY`

## Important Notes

- Never commit your `.env` file to version control
- For production deployments, set these environment variables in your hosting platform
- The application has fallback values for development, but these won't connect to an actual Supabase instance
