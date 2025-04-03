export const infrastructureData = {
  categories: [
    {
      id: 'schools',
      name: 'Schools',
      icon: '🏫',
      items: [
        {
          id: 1,
          name: 'Turkish Nile University',
          location: [7.491, 9.082],
          type: 'University',
          rating: 4.7,
          distance: '1.2km',
          details: {
            type: 'Private University',
            facilities: ['Library', 'Sports Complex', 'Labs'],
            studentCapacity: 5000
          }
        },
        {
          id: 2,
          name: 'Baze University',
          location: [7.479, 9.097],
          type: 'University',
          rating: 4.6,
          distance: '2.5km',
          details: {
            type: 'Private University',
            facilities: ['Modern Library', 'Research Centers'],
            studentCapacity: 4000
          }
        },
        {
          id: 3,
          name: 'Veritas University',
          location: [7.513, 9.087],
          type: 'University',
          rating: 4.5,
          distance: '3.1km',
          details: {
            type: 'Private Catholic University',
            facilities: ['Chapel', 'Library', 'Labs'],
            studentCapacity: 3500
          }
        },
        {
          id: 4,
          name: 'Lead British International School',
          location: [7.503, 9.089],
          type: 'International School',
          rating: 4.8,
          distance: '1.1km',
          details: {
            type: 'Primary & Secondary',
            curriculum: 'British',
            facilities: ['Swimming Pool', 'Sports Complex']
          }
        },
        {
          id: 5,
          name: 'Nigerian Turkish International School',
          location: [7.495, 9.094],
          type: 'International School',
          rating: 4.5,
          distance: '2.0km',
          details: {
            type: 'Primary & Secondary',
            curriculum: 'International',
            facilities: ['Science Labs', 'Sports Facilities']
          }
        },
        {
          id: 6,
          name: 'Capital Science Academy',
          location: [7.512, 9.078],
          type: 'Secondary School',
          rating: 4.7,
          distance: '0.8km',
          details: {
            type: 'Secondary Education',
            facilities: ['Science Labs', 'Sports Field']
          }
        },
        {
          id: 7,
          name: 'Government Secondary School Garki',
          location: [7.489, 9.065],
          type: 'Secondary School',
          rating: 4.0,
          distance: '1.5km',
          details: {
            type: 'Public Secondary',
            facilities: ['Classrooms', 'Sports Field']
          }
        },
        {
          id: 8,
          name: 'Model Secondary School Maitama',
          location: [7.505, 9.082],
          type: 'Secondary School',
          rating: 4.3,
          distance: '1.8km',
          details: {
            type: 'Public Secondary',
            facilities: ['Library', 'Labs', 'Sports Field']
          }
        }
      ]
    },
    {
      id: 'hospitals',
      name: 'Hospitals',
      icon: '🏥',
      items: [
        {
          id: 1,
          name: 'National Hospital Abuja',
          location: [7.483, 9.051],
          type: 'General Hospital',
          rating: 4.5,
          distance: '1.5km',
          details: {
            services: ['Emergency Care', 'Surgery', 'Pediatrics'],
            beds: 350,
            operatingHours: '24/7'
          }
        },
        {
          id: 2,
          name: 'Cedarcrest Hospital',
          location: [7.491, 9.076],
          type: 'Specialist Hospital',
          rating: 4.6,
          distance: '0.9km',
          details: {
            services: ['Orthopedics', 'Cardiology'],
            beds: 200,
            operatingHours: '24/7'
          }
        },
        {
          id: 3,
          name: 'Garki Hospital',
          location: [7.495, 9.033],
          type: 'General Hospital',
          rating: 4.3,
          distance: '2.2km',
          details: {
            services: ['General Medicine', 'Surgery'],
            beds: 250,
            operatingHours: '24/7'
          }
        },
        {
          id: 4,
          name: 'Asokoro District Hospital',
          location: [7.526, 9.045],
          type: 'General Hospital',
          rating: 4.3,
          distance: '1.8km',
          details: {
            services: ['Emergency Care', 'Maternity'],
            beds: 200,
            operatingHours: '24/7'
          }
        },
        {
          id: 5,
          name: 'Wuse General Hospital',
          location: [7.491, 9.082],
          type: 'General Hospital',
          rating: 4.2,
          distance: '1.3km',
          details: {
            services: ['General Medicine', 'Pediatrics'],
            beds: 180,
            operatingHours: '24/7'
          }
        },
        {
          id: 6,
          name: 'Nisa Premier Hospital',
          location: [7.488, 9.058],
          type: 'Private Hospital',
          rating: 4.7,
          distance: '1.4km',
          details: {
            services: ['Maternity', 'Surgery', 'IVF'],
            beds: 100,
            operatingHours: '24/7'
          }
        }
      ]
    },
    {
      id: 'roads',
      name: 'Roads',
      icon: '🛣️',
      items: [
        {
          id: 1,
          name: 'Nnamdi Azikiwe Expressway',
          location: [7.495, 9.065],
          type: 'Major Highway',
          rating: 4.3,
          distance: '1.1km',
          details: {
            type: 'Six-Lane Highway',
            condition: 'Excellent',
            connections: ['Airport Road', 'City Center']
          }
        },
        {
          id: 2,
          name: 'Ahmadu Bello Way',
          location: [7.486, 9.072],
          type: 'Major Road',
          rating: 4.0,
          distance: '0.7km',
          details: {
            type: 'Four-Lane Road',
            condition: 'Good',
            connections: ['Central Business District']
          }
        }
      ]
    },
    {
      id: 'transport',
      name: 'Transport',
      icon: '🚌',
      items: [
        {
          id: 1,
          name: 'Abuja Central Station',
          location: [7.495, 9.065],
          type: 'Train Station',
          rating: 4.3,
          distance: '1.1km',
          details: {
            routes: ['Abuja-Kaduna', 'Abuja-Lagos'],
            facilities: ['Parking', 'Waiting Area']
          }
        },
        {
          id: 2,
          name: 'Berger Bus Terminal',
          location: [7.486, 9.072],
          type: 'Bus Station',
          rating: 4.0,
          distance: '0.7km',
          details: {
            routes: ['City Center', 'Airport'],
            operatingHours: '5:00 AM - 10:00 PM'
          }
        }
      ]
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: '⚡',
      items: [
        {
          id: 1,
          name: 'Abuja Power Substation',
          location: [7.482, 9.071],
          type: 'Electricity',
          rating: 4.0,
          coverage: '20km radius',
          details: {
            type: 'Power Distribution',
            capacity: '132/33 KV',
            reliability: '90%'
          }
        },
        {
          id: 2,
          name: 'Water Treatment Plant',
          location: [7.489, 9.068],
          type: 'Water Supply',
          rating: 4.2,
          coverage: '15km radius',
          details: {
            type: 'Water Treatment',
            capacity: '500,000 liters/day'
          }
        }
      ]
    },
    {
      id: 'development',
      name: 'Development Projects',
      icon: '🏗️',
      items: [
        {
          id: 1,
          name: 'Abuja Light Rail Extension',
          location: [7.488, 9.068],
          type: 'Infrastructure',
          status: 'In Progress',
          completion: '2025',
          details: {
            description: 'Extension of light rail network',
            impact: 'Improved transportation',
            stage: 'Phase 2'
          }
        },
        {
          id: 2,
          name: 'Smart City Initiative',
          location: [7.492, 9.075],
          type: 'Urban Development',
          status: 'Planning',
          completion: '2026',
          details: {
            description: 'Digital infrastructure upgrade',
            impact: 'Enhanced connectivity',
            stage: 'Initial Phase'
          }
        },
        {
          id: 3,
          name: 'City Initiative',
          location: [7.492, 9.75],
          type: 'Urban Development',
          status: 'Planning',
          completion: '2026',
          details: {
            description: 'Digital infrastructure upgrade',
            impact: 'Enhanced connectivity',
            stage: 'Initial Phase'
          }
        }
      ]
    }
  ]
}; 