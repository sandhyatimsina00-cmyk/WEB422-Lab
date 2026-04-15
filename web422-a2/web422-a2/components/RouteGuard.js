import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { isAuthenticated } from "@/lib/authenticate";
import { getFavourites } from "@/lib/userData";

const PUBLIC_PATHS = ["/login", "/register", "/about"];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setFavouritesList] = useAtom(favouritesAtom);

  async function updateAtom() {
    setFavouritesList(await getFavourites());
  }

  useEffect(() => {
    async function guard() {
      const isPublicPath = PUBLIC_PATHS.includes(router.pathname);

      if (isPublicPath) {
        if (isAuthenticated()) {
          await updateAtom();
        }
        setAuthorized(true);
        return;
      }

      if (!isAuthenticated()) {
        setAuthorized(false);
        router.push("/login");
        return;
      }

      await updateAtom();
      setAuthorized(true);
    }
    guard();
  }, [router.pathname]);

  return authorized ? <>{children}</> : null;
}
