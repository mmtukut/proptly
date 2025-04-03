require('dotenv').config();
const supabase = require('../src/database');
const properties = require('../../src/data/properties.data').properties;
const { v4: uuidv4 } = require('uuid');

async function migrateProperties() {
  console.log('Starting property migration...');
  
  try {
    // First, ensure the properties table exists with the correct structure
    const { error: tableError } = await supabase.from('properties').select().limit(1);
    if (tableError) {
      console.error('Properties table might not exist:', tableError.message);
      return;
    }

    // Format properties data
    const formattedProperties = properties.map(prop => ({
      id: uuidv4(), // Generate new UUID for each property
      owner_id: prop.ownerId || null,
      title: prop.title,
      description: prop.description || '',
      price: typeof prop.price === 'string' ? parseInt(prop.price.replace(/[^0-9]/g, '')) : prop.price,
      location: prop.location,
      address: prop.location || '', // Using location as address if no specific address is provided
      type: prop.type || 'Residential',
      status: prop.status || 'Available',
      bedrooms: parseInt(prop.bedrooms) || null,
      bathrooms: parseInt(prop.bathrooms) || null,
      area: prop.area || null,
      images: Array.isArray(prop.images) ? prop.images : [],
      amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
      coordinates: Array.isArray(prop.coordinates) ? prop.coordinates : [],
      date_available: prop.dateAvailable || new Date().toISOString().split('T')[0],
      image: prop.image || null,
      verified: !!prop.verified
    }));

    // Insert properties in batches of 50
    const batchSize = 50;
    for (let i = 0; i < formattedProperties.length; i += batchSize) {
      const batch = formattedProperties.slice(i, i + batchSize);
      console.log(`Migrating batch ${i/batchSize + 1} of ${Math.ceil(formattedProperties.length/batchSize)}`);
      
      const { data, error } = await supabase
        .from('properties')
        .upsert(batch)
        .select();

      if (error) {
        console.error('Error migrating batch:', error);
        console.error('Failed batch data:', JSON.stringify(batch, null, 2));
        return;
      }
      console.log(`Successfully migrated batch of ${data.length} properties`);
    }

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

migrateProperties(); 