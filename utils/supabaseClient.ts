import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; 

const supabaseUrl = 'https://lmiifmkygakawvlqrvjn.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtaWlmbWt5Z2FrYXd2bHFydmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4ODM4MzMsImV4cCI6MjA3OTQ1OTgzM30.jMz3NxugK3-YKMLx0AKuohBdDZB1xbTSX7N8bz7rCf4';

export const supabase = createClient(supabaseUrl, supabaseKey);