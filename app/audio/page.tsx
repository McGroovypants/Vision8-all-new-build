import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";

export const metadata: Metadata = {
  title: "Audio | Vision8",
  description: "Audio engineering, music production and original composition for television, advertising, film and music releases.",
};

// Andy's music sits on his own site, which is the preferred destination for
// him. Deep-linked to its own section anchors rather than the homepage, so the
// two buttons land somewhere different; both are real ids on that site.
// Jeramiah goes to Spotify. The `si` share tokens are stripped from that URL:
// they identify the person who copied the link, not the artist.
const ANDY_LISTEN = "https://andymcgrath.com/#listen";
const ANDY_VIDEOS = "https://andymcgrath.com/#videos";
const MODULE = "https://open.spotify.com/artist/5ZBKIdb9VbEXIPrdAFh1V1";
const CONTACT = "mailto:hello@vision8.co.nz";

export default function AudioPage() {
  return (
    <main className="audio-page">
      <PageHeader />

      <header className="audio-hero">
        <div className="audio-inner">
          <div className="audio-hero-copy">
            <p className="audio-eyebrow">Audio</p>
            <h1>What you hear changes what you feel</h1>
            <p className="audio-lede">
              A piece of music can completely alter the way we see an image. Sometimes the best audio work is the
              part nobody consciously notices.
            </p>
            <p>
              Vision8 works across audio engineering, music production and original composition for television,
              advertising, presentations, films and music releases.
            </p>
            <p>
              It might mean rescuing and shaping an important archive recording. Building a mix where every word
              matters. Or starting with an empty timeline and writing the music the pictures need.
            </p>
          </div>
        </div>
      </header>

      <section className="audio-section">
        <div className="audio-inner">
          <div className="audio-split">
            <figure>
              <img src="/audio/te-pataka-korero.jpg" alt="Te Pātaka Kōrero title still" loading="lazy" />
              <figcaption>Te Pātaka Kōrero · Māori+</figcaption>
            </figure>
            <div>
              <p className="audio-eyebrow">Audio engineering</p>
              <h2>Letting every voice come through</h2>
              <p className="audio-lede">
                Bringing archive recordings and studio voice together into one coherent sound.
              </p>
              <h3>Te Pātaka Kōrero</h3>
              <img className="audio-client-logo" src="/audio/maoriplus-logo.svg" alt="Māori+" loading="lazy" />
              <p>
                <em>
                  A thirteen-part series featuring a rich backlog of Radio New Zealand&rsquo;s archival recordings of
                  Māori commentators and history makers.
                </em>
              </p>
              <p>
                The archive material varied in age and quality, so the work was about improving clarity while
                retaining the character of the original recordings.
              </p>
              <p>
                Those voices then had to sit naturally alongside newly recorded studio narration, with each
                retaining its own character while still feeling part of the same programme.
              </p>
              <p>
                <strong>
                  Audio engineering for television, documentary, interviews, archive material and spoken word.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="audio-section">
        <div className="audio-inner">
          <div className="audio-split">
            <figure>
              <img src="/audio/fretboard.jpg" alt="Guitar fretboard close up" loading="lazy" />
              <figcaption>Written, not searched for</figcaption>
            </figure>
            <div>
              <p className="audio-eyebrow">Original music</p>
              <h2>When the right track doesn&rsquo;t exist yet</h2>
              <p>
                Library music has its place. But there are projects where searching through hundreds of tracks is
                really just searching for something that doesn&rsquo;t exist yet.
              </p>
              <p>
                <strong>That&rsquo;s when we compose.</strong>
              </p>
              <p>
                Starting with the pictures, the pace and the feeling we want to leave behind, music can be written
                around the story rather than the story being forced around a track.
              </p>
            </div>
          </div>

          <div className="audio-split audio-flip audio-split-spaced">
            <div>
              <h3>AdventureSmart</h3>
              <p>
                For an AdventureSmart campaign for NZSAR / Tiaki, aimed at international travellers arriving in New
                Zealand via Air New Zealand, Andy McGrath and Jeramiah Ross created an original film-style score for
                the 90-second piece.
              </p>
              <p>
                The music needed to support the scale and beauty of New Zealand, while still leaving room for an
                important safety message.
              </p>
              <p>
                <strong>It was written for the pictures, rather than simply placed underneath them.</strong>
              </p>
              <img
                className="audio-client-logo audio-client-logo-wide"
                src="/audio/adventuresmart-tiaki-logos.jpg"
                alt="AdventureSmart and Tiaki"
                loading="lazy"
              />
            </div>
            <figure>
              <img src="/audio/nzsar-web.jpg" alt="AdventureSmart campaign still, New Zealand landscape" loading="lazy" />
              <figcaption>AdventureSmart · NZSAR / Tiaki</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="audio-section">
        <div className="audio-inner">
          <div className="audio-split audio-flip">
            <div>
              <p className="audio-eyebrow">Music production</p>
              <h2>From first thought to final mix</h2>
              <p>Songs, scores and sound don&rsquo;t necessarily begin in a studio.</p>
              <p>
                Sometimes they start with a guitar, a strange noise, a rhythm, a rough recording or simply a feeling
                that something isn&rsquo;t quite there yet.
              </p>
              <p>
                Vision8 can take that idea through composition, arrangement, recording, editing and mixing, whether
                the finished work is destined for an advertisement, television programme, presentation, album or
                somewhere we haven&rsquo;t thought of yet.
              </p>
            </div>
            <figure>
              <img src="/audio/studio-wide.jpg" alt="Vision8 studio, guitars and desk" loading="lazy" />
              <figcaption>The studio</figcaption>
            </figure>
          </div>
          <div className="audio-duo">
            <img src="/audio/mixer.jpg" alt="Mixing desk faders" loading="lazy" />
            <img src="/audio/drums-bass-split.jpg" alt="Drums and bass recording" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="audio-section">
        <div className="audio-inner">
          <div className="audio-split">
            <figure>
              <img src="/audio/andy-bw-gat.jpg" alt="Andy McGrath playing guitar" loading="lazy" />
              <figcaption>Andy McGrath</figcaption>
            </figure>
            <div>
              <p className="audio-eyebrow">Andy McGrath · Musician</p>
              <h2>Music has always been part of the picture.</h2>
              <p>For Andy, music isn&rsquo;t a service that was added to Vision8. It has been there all along.</p>
              <p>
                As a songwriter, musician, producer and performer, Andy has spent years moving between music and
                pictures, playing guitar, bass, drums and harmonica, writing songs, recording and collaborating with
                other musicians and music producers.
              </p>
              <p>That experience changes the way Vision8 approaches audio.</p>
              <p>It isn&rsquo;t simply about whether something is technically correct.</p>
              <p>
                <strong>It&rsquo;s about whether it feels right.</strong>
              </p>
              <p className="audio-actions">
                <a className="audio-btn audio-btn-solid" href={ANDY_LISTEN} target="_blank" rel="noopener">
                  Listen to Andy&rsquo;s music
                </a>
                <a className="audio-btn" href={ANDY_VIDEOS} target="_blank" rel="noopener">
                  Watch music videos
                </a>
              </p>
            </div>
          </div>
          <div className="audio-duo">
            <img src="/audio/vocal-mic.jpg" alt="Studio microphone and pop shield" loading="lazy" />
            <img src="/audio/andy-studio.jpg" alt="In the studio with guitars" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="audio-section">
        <div className="audio-inner">
          <div className="audio-split audio-flip">
            <div>
              <p className="audio-eyebrow">Jeramiah Ross / Module</p>
              <h2>Collaboration changes the possibilities.</h2>
              <p>
                Vision8 has also worked with longtime collaborator Jeramiah Ross, aka Module, on original music and
                production.
              </p>
              <p>
                Bringing different musical instincts into a project can take it somewhere neither person would have
                reached alone.
              </p>
              <p>
                That was very much the approach behind the AdventureSmart score: pictures first, then finding the
                sound and emotion that belonged with them.
              </p>
              <p className="audio-actions">
                <a className="audio-btn" href={MODULE} target="_blank" rel="noopener">
                  Listen to Module on Spotify
                </a>
              </p>
            </div>
            <figure>
              <img src="/audio/jeramiah-keys.jpg" alt="Jeramiah Ross performing on keys" loading="lazy" />
              <figcaption>Jeramiah Ross · Module</figcaption>
            </figure>
          </div>
          <div className="audio-duo">
            <img src="/audio/groovebox.jpg" alt="Groovebox performance" loading="lazy" />
            <img src="/audio/drum-machine.jpg" alt="Drum machine hardware" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="audio-section">
        <div className="audio-inner">
          <div className="audio-split">
            <figure>
              <img src="/audio/max-andy-bw.jpg" alt="Max Maxwell and Andy McGrath" loading="lazy" />
              <figcaption>Max Maxwell &amp; Andy McGrath</figcaption>
            </figure>
            <div>
              <p className="audio-eyebrow">Mastering engineer &amp; music producer</p>
              <h2>Max Maxwell</h2>
              <p>
                Max Maxwell has been making electronic music in New Zealand since the early 1990s, moving easily
                between downbeat, progressive, funk, soul and electronica.
              </p>
              <p>
                Andy, Jeramiah and Max have collaborated on several songs, with Andy contributing guitar, harmonica
                and vocals across a number of releases. A particular milestone came in 2024 when Max remixed
                Andy&rsquo;s <em>Alive on Fire</em>, which reached No.1 on the SoundCloud NZ Charts.
              </p>
              <p>
                A producer, musician and collaborator at heart, Max has a distinctive ability to bring electronic
                production together with live performance, creating music that feels both crafted and human. He is
                also a sought-after mastering engineer, combining analogue and digital equipment to give tracks
                depth, clarity and a strong, finished sound.
              </p>
              <p>
                Max has performed live at venues and festivals across Aotearoa, bringing that same blend of
                electronic production and real musicianship to the stage.
              </p>
              <p>
                Their collaboration works because they come at music from different directions, with Max&rsquo;s
                electronic instincts meeting Andy and Jeramiah&rsquo;s backgrounds in songwriting and live
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="audio-closing">
        <div className="audio-closing-copy">
          <p className="audio-eyebrow">Audio + pictures</p>
          <h2>
            There doesn&rsquo;t have to be a dividing line between the person thinking about the pictures and the
            person thinking about the sound.
          </h2>
          <p>Often the interesting work happens when both are considered together.</p>
          <p className="audio-big-line">Filming. Editing. Sound. Music.</p>
          <p>Different parts of the same idea.</p>
          <h3>Have something that needs the right sound?</h3>
          <p className="audio-actions">
            <a className="audio-btn audio-btn-solid" href={CONTACT}>
              Talk it through with us
            </a>
          </p>
        </div>
      </section>

      <p className="portfolio-build">Build v1.11.1</p>
    </main>
  );
}
