"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID } from "@/lib/fbq";

/**
 * Meta Pixel: loads the base code site-wide (for retargeting), fires the first
 * PageView, and fires PageView again on client-side route changes. Renders
 * nothing until META_PIXEL_ID is set, so there is no broken pixel before launch.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    // The inline base code already fires the first PageView; only fire on
    // subsequent route changes.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
