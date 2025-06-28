"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const publicRoutes = ["/", "/login", "/signup", "/contact", "/pages/Views/contact.js","/pages/Views/homepage.js"];

export default function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current pathname:", pathname);
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isPublic = publicRoutes.some(route => pathname.startsWith(route));

      if (!user && !isPublic) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return null;
}
