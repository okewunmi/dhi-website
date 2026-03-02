// "use client";

// import { useState } from "react";
// import { ExternalLink, ChevronLeft, ChevronRight, Play } from "lucide-react";

// interface Video {
//   title: string;
//   description: string;
//   thumbnail_url: string;
//   youtube_url: string;
//   duration?: string;
//   date?: string;
// }

// interface VideosData {
//   headline?: string;
//   subheadline?: string;
//   videos?: Video[];
// }

// export default function HomeVideos({ data }: { data: VideosData }) {
//   const videos = (data.videos || []) as Video[];
//   const [current, setCurrent] = useState(0);

//   const visible = 3; // cards visible at a time on desktop
//   const total = videos.length;
//   const canPrev = current > 0;
//   const canNext = current < total - visible;

//   const prev = () => setCurrent((c) => Math.max(0, c - 1));
//   const next = () => setCurrent((c) => Math.min(total - visible, c + 1));

//   if (!total) return null;

//   return (
//     <section className="section-padding bg-[#F5F5F5] overflow-hidden">
//       <div className="container-dhi">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
//           <div>
//             <span className="section-label">Watch & Learn</span>
//             <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-black">
//               {data.headline || "From Our Channel"}
//             </h2>
//             {data.subheadline && (
//               <p className="text-[#4A4A4A] mt-2 max-w-xl text-sm sm:text-base">
//                 {data.subheadline}
//               </p>
//             )}
//           </div>

//           {/* Prev / Next — desktop only */}
//           {total > visible && (
//             <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
//               <button
//                 onClick={prev}
//                 disabled={!canPrev}
//                 aria-label="Previous"
//                 className="w-10 h-10 border border-[#E8E8E8] flex items-center justify-center text-black hover:border-[#BF4E14] hover:text-[#BF4E14] transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white"
//               >
//                 <ChevronLeft size={18} />
//               </button>
//               <button
//                 onClick={next}
//                 disabled={!canNext}
//                 aria-label="Next"
//                 className="w-10 h-10 border border-[#E8E8E8] flex items-center justify-center text-black hover:border-[#BF4E14] hover:text-[#BF4E14] transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Carousel — desktop sliding, mobile horizontal scroll */}
//         <div className="relative">

//           {/* Desktop sliding window */}
//           <div className="hidden sm:block overflow-hidden">
//             <div
//               className="flex gap-5 transition-transform duration-500 ease-in-out"
//               style={{ transform: `translateX(calc(-${current} * (100% / ${visible} + 20px/3)))` }}
//             >
//               {videos.map((video, i) => (
//                 <VideoCard key={i} video={video} />
//               ))}
//             </div>
//           </div>

//           {/* Mobile: horizontal scroll */}
//           <div className="flex sm:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
//             {videos.map((video, i) => (
//               <div key={i} className="snap-start flex-shrink-0 w-[80vw]">
//                 <VideoCard video={video} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Dot indicators */}
//         {total > 1 && (
//           <div className="flex justify-center gap-2 mt-8">
//             {videos.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   // on mobile each dot = one video; on desktop clamp
//                   const maxIdx = Math.max(0, total - visible);
//                   setCurrent(Math.min(i, maxIdx));
//                 }}
//                 className={`w-2 h-2 rounded-full transition-colors ${
//                   i >= current && i < current + visible
//                     ? "bg-[#BF4E14]"
//                     : "bg-[#D8D8D8]"
//                 }`}
//                 aria-label={`Go to video ${i + 1}`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Mobile prev/next */}
//         {total > 1 && (
//           <div className="flex sm:hidden items-center justify-center gap-3 mt-5">
//             <button
//               onClick={prev}
//               disabled={current === 0}
//               className="w-9 h-9 border border-[#E8E8E8] flex items-center justify-center text-black hover:border-[#BF4E14] hover:text-[#BF4E14] transition-colors disabled:opacity-30 bg-white"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             <span className="text-xs text-gray-400">{current + 1} / {total}</span>
//             <button
//               onClick={next}
//               disabled={current >= total - 1}
//               className="w-9 h-9 border border-[#E8E8E8] flex items-center justify-center text-black hover:border-[#BF4E14] hover:text-[#BF4E14] transition-colors disabled:opacity-30 bg-white"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }

// function VideoCard({ video }: { video: Video }) {
//   return (
//     <a
//       href={video.youtube_url || "#"}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="group block bg-white border border-[#E8E8E8] hover:border-[#BF4E14] transition-all flex-shrink-0 sm:flex-1 min-w-0"
//       style={{ minWidth: 0, flex: "1 0 calc(33.333% - 14px)" }}
//     >
//       {/* Thumbnail */}
//       <div className="relative aspect-video bg-[#1A1A1A] overflow-hidden">
//         {video.thumbnail_url ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={video.thumbnail_url}
//             alt={video.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//             onError={(e) => { e.currentTarget.style.display = "none"; }}
//           />
//         ) : (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-12 h-12 bg-[#BF4E14] rounded-full flex items-center justify-center">
//               <Play size={20} className="text-white ml-1" fill="white" />
//             </div>
//           </div>
//         )}
//         {/* Play overlay on hover */}
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
//           <div className="w-12 h-12 bg-[#BF4E14] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-300">
//             <Play size={18} className="text-white ml-0.5" fill="white" />
//           </div>
//         </div>
//         {/* Duration badge */}
//         {video.duration && (
//           <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
//             {video.duration}
//           </span>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-4 sm:p-5">
//         <h3 className="font-semibold text-black text-sm sm:text-base leading-snug mb-2 group-hover:text-[#BF4E14] transition-colors line-clamp-2">
//           {video.title}
//         </h3>
//         {video.description && (
//           <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed mb-3 line-clamp-2">
//             {video.description}
//           </p>
//         )}
//         <div className="flex items-center justify-between">
//           {video.date && (
//             <span className="text-[10px] text-gray-400 uppercase tracking-wide">{video.date}</span>
//           )}
//           <span className="ml-auto flex items-center gap-1 text-[#BF4E14] text-xs font-semibold">
//             Watch on YouTube <ExternalLink size={11} />
//           </span>
//         </div>
//       </div>
//     </a>
//   );
// }

"use client";

import { useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, Play, Youtube } from "lucide-react";

interface Video {
  title: string;
  description: string;
  youtube_url: string;
  duration?: string;
  date?: string;
}

interface VideosData {
  headline?: string;
  subheadline?: string;
  videos?: Video[];
}

// Extract YouTube video ID from any YouTube URL format
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("?")[0];
    }
    // youtube.com/watch?v=VIDEO_ID
    const v = parsed.searchParams.get("v");
    if (v) return v;
    // youtube.com/embed/VIDEO_ID or youtube.com/shorts/VIDEO_ID
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts[0] === "embed" || parts[0] === "shorts") return parts[1];
  } catch {
    // not a valid URL — try regex fallback
    const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  return null;
}

// Returns best available YouTube thumbnail
function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  // hqdefault (480×360) is always available; maxresdefault may 404 on older videos
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function HomeVideos({ data }: { data: VideosData }) {
  const videos = (data.videos || []) as Video[];
  const [current, setCurrent] = useState(0);

  const visible = 3;
  const total = videos.length;
  const canPrev = current > 0;
  const canNext = current < total - visible;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - visible, c + 1));

  if (!total) return null;

  return (
    <section className="section-padding bg-[#F5F5F5] overflow-hidden">
      <div className="container-dhi">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Watch & Learn</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-black">
              {data.headline || "From Our Channel"}
            </h2>
            {data.subheadline && (
              <p className="text-[#4A4A4A] mt-2 max-w-xl text-sm sm:text-base">
                {data.subheadline}
              </p>
            )}
          </div>

          {/* Prev / Next arrows — desktop */}
          {total > visible && (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={prev}
                disabled={!canPrev}
                aria-label="Previous"
                className="w-10 h-10 border border-[#E8E8E8] bg-white flex items-center justify-center text-black hover:border-[#BF4E14] hover:text-[#BF4E14] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                disabled={!canNext}
                aria-label="Next"
                className="w-10 h-10 border border-[#E8E8E8] bg-white flex items-center justify-center text-black hover:border-[#BF4E14] hover:text-[#BF4E14] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: sliding window carousel */}
        <div className="hidden sm:block overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${current} * (100% / ${Math.min(visible, total)} + ${20 / Math.min(visible, total)}px)))`,
            }}
          >
            {videos.map((video, i) => (
              <div
                key={i}
                style={{ flex: `0 0 calc(${100 / Math.min(visible, total)}% - ${(20 * (Math.min(visible, total) - 1)) / Math.min(visible, total)}px)` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: snap scroll */}
        <div className="flex sm:hidden gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4">
          {videos.map((video, i) => (
            <div key={i} className="snap-start flex-shrink-0 w-[80vw]">
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(Math.min(i, Math.max(0, total - visible)))}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i >= current && i < current + visible ? "bg-[#BF4E14]" : "bg-[#D8D8D8]"
                }`}
                aria-label={`Video ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mobile prev/next */}
        {total > 1 && (
          <div className="flex sm:hidden items-center justify-center gap-3 mt-4">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-9 h-9 border border-[#E8E8E8] bg-white flex items-center justify-center text-black disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-400">{current + 1} / {total}</span>
            <button
              onClick={next}
              disabled={current >= total - 1}
              className="w-9 h-9 border border-[#E8E8E8] bg-white flex items-center justify-center text-black disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

function VideoCard({ video }: { video: Video }) {
  const thumbnail = getYouTubeThumbnail(video.youtube_url);

  return (
    <a
      href={video.youtube_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white border border-[#E8E8E8] hover:border-[#BF4E14] transition-all h-full"
    >
      {/* Thumbnail — auto-generated from YouTube URL */}
      <div className="relative aspect-video bg-[#1A1A1A] overflow-hidden">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Fallback placeholder when no valid YouTube URL yet
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111]">
            <Youtube size={32} className="text-[#BF4E14] mb-2" />
            <p className="text-gray-500 text-xs">No URL set</p>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 bg-[#BF4E14] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
            <Play size={18} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-black text-sm sm:text-base leading-snug mb-2 group-hover:text-[#BF4E14] transition-colors line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-[#4A4A4A] leading-relaxed mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          {video.date && (
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{video.date}</span>
          )}
          <span className="ml-auto flex items-center gap-1 text-[#BF4E14] text-xs font-semibold">
            Watch <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </a>
  );
}