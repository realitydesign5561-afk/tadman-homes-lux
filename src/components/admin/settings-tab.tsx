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
        setMessage("Using default settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      await saveSetting("brand", settings.brand);
      await saveSetting("contact", settings.contact);
      await saveSetting("hero", settings.hero);
      await saveSetting("footer", settings.footer);
      await saveSetting("about_page", settings.about_page);
      await saveSetting(
        "property_management_page",
        settings.property_management_page,
      );
      await saveSetting("legal_team_page", settings.legal_team_page);
      await saveSetting("contact_page", settings.contact_page);

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

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
        <p className="text-sm text-muted-foreground mt-1">
          Manage the main website information and contact details.
        </p>
      </div>

      {/* Brand */}
      <section className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Brand</h3>

        <input
          className="w-full rounded-lg border p-3"
          value={settings.brand.site_name}
          onChange={(e) =>
            setSettings({
              ...settings,
              brand: {
                ...settings.brand,
                site_name: e.target.value,
              },
            })
          }
          placeholder="Site name"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.brand.motto}
          onChange={(e) =>
            setSettings({
              ...settings,
              brand: {
                ...settings.brand,
                motto: e.target.value,
              },
            })
          }
          placeholder="Motto"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.brand.logo_url}
          onChange={(e) =>
            setSettings({
              ...settings,
              brand: {
                ...settings.brand,
                logo_url: e.target.value,
              },
            })
          }
          placeholder="Logo URL"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.brand.favicon_url}
          onChange={(e) =>
            setSettings({
              ...settings,
              brand: {
                ...settings.brand,
                favicon_url: e.target.value,
              },
            })
          }
          placeholder="Favicon URL"
        />
      </section>

      {/* Contact */}
      <section className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <input
          className="w-full rounded-lg border p-3"
          value={settings.contact.address}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact: {
                ...settings.contact,
                address: e.target.value,
              },
            })
          }
          placeholder="Address"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.contact.email}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact: {
                ...settings.contact,
                email: e.target.value,
              },
            })
          }
          placeholder="Primary email"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.contact.email_secondary}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact: {
                ...settings.contact,
                email_secondary: e.target.value,
              },
            })
          }
          placeholder="Secondary email"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.contact.phone}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact: {
                ...settings.contact,
                phone: e.target.value,
              },
            })
          }
          placeholder="Phone"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.contact.whatsapp}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact: {
                ...settings.contact,
                whatsapp: e.target.value,
              },
            })
          }
          placeholder="WhatsApp"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.contact.hours}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact: {
                ...settings.contact,
                hours: e.target.value,
              },
            })
          }
          placeholder="Opening hours"
        />
      </section>

      {/* Hero */}
      <section className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Homepage Hero</h3>

        <input
          className="w-full rounded-lg border p-3"
          value={settings.hero.title}
          onChange={(e) =>
            setSettings({
              ...settings,
              hero: {
                ...settings.hero,
                title: e.target.value,
              },
            })
          }
          placeholder="Hero title"
        />

        <textarea
          className="w-full rounded-lg border p-3 min-h-24"
          value={settings.hero.subtitle}
          onChange={(e) =>
            setSettings({
              ...settings,
              hero: {
                ...settings.hero,
                subtitle: e.target.value,
              },
            })
          }
          placeholder="Hero subtitle"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.hero.cta_label}
          onChange={(e) =>
            setSettings({
              ...settings,
              hero: {
                ...settings.hero,
                cta_label: e.target.value,
              },
            })
          }
          placeholder="Primary CTA"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.hero.cta_secondary_label}
          onChange={(e) =>
            setSettings({
              ...settings,
              hero: {
                ...settings.hero,
                cta_secondary_label: e.target.value,
              },
            })
          }
          placeholder="Secondary CTA"
        />
      </section>

      {/* Footer */}
      <section className="rounded-xl border p-6 space-y-4">
        <h3 className="text-lg font-semibold">Footer</h3>

        <textarea
          className="w-full rounded-lg border p-3 min-h-24"
          value={settings.footer.about}
          onChange={(e) =>
            setSettings({
              ...settings,
              footer: {
                ...settings.footer,
                about: e.target.value,
              },
            })
          }
          placeholder="Footer description"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.footer.socials.facebook}
          onChange={(e) =>
            setSettings({
              ...settings,
              footer: {
                ...settings.footer,
                socials: {
                  ...settings.footer.socials,
                  facebook: e.target.value,
                },
              },
            })
          }
          placeholder="Facebook URL"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.footer.socials.instagram}
          onChange={(e) =>
            setSettings({
              ...settings,
              footer: {
                ...settings.footer,
                socials: {
                  ...settings.footer.socials,
                  instagram: e.target.value,
                },
              },
            })
          }
          placeholder="Instagram URL"
        />

        <input
          className="w-full rounded-lg border p-3"
          value={settings.footer.socials.linkedin}
          onChange={(e) =>
            setSettings({
              ...settings,
              footer: {
                ...settings.footer,
                socials: {
                  ...settings.footer.socials,
                  linkedin: e.target.value,
                },
              },
            })
          }
          placeholder="LinkedIn URL"
        />
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-black px-6 py-3 text-white font-semibold disabled:opacity-50"
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
