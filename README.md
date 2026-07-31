# Tadman Properties Hub

Build a website that looks exactly like the image uploaded with slight difference in color and image use the details below. Build a complete production-ready premium Real Estate Marketplace SaaS called "Tadman Homes & Properties".

My logo will be uploaded manually.

My homepage inspiration screenshot will also be uploaded manually.

Use the exact same layout and design=======================================





BRAND





========================================





Business Name





Tadman Homes & Properties





Tagline





Buy, Sell & Rent Premium Properties Worldwide.





Target Audience





Property Buyers





Property Sellers





Real Estate Agencies





Property Developers





Investors





Landlords





Property Managers





Worldwide Audience





========================================





GOAL





========================================





This platform must allow





Visitors to browse properties





Visitors to search properties





Visitors to rent





Visitors to buy





Visitors to contact agents





Visitors to save favourites





AND





Allow merchants to subscribe monthly so they can advertise their own properties.





Each merchant must have a private dashboard.





========================================





DESIGN





========================================





Luxury





Modern





Minimal





Elegant





Premium





Use





Rounded corners





Large whitespace





Beautiful cards





Large hero image





Premium typography





Smooth animations





Glass effects where appropriate





Luxury shadows





Responsive design





Professional icons





Sticky navigation





Beautiful footer





Excellent mobile experience





The finished product should feel comparable to Zillow, Airbnb, Realtor.com and Sotheby's.





========================================





PAGES





========================================





Home





Properties





Property Details





Buy





Rent





Sell





Agents





Become a Merchant





Pricing





Blog





About





Contact





Login





Register





Forgot Password





Privacy Policy





Terms





404





========================================





HOME PAGE





========================================





Navigation





Hero





Property Search





Featured Properties





Featured Locations





Property Categories





Why Choose Us





Latest Listings





Testimonials





Become A Merchant





Blog





Newsletter





Footer





Hero Heading





Find Your Perfect Property Anywhere in the World





Hero Text





Buy, Sell & Rent Premium Properties Worldwide.





Buttons





Browse Properties





Become a Merchant





========================================





PROPERTY SEARCH





========================================





Search by





Country





State





City





Area





Keyword





Price





Bedrooms





Bathrooms





Property Type





Property Status





========================================





PROPERTY TYPES





========================================





Apartment





House





Villa





Penthouse





Duplex





Land





Commercial

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tadman-homes-lux.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/45b76812-5caf-4e80-8570-2c4249363f12).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Supabase backend

The frontend talks to Supabase directly with the publishable (anon) key and RLS.

### Environment variables

Set these locally in `.env` and in Vercel (Project → Settings → Environment Variables):

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable / anon key |

### What is wired

- `src/lib/supabase.ts` — browser + SSR Supabase client
- `src/hooks/use-auth.tsx` — session and role context (`user_roles` table)
- `/login`, `/register`, `/forgot-password`, `/reset-password` — real Supabase Auth
- `/dashboard` — merchant dashboard: create listings, upload images to the
  `property-images` bucket, review status, delete listings (auth-guarded)
- `/admin` — approve/reject/feature listings, approve merchants, read enquiries
  (guarded by the `admin` role in `user_roles`)
- `/`, `/properties`, `/buy`, `/rent`, `/properties/$propertyId` — live listings
  from the `properties` table (only `status = 'approved'` is public)
- `/agents`, `/blog` — `agents` and `blog_posts` tables
- `/contact` and property enquiry forms — insert into `contact_requests`

All mock listing, agent, blog and testimonial arrays have been removed;
`src/data/properties.ts` now only holds static design assets and type options.

## Migration 0006 — favourites & newsletter

`supabase/migrations/0006_favorites_newsletter.sql` adds the `favorites` and
`newsletter_subscribers` tables (with grants and RLS). Run it in the Supabase
SQL editor so the "Saved properties" page and homepage newsletter form work.
