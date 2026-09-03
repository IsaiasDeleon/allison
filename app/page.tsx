'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Church,
  Clock3,
  Crown,
  Download,
  Gift,
  Heart,
  Leaf,
  MapPin,
  MoonStar,
  Music2,
  Pause,
  Play,
  Shirt,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { EVENT_CONFIG, PENDIENTE } from '@/js/config';

const FIREFLIES = Array.from({ length: 27 }, (_, index) => index);
const SHORT_NAME = EVENT_CONFIG.quinceanera.nombre;
const FULL_NAME = EVENT_CONFIG.quinceanera.nombreCompleto;
const DISPLAY_SURNAME = FULL_NAME.startsWith(`${SHORT_NAME} `)
  ? FULL_NAME.slice(SHORT_NAME.length + 1)
  : FULL_NAME;

type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder?: boolean;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'pending' | 'upcoming' | 'today' | 'past';
};

const pad = (value: number) => String(value).padStart(2, '0');

function valueOrPending(value: string) {
  return value?.trim() || PENDIENTE;
}

function eventDate() {
  if (!EVENT_CONFIG.evento.fecha) return null;
  return new Date(`${EVENT_CONFIG.evento.fecha}T${EVENT_CONFIG.evento.hora || '00:00'}:00`);
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function calculateCountdown(): Countdown {
  const target = eventDate();
  if (!target || Number.isNaN(target.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'pending' };
  }

  const now = new Date();
  if (dateKey(now) === dateKey(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' };
  }

  const difference = target.getTime() - now.getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'past' };
  }

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
    status: 'upcoming',
  };
}

function useCountdown() {
  const [countdown, setCountdown] = useState<Countdown>(calculateCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(calculateCountdown()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return countdown;
}

function useReveal(trigger: boolean) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [trigger]);
}

function SectionHeading({ kicker, title, light = false }: { kicker: string; title: string; light?: boolean }) {
  return (
    <header className={`section-heading${light ? ' is-light' : ''}`} data-reveal>
      <p>{kicker}</p>
      <h2>{title}</h2>
      <span aria-hidden="true"><i />✦<i /></span>
    </header>
  );
}

function Fireflies() {
  return (
    <div className="fireflies" aria-hidden="true">
      {FIREFLIES.map((firefly) => <i key={firefly} />)}
    </div>
  );
}

function MusicPlayer({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [hasError, setHasError] = useState(false);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
      setHasError(false);
    } catch {
      setHasError(true);
    }
  };

  const seek = (value: number | readonly number[]) => {
    const next = Array.isArray(value) ? value[0] : value;
    if (audioRef.current && Number.isFinite(next)) audioRef.current.currentTime = next;
  };

  const changeVolume = (value: number | readonly number[]) => {
    const next = Array.isArray(value) ? value[0] : value;
    if (!Number.isFinite(next)) return;
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  };

  return (
    <>
     <audio
  ref={audioRef}
  src={EVENT_CONFIG.musica.archivo}
  preload="metadata"
  loop
  onPlay={() => setPlaying(true)}
  onPause={() => setPlaying(false)}
  onEnded={() => setPlaying(false)}
  onLoadedMetadata={(event) =>
    setDuration(event.currentTarget.duration || 0)
  }
  onTimeUpdate={(event) =>
    setCurrentTime(event.currentTarget.currentTime)
  }
  onError={() => setHasError(true)}
/>

      <div className="music-card" data-reveal>
        <div className={`record-art${playing ? ' is-playing' : ''}`} aria-hidden="true">
          <span><Music2 /></span>
        </div>
        <div className="music-details">
          <p className="music-label">La melodía de esta noche</p>
          <h3>{hasError ? 'Canción pendiente' : `Música de ${SHORT_NAME}`}</h3>
          <div className="progress-row">
            <span>{formatTime(currentTime)}</span>
            <Slider
              aria-label="Progreso de la canción"
              min={0}
              max={duration || 1}
              step={0.1}
              value={[Math.min(currentTime, duration || 1)]}
              onValueChange={seek}
              className="music-slider"
            />
            <span>{duration ? formatTime(duration) : '--:--'}</span>
          </div>
          <div className="music-actions">
            <Button className="round-control" size="icon-lg" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
              {playing ? <Pause /> : <Play />}
            </Button>
            <div className="volume-control">
              {volume === 0 ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
              <Slider
                aria-label="Volumen"
                min={0}
                max={1}
                step={0.05}
                value={[volume]}
                onValueChange={changeVolume}
              />
            </div>
          </div>
          {hasError && <p className="music-hint">Sustituye <code>assets/audio/cancion.mp3</code></p>}
        </div>
      </div>

      <Button className={`music-fab${playing ? ' is-playing' : ''}`} size="icon-lg" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
        {playing ? <Pause /> : <Music2 />}
      </Button>
    </>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  return `${minutes}:${pad(Math.floor(value % 60))}`;
}

function LocationCard({ kind }: { kind: 'ceremonia' | 'recepcion' }) {
  const location = EVENT_CONFIG[kind];
  const ceremony = kind === 'ceremonia';
  return (
    <article className="location-card" data-reveal>
      <div className="location-icon" aria-hidden="true">{ceremony ? <Church /> : <MoonStar />}</div>
      <p className="card-kicker">{ceremony ? 'Momento solemne' : 'Celebremos juntos'}</p>
      <h3>{ceremony ? 'Ceremonia' : 'Recepción'}</h3>
      <dl>
        <div><dt>Lugar</dt><dd>{valueOrPending(location.nombre)}</dd></div>
        <div><dt>Hora</dt><dd>{valueOrPending(location.hora)}</dd></div>
        <div><dt>Dirección</dt><dd>{valueOrPending(location.direccion)}</dd></div>
      </dl>
      {location.maps ? (
        <a className="outline-link" href={location.maps} target="_blank" rel="noreferrer">
          <MapPin aria-hidden="true" /> {ceremony ? 'Ver ubicación' : 'Cómo llegar'}
        </a>
      ) : (
        <span className="outline-link is-disabled" aria-disabled="true"><MapPin aria-hidden="true" /> Ubicación pendiente</span>
      )}
    </article>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const touchStart = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown();
  useReveal(opened);

  const gallery = EVENT_CONFIG.galeria as GalleryItem[];
  const selectedImage = gallery[currentImage];

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [opened]);

  const previousImage = useCallback(() => {
    setCurrentImage((current) => (current - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  const nextImage = useCallback(() => {
    setCurrentImage((current) => (current + 1) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    if (!galleryOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') previousImage();
      if (event.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [galleryOpen, nextImage, previousImage]);

  const dateParts = useMemo(() => {
    const date = eventDate();
    if (!date || Number.isNaN(date.getTime())) {
      return { weekday: PENDIENTE, day: '—', month: PENDIENTE, year: '—' };
    }
    return {
      weekday: new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(date),
      day: pad(date.getDate()),
      month: new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(date),
      year: String(date.getFullYear()),
    };
  }, []);

  const googleCalendarUrl = useMemo(() => {
    const start = eventDate();
    if (!start) return '';
    const end = new Date(start.getTime() + 6 * 60 * 60 * 1_000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const query = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Mis XV · ${EVENT_CONFIG.quinceanera.nombreCompleto}`,
      dates: `${stamp(start)}/${stamp(end)}`,
      details: `Una noche mágica para celebrar los XV años de ${SHORT_NAME}.`,
      location: EVENT_CONFIG.recepcion.direccion || EVENT_CONFIG.ceremonia.direccion || '',
    });
    return `https://calendar.google.com/calendar/render?${query.toString()}`;
  }, []);

  const openInvitation = () => {
    setOpened(true);
    window.setTimeout(() => {
      audioRef.current?.play().catch(() => undefined);
    }, 0);
  };

  const downloadCalendar = () => {
    const start = eventDate();
    if (!start) return;
    const end = new Date(start.getTime() + 6 * 60 * 60 * 1_000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//XV ${SHORT_NAME}//ES`,
      'BEGIN:VEVENT',
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:Mis XV - ${EVENT_CONFIG.quinceanera.nombreCompleto}`,
      `LOCATION:${EVENT_CONFIG.recepcion.direccion || EVENT_CONFIG.ceremonia.direccion || ''}`,
      `DESCRIPTION:Una noche mágica para celebrar los XV años de ${SHORT_NAME}.`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mis-xv-allison.ics';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const whatsappUrl = EVENT_CONFIG.whatsapp.numero
    ? `https://wa.me/${EVENT_CONFIG.whatsapp.numero.replace(/\D/g, '')}?text=${encodeURIComponent(EVENT_CONFIG.whatsapp.mensaje)}`
    : '';

  return (
    <main className="invitation-shell">
      {!opened && (
        <section className="welcome-screen" aria-label="Bienvenida a la invitación">
          <div className="art-deco-frame" aria-hidden="true" />
          <Fireflies />
          <div className="welcome-copy">
            <p className="eyebrow">Estás invitado a una noche mágica</p>
            <span className="roman-mark" aria-hidden="true">XV</span>
            <h1>{EVENT_CONFIG.quinceanera.nombre}</h1>
            <p className="welcome-note">Un jardín encantado está por florecer</p>
            <Button className="gold-button" size="lg" onClick={openInvitation}>
              <Sparkles aria-hidden="true" /> Abrir invitación
            </Button>
            <p className="sound-note"><Music2 aria-hidden="true" /> Activa la experiencia con música</p>
          </div>
        </section>
      )}

      {opened && <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <Fireflies />
        <div className="hero-content">
          <p className="eyebrow">Mis XV años</p>
          <h2 id="hero-title">{EVENT_CONFIG.quinceanera.nombre}</h2>
          <p className="full-name">{DISPLAY_SURNAME}</p>
          <span className="ornament" aria-hidden="true"><i />✦<i /></span>
          <p className="event-date">{EVENT_CONFIG.evento.fecha || PENDIENTE}</p>
          <blockquote>Una noche para recordar,<br />un sueño por comenzar.</blockquote>
        </div>
        <a className="scroll-cue" href="#presentacion" aria-label="Desliza para descubrir la invitación">
          <span>Desliza para descubrir</span><ChevronDown aria-hidden="true" />
        </a>
      </section>

      <section id="presentacion" className="intro-section section-pad">
        <div className="intro-grid content-width">
          <div className="portrait-placeholder" data-reveal>
            <img
              className="portrait-image"
              src={EVENT_CONFIG.imagenes.presentacion}
              alt={`Espacio reservado para una fotografía de ${SHORT_NAME}`}
              width="800"
              height="1000"
            />
            <span>[PENDIENTE] · Fotografía de {SHORT_NAME}</span>
          </div>
          <div className="intro-copy" data-reveal>
            <p className="script-accent">Hay momentos…</p>
            <h2>que soñamos<br />desde pequeñas</h2>
            <p>Hay momentos inolvidables que se guardan para siempre en el corazón. Hoy comienza uno de los más especiales para mí y quiero compartirlo contigo.</p>
            <div className="name-lockup"><span>Mis XV años</span><strong>{SHORT_NAME}</strong><small>{DISPLAY_SURNAME}</small></div>
          </div>
        </div>
        <MusicPlayer audioRef={audioRef} />
      </section>

      <section className="family-section section-pad">
        <div className="content-narrow">
          <SectionHeading kicker="Con el amor de mi familia" title="Mis padres" light />
          <div className="family-names" data-reveal>
            <div><span>Mamá</span><strong>{valueOrPending(EVENT_CONFIG.padres.mama)}</strong></div>
            <Heart aria-hidden="true" />
            <div><span>Papá</span><strong>{valueOrPending(EVENT_CONFIG.padres.papa)}</strong></div>
          </div>
          {EVENT_CONFIG.padrinos.activo && (
            <div className="godparents" data-reveal>
              <p>Mis padrinos</p>
              {(EVENT_CONFIG.padrinos.nombres as string[]).map((name) => <strong key={name}>{name || PENDIENTE}</strong>)}
            </div>
          )}
        </div>
      </section>

      <section className="date-section section-pad">
        <div className="content-narrow">
          <SectionHeading kicker="Una fecha para guardar" title="Cuando la magia comience" />
          <div className="date-composition" data-reveal>
            <p>{dateParts.weekday}</p>
            <div><span>{dateParts.month}</span><strong>{dateParts.day}</strong><span>{dateParts.year}</span></div>
            <small>Guardar la fecha</small>
          </div>
          <div className="calendar-actions" data-reveal>
            {googleCalendarUrl ? (
              <a className="primary-link" href={googleCalendarUrl} target="_blank" rel="noreferrer"><CalendarPlus /> Google Calendar</a>
            ) : (
              <span className="primary-link is-disabled" aria-disabled="true"><CalendarPlus /> Fecha pendiente</span>
            )}
            <Button className="secondary-button" onClick={downloadCalendar} disabled={!EVENT_CONFIG.evento.fecha}>
              <Download /> Descargar .ics
            </Button>
          </div>
        </div>
      </section>

      <section className="countdown-section section-pad" aria-live="polite">
        <div className="content-width">
          <SectionHeading kicker="Cada instante nos acerca" title="Cuenta regresiva" light />
          {countdown.status === 'today' ? (
            <p className="countdown-message">¡Hoy comienza la magia!</p>
          ) : countdown.status === 'past' ? (
            <p className="countdown-message">Gracias por acompañarme en este día tan especial.</p>
          ) : (
            <div className="countdown-grid" data-reveal>
              {[
                [countdown.status === 'pending' ? '—' : String(countdown.days), 'Días'],
                [countdown.status === 'pending' ? '—' : pad(countdown.hours), 'Horas'],
                [countdown.status === 'pending' ? '—' : pad(countdown.minutes), 'Minutos'],
                [countdown.status === 'pending' ? '—' : pad(countdown.seconds), 'Segundos'],
              ].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          )}
          {countdown.status === 'pending' && <p className="pending-note">La cuenta comenzará al agregar la fecha en <code>js/config.js</code>.</p>}
        </div>
      </section>

      <section className="gallery-section section-pad">
        <div className="content-width">
          <SectionHeading kicker="Instantes de una historia" title={`Galería de ${SHORT_NAME}`} />
   
          <div className="masonry-gallery">
            {gallery.map((image, index) => (
              <button
                type="button"
                className="gallery-item"
                key={image.src}
                data-reveal
                onClick={() => { setCurrentImage(index); setGalleryOpen(true); }}
                aria-label={`Abrir ${image.alt}`}
              >
                <img src={image.src} alt={image.alt} loading="lazy" width={image.width} height={image.height} />
                {image.placeholder && <span>[PENDIENTE] · foto{pad(index + 1)}.webp</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="lightbox" showCloseButton>
          <DialogTitle className="sr-only">Galería de {SHORT_NAME}</DialogTitle>
          <DialogDescription className="sr-only">Imagen {currentImage + 1} de {gallery.length}</DialogDescription>
          {selectedImage && (
            <div
              className="lightbox-stage"
              onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
              onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const distance = event.changedTouches[0].clientX - touchStart.current;
                if (Math.abs(distance) > 48) distance > 0 ? previousImage() : nextImage();
                touchStart.current = null;
              }}
            >
              <img src={selectedImage.src} alt={selectedImage.alt} width={selectedImage.width} height={selectedImage.height} />
              <p>{selectedImage.placeholder ? `Sustituir foto${pad(currentImage + 1)}.webp` : selectedImage.alt}</p>
            </div>
          )}
          <Button className="lightbox-nav is-prev" size="icon-lg" onClick={previousImage} aria-label="Imagen anterior"><ChevronLeft /></Button>
          <Button className="lightbox-nav is-next" size="icon-lg" onClick={nextImage} aria-label="Imagen siguiente"><ChevronRight /></Button>
          <span className="lightbox-count">{currentImage + 1} / {gallery.length}</span>
        </DialogContent>
      </Dialog>

      <section className="locations-section section-pad">
        <div className="content-width">
          <SectionHeading kicker="Dónde nos encontraremos" title="La celebración" />
          <div className="locations-grid">
            <LocationCard kind="ceremonia" />
            <LocationCard kind="recepcion" />
          </div>
        </div>
      </section>

      <section className="timeline-section section-pad">
        <div className="content-width">
          <SectionHeading kicker="El ritmo de nuestra noche" title="Itinerario" />
          <p className="provisional-pill">Horario</p>
          <ol className="timeline">
            {EVENT_CONFIG.itinerario.map((item, index) => (
              <li key={`${item.hora}-${item.titulo}`} data-reveal style={{ '--item-index': index } as React.CSSProperties}>
                <time>{item.hora}</time><span aria-hidden="true"><i /></span><p>{item.titulo}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="details-section section-pad">
        <div className="content-width details-grid">
          <article className="detail-panel" data-reveal>
            <Shirt aria-hidden="true" />
            <p className="card-kicker">Código de vestimenta</p>
            <h2>{EVENT_CONFIG.dressCode.titulo}</h2>
            <p>{EVENT_CONFIG.dressCode.detalle}</p>
            {EVENT_CONFIG.dressCode.reservarVerde && <small>Con mucho cariño, te pedimos reservar el color verde para nuestra quinceañera.</small>}
          </article>
          <article className="detail-panel" data-reveal>
            <Gift aria-hidden="true" />
            <p className="card-kicker">Mesa de regalos</p>
            <h2>Tu presencia es mi mejor regalo</h2>
            <p>{EVENT_CONFIG.regalos.activo ? 'Si deseas tener un detalle conmigo…' : 'Información pendiente por confirmar.'}</p>
          </article>
        </div>
      </section>

      <section className="quote-section section-pad">
        <Fireflies />
        <div className="content-narrow" data-reveal>
          <Crown aria-hidden="true" />
          <blockquote>“Los sueños se construyen con pequeños momentos que terminan convirtiéndose en recuerdos para toda la vida.”</blockquote>
          <p>— {SHORT_NAME}</p>
        </div>
      </section>

      <section className="rsvp-section section-pad">
        <div className="rsvp-frame content-narrow" data-reveal>
          <Leaf aria-hidden="true" />
          <p className="eyebrow">Queremos compartir esta noche contigo</p>
          <h2>Confirma tu asistencia</h2>
          <p>Por favor confirma tu asistencia antes del:</p>
          <strong>{valueOrPending(EVENT_CONFIG.evento.fechaConfirmacion)}</strong>
          {whatsappUrl ? (
            <a className="whatsapp-link" href={whatsappUrl} target="_blank" rel="noreferrer">Confirmar por WhatsApp</a>
          ) : (
            <span className="whatsapp-link is-disabled" aria-disabled="true">WhatsApp pendiente</span>
          )}
        
        </div>
      </section>

      <section className="final-section">
        <img src={EVENT_CONFIG.imagenes.final} alt={`Jardín nocturno con nenúfares, destellos dorados y el texto Mis XV ${SHORT_NAME}`} width="1600" height="840" loading="lazy" />
        <div className="final-copy" data-reveal>
          <p>Nos vemos muy pronto</p>
          <span>{EVENT_CONFIG.evento.fecha || PENDIENTE}</span>
          <strong>Gracias por formar parte de mi historia.</strong>
        </div>
      </section>

      <footer>XV {SHORT_NAME} · {eventDate()?.getFullYear() || PENDIENTE}</footer>
      </>}
    </main>
  );
}
