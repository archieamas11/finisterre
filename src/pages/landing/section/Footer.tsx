import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter signup
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    return (
        <footer className="bg-card border-t border-muted w-full">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="text-3xl">🕊️</span>
                            <span className="text-foreground font-bold text-xl">Finisterre</span>
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
                        <h3 className="text-foreground font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href="#our-services-section" className="text-muted-foreground hover:text-primary transition-colors">Our Services</a></li>
                            <li><a href="#showcase-section" className="text-muted-foreground hover:text-primary transition-colors">Showcase</a></li>
                            <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#about-section-heading" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-6">Contact Us</h3>
                        <div className="space-y-4 text-muted-foreground">
                            <div><span className="font-medium text-foreground">Email:</span> info@finisterre.com</div>
                            <div><span className="font-medium text-foreground">Phone:</span> 0998 841 1173 | 0917 621 6823</div>
                            <div><span className="font-medium text-foreground">Landline:</span>407 3099 | 254 3065</div>
                            <div><span className="font-medium text-foreground">Address:</span> Poblacion, Ward III, Minglanilla, Cebu</div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-foreground font-semibold mb-6">Email Us</h3>
                        <p className="text-muted-foreground mb-4">
                            For inquiries, please reach out to us at info@finisterre.com.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-full rounded-full border border-muted bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full rounded-full bg-primary text-primary-foreground px-4 py-2 font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Mail
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-muted mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                        © 2025 Finisterre. All rights reserved.
                    </p>
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