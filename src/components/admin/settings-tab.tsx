import { useEffect, useState } from "react";
import {
  defaultSettings,
  fetchSettings,
  saveSetting,
  type SiteSettings,
} from "@/lib/settings";

export default function SettingsTab() {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

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

  const updateSection = <
    K extends keyof SiteSettings
  >(
    section: K,
    field: string,
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const updateSocial = (
    field: keyof SiteSettings["footer"]["socials"],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      footer: {
        ...current.footer,
        socials: {
          ...current.footer.socials,
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
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
          settings.property_management_page
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
  };

  if (loading) {
    return (
      <div className="rounded-xl border p-6">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">
          Website Settings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage Tadman Homes and Properties website content,
          contact information and social links.
        </p>
      </div>

      {/* BRAND */}
      <section className="rounded-xl border p-6 space-y-5">
        <h3 className="text-lg font-semibold">
          Brand
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Site Name"
            value={settings.brand.site_name}
            onChange={(value) =>
              updateSection("brand", "site_name", value)
            }
          />

          <Field
            label="Motto"
            value={settings.brand.motto}
            onChange={(value) =>
              updateSection("brand", "motto", value)
            }
          />

          <Field
            label="Logo URL"
            value={settings.brand.logo_url}
            onChange={(value) =>
              updateSection("brand", "logo_url", value)
            }
          />

          <Field
            label="Favicon URL"
            value={settings.brand.favicon_url}
            onChange={(value) =>
              updateSection("brand", "favicon_url", value)
            }
          />
        </div>
      </section>

      {/* CONTACT */}
      <section className="rounded-xl border p-6 space-y-5">
        <h3 className="text-lg font-semibold">
          Contact Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Address"
            value={settings.contact.address}
            onChange={(value) =>
              updateSection("contact", "address", value)
            }
          />

          <Field
            label="Primary Email"
            value={settings.contact.email}
            onChange={(value) =>
              updateSection("contact", "email", value)
            }
          />

          <Field
            label="Secondary Email"
            value={settings.contact.email_secondary}
            onChange={(value) =>
              updateSection(
                "contact",
                "email_secondary",
                value
              )
            }
          />

          <Field
            label="Phone"
            value={settings.contact.phone}
            onChange={(value) =>
              updateSection("contact", "phone", value)
            }
          />

          <Field
            label="WhatsApp"
            value={settings.contact.whatsapp}
            onChange={(value) =>
              updateSection("contact", "whatsapp", value)
            }
          />

          <Field
            label="Business Hours"
            value={settings.contact.hours}
            onChange={(value) =>
              updateSection("contact", "hours", value)
            }
          />
        </div>
      </section>

      {/* HERO */}
      <section className="rounded-xl border p-6 space-y-5">
        <h3 className="text-lg font-semibold">
          Homepage Hero
        </h3>

        <Field
          label="Title"
          value={settings.hero.title}
          onChange={(value) =>
            updateSection("hero", "title", value)
          }
        />

        <Field
          label="Subtitle"
          value={settings.hero.subtitle}
          onChange={(value) =>
            updateSection("hero", "subtitle", value)
          }
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Primary CTA"
            value={settings.hero.cta_label}
            onChange={(value) =>
              updateSection("hero", "cta_label", value)
            }
          />

          <Field
            label="Secondary CTA"
            value={settings.hero.cta_secondary_label}
            onChange={(value) =>
              updateSection(
                "hero",
                "cta_secondary_label",
                value
              )
            }
          />
        </div>
      </section>

      {/* FOOTER */}
      <section className="rounded-xl border p-6 space-y-5">
        <h3 className="text-lg font-semibold">
          Footer
        </h3>

        <Field
          label="About Text"
          value={settings.footer.about}
          onChange={(value) =>
            updateSection("footer", "about", value)
          }
        />

        <h4 className="font-medium">
          Social Media
        </h4>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Facebook"
            value={settings.footer.socials.facebook}
            onChange={(value) =>
              updateSocial("facebook", value)
            }
          />

          <Field
            label="Instagram"
            value={settings.footer.socials.instagram}
            onChange={(value) =>
              updateSocial("instagram", value)
            }
          />

          <Field
            label="LinkedIn"
            value={settings.footer.socials.linkedin}
            onChange={(value) =>
              updateSocial("linkedin", value)
            }
          />

          <Field
            label="X"
            value={settings.footer.socials.x}
            onChange={(value) =>
              updateSocial("x", value)
            }
          />

          <Field
            label="YouTube"
            value={settings.footer.socials.youtube}
            onChange={(value) =>
              updateSocial("youtube", value)
            }
          />

          <Field
            label="TikTok"
            value={settings.footer.socials.tiktok}
            onChange={(value) =>
              updateSocial("tiktok", value)
            }
          />
        </div>
      </section>

      {/* PAGES */}
      <PageSettings
        title="About Page"
        heading={settings.about_page.heading}
        body={settings.about_page.body}
        onHeading={(value) =>
          updateSection("about_page", "heading", value)
        }
        onBody={(value) =>
          updateSection("about_page", "body", value)
        }
      />

      <PageSettings
        title="Property Management Page"
        heading={settings.property_management_page.heading}
        body={settings.property_management_page.body}
        onHeading={(value) =>
          updateSection(
            "property_management_page",
            "heading",
            value
          )
        }
        onBody={(value) =>
          updateSection(
            "property_management_page",
            "body",
            value
          )
        }
      />

      <PageSettings
        title="Legal Team Page"
        heading={settings.legal_team_page.heading}
        body={settings.legal_team_page.body}
        onHeading={(value) =>
          updateSection(
            "legal_team_page",
            "heading",
            value
          )
        }
        onBody={(value) =>
          updateSection(
            "legal_team_page",
            "body",
            value
          )
        }
      />

      <PageSettings
        title="Contact Page"
        heading={settings.contact_page.heading}
        body={settings.contact_page.body}
        onHeading={(value) =>
          updateSection(
            "contact_page",
            "heading",
            value
          )
        }
        onBody={(value) =>
          updateSection(
            "contact_page",
            "body",
            value
          )
        }
      />

      {/* SAVE */}
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-4 py-3"
      />
    </div>
  );
}

function PageSettings({
  title,
  heading,
  body,
  onHeading,
  onBody,
}: {
  title: string;
  heading: string;
  body: string;
  onHeading: (value: string) => void;
  onBody: (value: string) => void;
}) {
  return (
    <section className="rounded-xl border p-6 space-y-5">
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <Field
        label="Heading"
        value={heading}
        onChange={onHeading}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Body
        </label>

        <textarea
          value={body}
          onChange={(e) => onBody(e.target.value)}
          rows={6}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>
    </section>
  );
}
