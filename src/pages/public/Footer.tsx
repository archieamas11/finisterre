import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const footerLinks = {
    solutions: [
      { name: 'Burial Plots', href: '#' },
      { name: 'Mausoleums', href: '#' },
      { name: 'Cremation Niches', href: '#' },
      { name: 'Memorial Services', href: '#' },
    ],
    support: [
      { name: 'Grief Counseling', href: '#' },
      { name: 'Pre-need Planning', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Our History', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Accessibility', href: '#' },
    ],
  }

  return (
    <footer id="footer" className="border-border/50 border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="landing-page-wrapper">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link to="/#hero" className="flex items-center gap-2 font-bold">
              <img src="/favicon.svg" alt="Finisterre" className="h-6 w-6" />
              <span className="text-xl text-[var(--brand-primary)]">Finisterre Gardenz</span>
            </Link>
            <p className="text-base leading-6 text-gray-600">
              The Finisterre brand stands for the most exquisitely designed memorial estates in Cebu.
            </p>
            <Link to="/about" className="font-bold text-[var(--brand-primary)]">
              Learn more
            </Link>
            <div className="mt-10 flex space-x-6">
              <a href="#" className="text-[var(--brand-primary)]">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-[var(--brand-primary)]">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-[var(--brand-primary)]">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-[var(--brand-primary)]">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm leading-6 font-semibold text-[var(--brand-primary)]">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.solutions.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-600">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm leading-6 font-semibold text-[var(--brand-primary)]">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-600">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm leading-6 font-semibold text-[var(--brand-primary)]">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-600">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm leading-6 font-semibold text-[var(--brand-primary)]">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-600">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border/50 border-t">
        <div className="space-y-4 mx-auto max-w-[1300px] px-6 py-10 sm:py-10 text-center">
          <p className="text-sm leading-5 text-gray-500">&copy; {new Date().getFullYear()} Finisterre. All rights reserved.</p>
          <p className="text-xs leading-5 text-gray-500">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
              Terms of Service
            </a>{' '}
            apply.
          </p>
        </div>
      </div>
    </footer>
  )
}
