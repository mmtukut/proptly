import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Building, Award, ChartBar, Shield } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Properties Listed', value: '10,000+', icon: Building },
    { label: 'Happy Clients', value: '5,000+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: MapPin },
    { label: 'Years Experience', value: '10+', icon: Award },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in complete transparency in all our dealings, providing accurate and verified property information.',
      icon: Shield
    },
    {
      title: 'Innovation',
      description: 'Constantly improving our platform with cutting-edge technology to enhance your property search experience.',
      icon: ChartBar
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-[#1c5bde]/10 via-white to-[#1c5bde]/10 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              About FastFind
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 mb-8"
            >
              Your trusted partner in finding the perfect property in Nigeria. We combine technology 
              and local expertise to make property search seamless and efficient.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-[#1c5bde]/10 p-4 rounded-full">
                    <stat.icon className="h-6 w-6 text-[#1c5bde]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-6"
            >
              Our Mission
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              To revolutionize property search in Nigeria by providing a transparent, 
              efficient, and technology-driven platform that connects property seekers 
              with their dream properties while offering valuable insights for informed 
              decision-making.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-12 text-center"
            >
              Our Values
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#1c5bde]/10 p-3 rounded-full">
                      <value.icon className="h-6 w-6 text-[#1c5bde]" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                  </div>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 