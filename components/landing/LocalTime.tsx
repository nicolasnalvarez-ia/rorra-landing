"use client";

import { useEffect, useState } from "react";

const TZ = "America/Argentina/Buenos_Aires";

export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TZ,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="footer-time" suppressHydrationWarning>
      Buenos Aires {time ?? "--:--"}
    </span>
  );
}
