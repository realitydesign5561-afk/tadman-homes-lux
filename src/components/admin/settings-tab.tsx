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
      await Promise.all([
        saveSetting("brand", settings.brand),
        saveSetting("contact", settings.contact),
        saveSetting("hero", settings.hero),
        saveSetting("footer", settings.footer),
        saveSetting("about_page", settings.about_page),
        saveSetting(
          "property_management_page",
          settings.property_management_page,
        ),
        saveSetting("legal_team_page", settings.legal_team_page),
        saveSetting("contact_page", settings.contact_page),
      ]);

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Website Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the public website content and contact information.
        </p>
      </div>

      {/* Brand */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Brand</h3>

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Site name"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Motto"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Logo URL"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Favicon URL"
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
        />
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Address"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Primary email"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Secondary email"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Phone"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="WhatsApp"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Opening hours"
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
        />
      </section>

      {/* Hero */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Homepage Hero</h3>

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Hero title"
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
        />

        <textarea
          className="w-full rounded-lg border p-3 min-h-28"
          placeholder="Hero subtitle"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Primary CTA"
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
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Secondary CTA"
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
        />
      </section>

      {/* Footer */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Footer</h3>

        <textarea
          className="w-full rounded-lg border p-3 min-h-28"
          placeholder="Footer about text"
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
        />
      </section>

      {/* Pages */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Website Pages</h3>

        <textarea
          className="w-full rounded-lg border p-3 min-h-28"
          placeholder="About page content"
          value={settings.about_page.body}
          onChange={(e) =>
            setSettings({
              ...settings,
              about_page: {
                ...settings.about_page,
                body: e.target.value,
              },
            })
          }
        />

        <textarea
          className="w-full rounded-lg border p-3 min-h-28"
          placeholder="Property management page content"
          value={settings.property_management_page.body}
          onChange={(e) =>
            setSettings({
              ...settings,
              property_management_page: {
                ...settings.property_management_page,
                body: e.target.value,
              },
            })
          }
        />

        <textarea
          className="w-full rounded-lg border p-3 min-h-28"
          placeholder="Legal team page content"
          value={settings.legal_team_page.body}
          onChange={(e) =>
            setSettings({
              ...settings,
              legal_team_page: {
                ...settings.legal_team_page,
                body: e.target.value,
              },
            })
          }
        />

        <textarea
          className="w-full rounded-lg border p-3 min-h-28"
          placeholder="Contact page content"
          value={settings.contact_page.body}
          onChange={(e) =>
            setSettings({
              ...settings,
              contact_page: {
                ...settings.contact_page,
                body: e.target.value,
              },
            })
          }
        />
      </section>

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
          <span className="text-sm font-medium">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
