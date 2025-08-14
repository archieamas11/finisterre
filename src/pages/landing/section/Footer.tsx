import React, { useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-card border-muted w-full border-t">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center space-x-2">
              <span className="text-3xl">🕊️</span>
              <span className="text-foreground text-xl font-bold">Finisterre</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Providing dignified cemetery management solutions with compassion, technology, and respect for sacred spaces.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Linkedin">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground mb-6 font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#our-services-section" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#showcase-section" className="text-muted-foreground hover:text-primary transition-colors">
                  Showcase
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#about-section-heading" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground mb-6 font-semibold">Contact Us</h3>
            <div className="text-muted-foreground space-y-4">
              <div>
                <span className="text-foreground font-medium">Email:</span> info@finisterre.com
              </div>
              <div>
                <span className="text-foreground font-medium">Phone:</span> 0998 841 1173 | 0917 621 6823
              </div>
              <div>
                <span className="text-foreground font-medium">Landline:</span>407 3099 | 254 3065
              </div>
              <div>
                <span className="text-foreground font-medium">Address:</span> Poblacion, Ward III, Minglanilla, Cebu
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-foreground mb-6 font-semibold">Email Us</h3>
            <p className="text-muted-foreground mb-4">For inquiries, please reach out to us at info@finisterre.com.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="border-muted bg-background text-foreground focus:ring-primary w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
                required
              />
              <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-full px-4 py-2 font-semibold transition-colors">
                Mail
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-muted mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground mb-4 text-sm md:mb-0">© 2025 Finisterre. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
