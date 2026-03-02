"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { client } from "@/lib/sanity";

type PopupData = {
  enabled: boolean;
  delaySeconds: number;
  title: string;
  body?: string;
  ctas: {
    label: string;
    url: string;
  }[];
  hideOnMobile?: boolean;
  hideForSignedIn?: boolean;
  showOnRoutes?: string[];
  image?: {
    asset: {
      url: string;
    };
  };
};

export default function LeadMagnetWrapper() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Normalize path
  function normalize(path: string) {
    const clean = path.toLowerCase().replace(/\/+$/, "") || "/";
    console.log("🔍 Normalized:", path, "→", clean);
    return clean;
  }

  // Match route using exact or wildcard
  function routeMatches(path: string, routes?: string[]) {
    const cleanPath = normalize(path);
    if (!routes || routes.length === 0) return false;

    return routes.some((route) => {
      const cleanRoute = normalize(route);
      if (cleanRoute.endsWith("/*")) {
        const prefix = cleanRoute.replace("/*", "");
        return cleanPath.startsWith(prefix);
      }
      return cleanPath === cleanRoute;
    });
  }

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch popup data
  useEffect(() => {
    let cancel = false;

    async function fetchPopup() {
      const data = await client.fetch(
        `*[_type == "leadMagnetPopup" && enabled == true][0]{
          enabled,
          delaySeconds,
          title,
          body,
          ctas[] {
            label,
            url
          },
          hideOnMobile,
          hideForSignedIn,
          showOnRoutes,
          image { asset->{url} }
        }`,
      );

      if (cancel || !data) return;

      setPopup(data);
    }

    fetchPopup();
    return () => {
      cancel = true;
    };
  }, []);

  // Route, login, mobile visibility logic
  useEffect(() => {
    if (!popup) return;

    const routeOk = routeMatches(pathname || "", popup.showOnRoutes);

    console.log("🧭 pathname:", pathname);
    console.log("🧭 showOnRoutes from Sanity:", popup.showOnRoutes);
    console.log("🧭 MATCH RESULT:", routeOk);

    if (
      (popup.hideOnMobile && isMobile) ||
      (popup.hideForSignedIn && isSignedIn) ||
      !routeOk
    ) {
      setVisible(false);
      return;
    }

    const timeout = setTimeout(
      () => {
        setVisible(true);
      },
      (popup.delaySeconds || 30) * 1000,
    );

    return () => clearTimeout(timeout);
  }, [popup, pathname, isSignedIn, isMobile]);

  // ESC key & scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVisible(false);
    if (visible) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!popup || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-[#F8ECD7] rounded-xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {popup.image?.asset?.url && (
          <div className="w-full">
            <img
              src={popup.image.asset.url}
              alt={popup.title}
              className="w-full h-48 object-cover object-center sm:rounded-t-xl"
            />
          </div>
        )}

        <div className="p-6 space-y-4 relative">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-4 right-4 text-[#6B5B3B] hover:text-black text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold text-[#3D2C17]">
            {popup.title}
          </h2>

          {popup.body && (
            <p className="text-sm text-[#6B5B3B] leading-relaxed">
              {popup.body}
            </p>
          )}

          <div className="space-y-3 pt-2">
            {popup.ctas?.map((cta, i) => (
              <a
                key={i}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#A3783C] text-white text-sm font-semibold py-3 rounded-lg shadow hover:bg-[#8e682f] transition"
              >
                {cta.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
