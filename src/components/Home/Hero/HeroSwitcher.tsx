import { ReactNode, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

import ChristmasHero from "./ChristmassHero";
import DefaultHero from "./DefaultHero";
import { ConventionHero } from "./ConventionHero";
import MountainPrayer from "./MountainPrayer";

const heroMap: Record<string, ReactNode> = {
  convention: <ConventionHero />,
  christmas: <ChristmasHero />,
  default: <DefaultHero />,
  mountain: <MountainPrayer />
};

export default function HeroSwitcher() {
  const [hero, setHero] = useState("default");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const cached = localStorage.getItem("hero");

        if (cached) {
          setHero(cached);
        }

        const docRef = doc(db, "settings", "main");

        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          const fetchedHero =
            data.heroType || "default";

          setHero(fetchedHero);
        console.log("Fetched hero type:", data);

          localStorage.setItem(
            "hero",
            fetchedHero
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchHero();
  }, []);

  return (
    <div className="relative overflow-hidden transition-all duration-700">
      {heroMap[hero] || heroMap.default}
    </div>
  );
}