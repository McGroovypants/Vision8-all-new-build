import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";
import { EditorialGrid } from "./editorial-grid";

/*
  Ported from the approved mockup v3.2 in "Photo page/v8-photo-mockup", with
  one structural change made at the client's instruction on 15 Aug 2026: the
  Coastguard contact sheet ("Ready for anything") moves from last to directly
  below the hero, so breadth is the first thing the page says. The two arty
  breathers keep their pacing role between the remaining collections.

  Collections here mean photographs that belong together, not one client per
  section; the labels stay while that holds true.

  Curation and copy are expected to change: the client wants an editor for
  swapping images, adjusting crops and rewriting text, like the homepage's.
  That editor is not built yet, so every image and line below is source truth.

  Images are served from public/photography/, downsized once at import time
  (1800px cap, 640px for the square crops). The mockup's originals stay in the
  mockup folder; never hotlink media.vision8.co.nz, its URLs expire to 403.
*/
const P = "/photography";

const HERO = `${P}/dragonfly-in-hongkong-1786678073-de2cf7f1.jpg`;

// Coastguard, 30 face-aware square crops, mockup order.
const contactSheet = [
  "img-9882-1786678083-f2afb9ac.jpg",
  "img-9945-1786678087-d802a26a.jpg",
  "img-9848-1786678084-2feeddb1.jpg",
  "imgc5125-1786679978-98ce3cd9.jpg",
  "imgc5156-1786679980-fddd06ac.jpg",
  "imgc5183-1786679980-e74fa471.jpg",
  "imgc5145-1786679982-1ae7d3e5.jpg",
  "imgc5152-1786679984-ce1e9b99.jpg",
  "imgc5146-1786679984-aa9d737f.jpg",
  "img-9839-1786734650-24c73033.jpg",
  "img-9805-1786734650-358e3e09.jpg",
  "imgc9164-1786734654-84d3bff1.jpg",
  "imgc9207-1786734655-5935ae27.jpg",
  "imgc9198-1786734656-a8c4a4c1.jpg",
  "imgc9205-1786734657-76665e23.jpg",
  "screenshot-2026-05-08-at-8-00-09-am-1786734657-589e683c.jpg",
  "screenshot-2026-05-08-at-7-59-58-am-1786734659-695db86e.jpg",
  "imgc9076-1786734661-338ae127.jpg",
  "img-9708-1786734661-968d33d9.jpg",
  "screenshot-2026-05-08-at-8-00-25-am-1786734663-c971d587.jpg",
  "imgc9249-1786734663-fdd2f819.jpg",
  "imgc9258-1786734666-6ee7051f.jpg",
  "imgc9257-1786734669-6da9117a.jpg",
  "imgc9195-1786734677-580cbd08.jpg",
  "imgc9191-1786734682-ffdcf6d7.jpg",
  "imgc9224-1786734683-a6d908fa.jpg",
  "imgc5128-1600x1067-1786740334-cf37bf51.jpg",
  "imgc5146-1600x1066-1786740338-cd4074cd.jpg",
  "imgc5178-1600x1066-1786740340-eb17da65.jpg",
  "imgc5130-1600x1067-1786740343-ae22cf2e.jpg",
].map((file) => `${P}/crops/${file}`);

// Primary ITO, eight cards, three fully visible at rest, hover fans all eight.
const fanned = [
  "p-ito-arb-sm-4-1600x1600-1786737303-7d992457.jpg",
  "p-ito-arb-sm-8179-1600x1600-1786737303-42da1c0d.jpg",
  "p-ito-arb-sm-2-4-1600x1600-1786737304-a2bfa171.jpg",
  "p-ito-arb-sm-1600x1600-1786737304-2d244eff.jpg",
  "p-ito-arb-sm-2-1600x1600-1786737304-ea1bf9d1.jpg",
  "p-ito-arb-sm-2-2-1600x1600-1786737305-9f2a8920.jpg",
  "p-ito-arb-sm-5-1600x1600-1786737305-70383a12.jpg",
  "p-ito-arb-sm-6-1600x1600-1786737305-b08bc111.jpg",
].map((file) => `${P}/${file}`);

// OSPRI, eight vertical strips, hover expands.
const strips = [
  "imgc4355-1785813065.jpg",
  "imgc4385-1785813065.jpg",
  "imgc4226-1785813065.jpg",
  "imgc4401-1785813065.jpg",
  "imgc4007-1785813065.jpg",
  "imgc1933-1786735898-19bed632.jpg",
  "imgc1702-1786735899-65ad6ea4.jpg",
  "imgc1711-1786735902-b8fabc66.jpg",
].map((file) => `${P}/${file}`);

// Hikoi and observational work, ten images on the aligned six-column grid.
const editorial = [
  "img-4112-1785781272.jpg",
  "screen-shot-2018-10-01-at-8-55-41-pm-2-1785781422.jpg",
  "screen-shot-2018-10-01-at-8-57-08-pm-1785781422.jpg",
  "imgc4692-1786394460-dfc39369.jpg",
  "imgc3882-1786394460-847a5f1a.jpg",
  "imgc4454-1786394464-18c566a0.jpg",
  "imgc4657-1786394468-f4afa50a.jpg",
  "imgc3884-1786394471-72c746a7.jpg",
  "imgc4800-1786394473-b9daa8a1.jpg",
  "imgc4746-1786394475-9fee2875.jpg",
].map((file) => `${P}/${file}`);

const BREATHER_ONE = `${P}/z6-1786678073-6c134bec.jpg`;
const BREATHER_TWO = `${P}/img-8268a-1785783280.jpg`;

export const metadata: Metadata = {
  title: "Photography | Vision8",
  description: "Vision8 photography for people, organisations and events.",
};

export default function PhotographyPage() {
  return (
    <main className="photo-page">
      <PageHeader division="Photography" />

      <section className="photo-hero">
        <img src={HERO} alt="Vision8 Photography" />
        {/* v1.11.34: the "Vision8 Photography" eyebrow went; the division
            already reads in the header lockup, as on Audio and Real Estate.
            The supporting sentence is the client's approved hero copy. */}
        <div className="photo-hero-overlay">
          <h1>Sometimes one frame is enough.</h1>
          <p className="photo-hero-lede">Photography for people, places, products and the work behind them.</p>
        </div>
      </section>

      <section className="photo-section">
        <p className="photo-label">Coastguard</p>
        <h2 className="photo-title">Ready for anything</h2>
        <div className="contact-grid">
          {contactSheet.map((src) => (
            <div className="contact-cell" key={src}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-section">
        <p className="photo-label">Primary ITO</p>
        <h2 className="photo-title">Hands on, every day</h2>
        <div className="fan-stack">
          {fanned.map((src, index) => (
            <div className="fan-card" key={src} style={{ "--i": index } as React.CSSProperties}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-breather">
        <img src={BREATHER_ONE} alt="" loading="lazy" />
      </section>

      <section className="photo-section">
        <p className="photo-label">OSPRI</p>
        <h2 className="photo-title">Faces, places, purpose</h2>
        <div className="strips-container">
          {strips.map((src) => (
            <div className="strip" key={src}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-breather">
        <img src={BREATHER_TWO} alt="" loading="lazy" />
      </section>

      <section className="photo-section">
        <p className="photo-label">Hikoi &amp; Observational</p>
        <h2 className="photo-title">Because they just happen</h2>
        <EditorialGrid images={editorial} />
      </section>

      {/* v1.11.34: replaced "Every collection is different because every
          story is different." with the client's preferred closing, a simple
          bookend to the hero line without repeating it. */}
      <section className="photo-closing">
        <h2>Sometimes all you need is a still image.</h2>
      </section>

      <p className="portfolio-build">Build v1.11.34</p>
    </main>
  );
}
