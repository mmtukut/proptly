const owners = [
  {
    id: 'owner1',
    name: 'Muhammad Tukur',
    avatar: '/images/agents/agent1.jpg',
    joinedYear: '2021',
    totalProperties: 15,
    rating: 4.9,
    reviews: 124,
    responseTime: '1 hour',
    languages: ['English', 'Hausa'],
    specializations: ['Luxury Properties', 'Commercial Real Estate'],
    about: 'Premium real estate agent with over 10 years of experience in the Nigerian property market.',
    contactInfo: {
      phone: '+234 123 456 7890',
      email: 'mtukur@example.com',
      whatsapp: '+234 123 456 7890'
    },
    certifications: ['Licensed Real Estate Broker', 'Certified Property Manager'],
    achievements: ['Top Agent 2022', 'Excellence in Customer Service 2023']
  },
  // Add more owners as needed
];

const getOwnerById = (id) => owners.find(owner => owner.id === id);

module.exports = {
  owners,
  getOwnerById
}; 