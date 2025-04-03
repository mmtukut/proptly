import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';

const SavedPropertiesContext = createContext();

export function useSavedProperties() {
  return useContext(SavedPropertiesContext);
}

export function SavedPropertiesProvider({ children }) {
  const { currentUser } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedProperties = async () => {
    if (!currentUser) {
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('saved_properties')
        .eq('id', currentUser.id)
        .single();

      if (profileError) throw profileError;

      if (!profile.saved_properties?.length) {
        setSavedProperties([]);
        return;
      }

      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', profile.saved_properties);

      if (propertiesError) throw propertiesError;

      setSavedProperties(properties || []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, [currentUser]);

  const value = {
    savedProperties,
    loading,
    refreshSavedProperties: fetchSavedProperties
  };

  return (
    <SavedPropertiesContext.Provider value={value}>
      {children}
    </SavedPropertiesContext.Provider>
  );
} 