import type { NextConfig } from "next";
import type { RuntimeCaching } from "next-pwa";

declare module "next-pwa" {
  interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    fallbacks?: {
      html?: string;
      image?: string;
      font?: string;
    };
    runtimeCaching?: RuntimeCaching[];
    buildExcludes?: string[];
  }

  function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
