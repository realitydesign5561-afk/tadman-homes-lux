import { useQuery } from "@tanstack/react-query";
import { defaultSettings, fetchSettings, type SiteSettings } from "@/lib/settings";

export function useSettings(): SiteSettings {
  const { data } = useQuery({
    queryKey: ["website-settings"],
    queryFn: fetchSettings,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return data ?? defaultSettings;
}
