import { IconBrandInstagram } from "@tabler/icons-react"
import { Eye } from "lucide-react"
import Kacchi from "@/assets/gallery-10.jpeg"
import diningArea from "@/assets/gallery-04.jpeg"
import chef from "@/assets/gallery-08.jpeg"
import family from "@/assets/family-01.jpg"
import sizzling from "@/assets/gallery-20.jpeg"
import Image from "next/image"

export default function GallerySection() {
  const galleryImages = [
    { id: 1, title: "Signature Kacchi", tag: "Food", img: Kacchi },
    { id: 2, title: "Premium Dining Area", tag: "Interior", img: diningArea },
    { id: 3, title: "Our Head Chef at Work", tag: "Chef", img: diningArea },
    { id: 4, title: "Traditional Dessert Platter", tag: "Dessert", img: chef },
    { id: 5, title: "Happy Family Moments", tag: "Customer", img: family },
    { id: 6, title: "Traditional Sizzling Starters", tag: "Food", img: sizzling },
  ]

  return (
    <section className="motion-reveal py-20 bg-background border-t border-border/40">
      <div className="container mx-auto">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-accent font-semibold tracking-wider uppercase text-sm block mb-2">
              #AharBengal Moments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-bengali">Follow Our Culinary Journey</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="motion-scale-hover inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground border border-border font-medium rounded-md hover:bg-muted transition-colors text-sm w-fit"
          >
            <IconBrandInstagram className="w-4 h-4 text-primary" /> @AharBengal
          </a>
        </div>

        {/* Gallery Dynamic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted border border-border/60 cursor-pointer shadow-sm"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-card-foreground/40 z-10 transition-opacity opacity-60 group-hover:opacity-20" />

              <span className="absolute bottom-2 left-2 z-10 text-white font-bengali tracking-wide bg-black/30 px-2 py-1 rounded text-xs">
                {item.tag}
              </span>

              {/* Hover Overlay Detail */}
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center p-4 text-center">
                <Eye className="w-6 h-6 text-primary-foreground mb-2 animate-float" />
                <p className="text-xs text-accent font-semibold tracking-wider uppercase mb-1">{item.tag}</p>
                <h4 className="text-sm font-bold text-primary-foreground font-bengali line-clamp-2">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
