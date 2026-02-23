import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface AboutPreviewData {
  headline?: string;
  body?: string;
  cta_text?: string;
  cta_link?: string;
  image_url?: string;
}

export default function HomeAboutPreview({ data }: { data: AboutPreviewData }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-dhi">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[5/4] bg-[#F5F5F5] overflow-hidden">
              {data.image_url ? (
                <Image
                  src={data.image_url}
                  alt="About Da Hausa Initiative"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-px bg-[#BF4E14] mx-auto mb-8" />
                    <p className="font-display text-3xl font-light text-black">Community.</p>
                    <p className="font-display text-3xl font-light text-[#BF4E14]">Evidence.</p>
                    <p className="font-display text-3xl font-light text-black">Impact.</p>
                    <div className="w-16 h-px bg-[#BF4E14] mx-auto mt-8" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="section-label">Who We Are</span>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-black mb-6">
              {data.headline || "About Da Hausa Initiative"}
            </h2>
            <div className="w-12 h-0.5 bg-[#BF4E14] mb-8" />
            <p className="body-text text-[#4A4A4A] mb-8 leading-relaxed">
              {data.body ||
                "Da Hausa Initiative (DHI) exists to address the literacy gaps that hold communities back. We focus on Northern Nigeria — a region rich in potential but historically underserved by mainstream financial and digital systems."}
            </p>
            <Link
              href={data.cta_link || "/about"}
              className="btn-outline-orange inline-flex items-center gap-2"
            >
              {data.cta_text || "Learn More About Us"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
