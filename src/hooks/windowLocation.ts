import { useEffect, useState } from "react";
import gitHubInjection from "github-injection";

export const useWindowLocation = () => {
  const [location, setLocation] = useState(window.location.href);
  useEffect(() => {
    window.addEventListener("popstate", () => {
      setLocation(window.location.href);
    });

    gitHubInjection(() => {
      if (window.location.href !== location) {
        setLocation(window.location.href);
      }
    });
  }, []);

  return location;
};
