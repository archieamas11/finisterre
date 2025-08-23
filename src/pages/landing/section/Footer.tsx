import { Facebook, Twitter, Linkedin, Instagram, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const footerLinks = {
    solutions: [
      { name: 'Burial Plots', href: '#' },
      { name: 'Mausoleums', href: '#' },
      { name: 'Cremation Niches', href: '#' },
      { name: 'Memorial Services', href: '#' }
    ],
    support: [
      { name: 'Grief Counseling', href: '#' },
      { name: 'Pre-need Planning', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Contact Us', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Our History', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Accessibility', href: '#' }
    ]
  }

  return (
    <footer
      id='contact'
      className='border-black/30 border-t'
      aria-labelledby='footer-heading'
    >
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-8'>
          <div className='space-y-8'>
            <Link to='/' className='flex items-center gap-2 font-bold'>
              <MapPin className='text-black h-6 w-6' aria-hidden='true' />
              <span className='text-black text-xl'>Finisterre</span>
            </Link>
            <p className='text-gray-600 text-base leading-6'>
              Providing dignified cemetery management solutions with compassion,
              technology, and respect for sacred spaces.
            </p>
            <div className='flex space-x-6'>
              <a href='#' className='text-gray-500 hover:text-primary'>
                <span className='sr-only'>Facebook</span>
                <Facebook className='h-6 w-6' />
              </a>
              <a href='#' className='text-gray-500 hover:text-primary'>
                <span className='sr-only'>Twitter</span>
                <Twitter className='h-6 w-6' />
              </a>
              <a href='#' className='text-gray-500 hover:text-primary'>
                <span className='sr-only'>Instagram</span>
                <Instagram className='h-6 w-6' />
              </a>
              <a href='#' className='text-gray-500 hover:text-primary'>
                <span className='sr-only'>LinkedIn</span>
                <Linkedin className='h-6 w-6' />
              </a>
            </div>
          </div>
          <div className='mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0'>
            <div className='md:grid md:grid-cols-2 md:gap-8'>
              <div>
                <h3 className='text-black text-sm leading-6 font-semibold'>
                  Solutions
                </h3>
                <ul role='list' className='mt-6 space-y-4'>
                  {footerLinks.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='text-gray-600 hover:text-primary text-sm leading-6'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-10 md:mt-0'>
                <h3 className='text-black text-sm leading-6 font-semibold'>
                  Support
                </h3>
                <ul role='list' className='mt-6 space-y-4'>
                  {footerLinks.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='text-gray-600 hover:text-primary text-sm leading-6'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='md:grid md:grid-cols-2 md:gap-8'>
              <div>
                <h3 className='text-black text-sm leading-6 font-semibold'>
                  Company
                </h3>
                <ul role='list' className='mt-6 space-y-4'>
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='text-gray-600 hover:text-primary text-sm leading-6'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-10 md:mt-0'>
                <h3 className='text-black text-sm leading-6 font-semibold'>
                  Legal
                </h3>
                <ul role='list' className='mt-6 space-y-4'>
                  {footerLinks.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className='text-gray-600 hover:text-primary text-sm leading-6'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='border-border/50 mt-16 border-t pt-8 sm:mt-20 lg:mt-24'>
          <div className='sm:flex sm:items-center sm:justify-between'>
            <p className='text-gray-500 text-sm leading-5'>
              &copy; {new Date().getFullYear()} Finisterre. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
