import React, { useState } from "react";
import { Play } from "lucide-react";

/**
 * YouTubeFacade — click-to-load YouTube embed using youtube-nocookie.com.
 * No third-party requests fire until the visitor clicks. The play control is
 * keyboard-operable and has a descriptive accessible label.
 */
export default function YouTubeFacade({ videoId, title }) {
  const [loaded, setLoaded] = useState(false);
  // maxresdefault → hqdefault fallback via onError below.
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  if (loaded) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black" data-testid="youtube-facade-loaded">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative w-full aspect-video rounded-3xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]"
      aria-label={`Play video: ${title}`}
      data-testid="youtube-facade-play"
    >
      <img
        src={thumb}
        alt=""
        onError={() => setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-20 h-20 rounded-full flex items-center justify-center bg-[color:var(--gold)] text-[#1D2528] shadow-2xl transition-transform group-hover:scale-110">
          <Play size={30} fill="#1D2528" />
        </span>
      </div>
      <div className="absolute bottom-4 left-5 right-5 text-cream text-left">
        <div className="product-no">CLICK TO PLAY</div>
        <div className="font-display text-xl mt-1 truncate">{title}</div>
        <div className="text-cream/60 text-xs mt-1">Loads only when you press play · no cookies until then</div>
      </div>
    </button>
  );
}
