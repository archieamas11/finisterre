import type { Product } from './types'

export function MobileList({ products }: { products: Product[] }) {
  return (
    <div className="mx-auto mt-12 grid gap-6 md:hidden">
      {products.map((product) => (
        <div key={product.id} className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-slate-800">
          <div className="aspect-video w-full overflow-hidden">
            <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <h3 className="text-primary text-2xl font-bold dark:text-white">{product.title}</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
