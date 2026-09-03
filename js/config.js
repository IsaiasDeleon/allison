const ASSET_BASE = import.meta.env.BASE_URL || '/';
const asset = (path) => `${ASSET_BASE}${path}`;

export const EVENT_CONFIG = {
  quinceanera: {
    nombre: 'Allison',
    nombreCompleto: 'Allison Itzel Torres Salazar',
  },

  evento: {
    // Formato obligatorio: AAAA-MM-DD
    fecha: '2026-12-11',

    // Hora en formato de 24 horas
    hora: '17:00',

    fechaConfirmacion: '15 de noviembre de 2026',
    zonaHoraria: 'America/Mexico_City',
  },

  padres: {
    mama: 'Ma. Catalina Salazar Ventura',
    papa: 'José Guadalupe',
  },

  padrinos: {
    activo: true,
    nombres: ['Fortina Ventura'],
  },

  ceremonia: {
    nombre: 'Catedral Metropolitana de San Luis Potosí',
    hora: '17:00',
    direccion:
      'José María Morelos y Pavón 620, Centro Histórico, 78000 San Luis Potosí, S.L.P.',
    maps:
      'https://www.google.com/maps/place/Catedral+Metropolitana+de+San+Luis+Potos%C3%AD/@22.1516705,-100.9781821,17z/data=!4m6!3m5!1s0x868753759939daa7:0x14165e60cc2aa14e!8m2!3d22.1516705!4d-100.9756072',
  },

  recepcion: {
    nombre: 'Salón de Eventos Elegance',
    hora: '19:00',
    direccion:
      'Carr. Rioverde km 246, 78438 Soledad de Graciano Sánchez, S.L.P.',
    maps:
      'https://www.google.com/maps/search/?api=1&query=Salon+de+Eventos+Elegance+San+Luis+Potosi',
  },

  whatsapp: {
    // Incluye el código de México 52
    numero: '524442389214',
    mensaje:
      'Hola, confirmo mi asistencia a los XV años de Allison Itzel Torres Salazar. Mi nombre es: ',
  },

  musica: {
    archivo: asset('assets/audio/cancion.mp3'),
  },

  imagenes: {
    presentacion: asset('assets/images/night-garden.webp'),
    final: asset('assets/images/night-garden.webp'),
  },

  dressCode: {
    titulo: 'Formal / Elegante',
    detalle: 'Pendiente por confirmar',
    reservarVerde: false,
  },

  regalos: {
    activo: false,
    opciones: [],
  },

  itinerario: [
    {
      hora: '17:00',
      titulo: 'Ceremonia',
    },
    {
      hora: '18:30',
      titulo: 'Sesión de fotos / traslado',
    },
    {
      hora: '19:00',
      titulo: 'Recepción',
    },
    {
      hora: '20:00',
      titulo: 'Entrada de la quinceañera',
    },
    {
      hora: '20:15',
      titulo: 'Vals',
    },
    {
      hora: '20:30',
      titulo: 'Cena',
    },
    {
      hora: '22:00',
      titulo: 'Fiesta',
    },
  ],

  galeria: [
    {
      src: asset('assets/gallery/foto01.webp'),
      alt: 'Fotografía 01 de Allison',
      width: 700,
      height: 909,
      placeholder: true,
    },
    {
      src: asset('assets/gallery/foto02.webp'),
      alt: 'Fotografía 02 de Allison',
      width: 700,
      height: 909,
      placeholder: true,
    },
    {
      src: asset('assets/gallery/foto03.webp'),
      alt: 'Fotografía 03 de Allison',
      width: 700,
      height: 909,
      placeholder: true,
    },
    {
      src: asset('assets/gallery/foto04.webp'),
      alt: 'Fotografía 04 de Allison',
      width: 1200,
      height: 760,
      placeholder: true,
    },
    {
      src: asset('assets/gallery/foto05.webp'),
      alt: 'Fotografía 05 de Allison',
      width: 900,
      height: 909,
      placeholder: true,
    },
    {
      src: asset('assets/gallery/foto06.webp'),
      alt: 'Fotografía 06 de Allison',
      width: 1200,
      height: 700,
      placeholder: true,
    },
  ],
};

export const PENDIENTE = '[PENDIENTE]';
