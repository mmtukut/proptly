import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Shield, Star, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Banner */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold mb-1">Verified Properties</h3>
                <p className="text-gray-400 text-sm">100% verified listings</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold mb-1">50k+ Happy Customers</h3>
                <p className="text-gray-400 text-sm">Join our growing community</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold mb-1">4.8/5 Rating</h3>
                <p className="text-gray-400 text-sm">Based on 10k+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Proptly</h2>
            <p className="text-gray-400 mb-6">
              Your trusted partner in finding the perfect property. We make property hunting simple, secure, and successful.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-400 hover:text-white transition-colors">
                  Map View
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-gray-400 hover:text-white transition-colors">
                  Saved Properties
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-gray-400 hover:text-white transition-colors">
                  Compare Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold mb-4">Property Types</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties?type=residential" className="text-gray-400 hover:text-white transition-colors">
                  Residential Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=commercial" className="text-gray-400 hover:text-white transition-colors">
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=land" className="text-gray-400 hover:text-white transition-colors">
                  Land
                </Link>
              </li>
              <li>
                <Link to="/properties?type=luxury" className="text-gray-400 hover:text-white transition-colors">
                  Luxury Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>Abuja, Nigeria</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <a href="tel:+2341234567890" className="hover:text-white transition-colors">
                  +234 805 641 9040
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@proptly.com" className="hover:text-white transition-colors">
                  info@proptly.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Proptly. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;