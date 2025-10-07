import { Button } from '@/components/ui/button'

export default function Products() {
  const productData = {
    title: 'Our Products',
    description: 'Discover the range of products we offer to honor your loved ones with dignity and peace.',
    products: [
      {
        name: 'Serenity Lawn',
        description: 'A double-depth in-ground burial plot marked with marble stone and covered with well-manicured grass.',
        image: 'https://picsum.photos/seed/serenity-lawn/400/300.jpg',
      },
      {
        name: 'Columbarium (Niche)',
        description: 'A best-in-class burial unit crafted with premium concrete, with flat markers made of authentic marble stone.',
        image: 'https://picsum.photos/seed/columbarium/400/300.jpg',
      },
      {
        name: 'Bone Chamber & Ash Vault',
        description: 'A concrete repository for bone and ash remains at the upper park level with a garden and magnificent view.',
        image: 'https://picsum.photos/seed/bone-chamber/400/300.jpg',
      },
      {
        name: 'Family Estate',
        description: 'This sacred way to honor and memorialize family, there is nothing more special than an estate of your own.',
        image: 'https://picsum.photos/seed/family-estate/400/300.jpg',
      },
    ],
  }

  return (
    // Main section with a subtle, light background for a serene feel
    <section id="products" aria-labelledby="products-heading">
      <div className="landing-page-wrapper">
        {/* Header */}
        <div className="max-w-2xl">
          {/* Corrected aria-labelledby matching h2 id */}
          <h2 id="products-heading" className="mb-6 text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">
            {productData.title}
          </h2>
          <p className="text-lg leading-8 text-gray-800">{productData.description}</p>
        </div>

        {/* Product Grid */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {productData.products.map((product) => (
            <article
              key={product.name}
              // Card with a clean white background, subtle border, and shadow
              className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <img src={product.image} alt={product.name} className="aspect-[4/3] w-full rounded-lg object-cover" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900 transition-colors">{product.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>
              </div>
              {/* Optional: Add a "Learn More" link per card for better UX */}
              {/* <div className="mt-4">
                <a href="#" className="text-brand-primary text-sm leading-6 font-semibold hover:underline">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div> */}
            </article>
          ))}
        </div>

        {/* Redesigned Additional Services / CTA Section */}
        <div className="mt-20 rounded-2xl bg-slate-900 p-8 sm:p-12">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Additional Services</h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              We also provide respectful services for Interment Transfer, Reburial, and Exhumation for fresh, skeletal, and cinerary remains.
            </p>
            <div className="mt-8">
              {/* Using a secondary button style for contrast on the dark background */}
              <Button variant="secondary" size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
