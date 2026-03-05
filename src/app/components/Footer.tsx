import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">SE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-script text-white">Sakshi</span>
                <span className="text-xs tracking-widest text-white/80">ENTERPRISE</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Your trusted supplier of Ayurvedic and healthcare products committed to promoting quality, reliability, and customer satisfaction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/quote" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories/ayurvedic" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Ayurvedic Range
                </Link>
              </li>
              <li>
                <Link to="/categories/healthcare" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Healthcare Essentials
                </Link>
              </li>
              <li>
                <Link to="/categories/immunity" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Immunity Boosters
                </Link>
              </li>
              <li>
                <Link to="/categories/herbal" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Herbal Supplements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">sales.it@sakshient.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  +91 93263 47507<br />
                  +91 89282 23528
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Sakshi
                  ENTERPRISE<br />
                  Mumbai - 400078
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Sakshi Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}