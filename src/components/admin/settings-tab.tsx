import { useEffect, useState } from "react";
import {
  defaultSettings,
  fetchSettings,
  saveSetting,
  type SiteSettings,
} from "@/lib/settings";

export default function SettingsTab() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const updateSetting = (
    key: keyof SiteSettings,
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      for (const [key, value] of Object.entries(settings)) {
        if (key === "id" || key === "created_at" || key === "updated_at") {
          continue;
        }

        await saveSetting(
          key as keyof SiteSettings,
          value as string
        );
      }

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border p-6">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the main contact and website settings for Tadman Homes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Business Name
          </label>
          <input
            value={settings.business_name ?? ""}
            onChange={(e) =>
              updateSetting("business_name", e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email
          </label>
          <input
            value={settings.email ?? ""}
            onChange={(e) =>
              updateSetting("email", e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Phone
          </label>
          <input
            value={settings.phone ?? ""}
            onChange={(e) =>
              updateSetting("phone", e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            WhatsApp
          </label>
          <input
            value={settings.whatsapp ?? ""}
            onChange={(e) =>
              updateSetting("whatsapp", e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">
            Address
          </label>
          <input
            value={settings.address ?? ""}
            onChange={(e) =>
              updateSetting("address", e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">
            Website Tagline
          </label>
          <input
            value={settings.tagline ?? ""}
            onChange={(e) =>
              updateSetting("tagline", e.target.value)
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {message && (
          <p className="text-sm font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
