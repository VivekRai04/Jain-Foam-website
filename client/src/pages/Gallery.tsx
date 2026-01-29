import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_filename: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export default function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Fetch gallery items from API
  const { data: galleryItems = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return res.json() as Promise<GalleryItem[]>;
    },
  });

  useEffect(() => {
    setIsVisible(true);

    // Check for filter in URL params
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (filter && filters.includes(filter)) {
      setSelectedFilter(filter);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".observe-slide-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const filters = ["All", "Mattresses", "Curtains", "Sofas", "Wallpapers", "Carpets", "Blinds"];

  const filteredItems =
    selectedFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedFilter);

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 py-16">
        <div
          className={`max-w-7xl mx-auto px-4 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-4" data-testid="badge-gallery">Our Gallery</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6" data-testid="heading-gallery">
            Browse Our Work
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our collection of quality furnishings and home décor transformations
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
              className="hover-elevate active-elevate-2"
              data-testid={`button-filter-${filter.toLowerCase()}`}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300"
              data-testid={`card-gallery-${item.id}`}
            >
              <div className="aspect-square overflow-hidden bg-muted/30 relative group">
                <img
                  src={item.image_path}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  data-testid={`img-gallery-${item.id}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="mb-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Instagram className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="heading-instagram">
            Follow Us on Instagram
          </h2>
          <p className="text-muted-foreground mb-8">
            Stay updated with our latest products, offers, and home décor inspiration
          </p>
          <a
            href="https://www.instagram.com/jain_foam"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" data-testid="button-follow-instagram">
              <Instagram className="w-5 h-5 mr-2" />
              Follow @jain_foam
            </Button>
          </a>
        </div>
      </section>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
