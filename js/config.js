export const EVENT_CONFIG = {
  quinceanera: {
    nombre: 'Allison',
    nombreCompleto: 'Allison Itzel Torres Salazar',
  },
  evento: {
    fecha: '',
    hora: '',
    fechaConfirmacion: '',
    zonaHoraria: 'America/Mexico_City',
  },
  padres: { mama: '', papa: '' },
  padrinos: { activo: false, nombres: [] },
  ceremonia: { nombre: '', hora: '', direccion: '', maps: '' },
  recepcion: { nombre: '', hora: '', direccion: '', maps: '' },
  whatsapp: {
    numero: '',
    mensaje: 'Hola, confirmo mi asistencia a los XV años de Allison Itzel Torres Salazar. Mi nombre es: ',
  },
  musica: { archivo: '/assets/audio/cancion.mp3' },
  dressCode: { titulo: 'Formal / Elegante', detalle: 'Pendiente por confirmar', reservarVerde: false },
  regalos: { activo: false, opciones: [] },
  itinerario: [
    { hora: '17:00', titulo: 'Ceremonia' },
    { hora: '18:30', titulo: 'Sesión de fotos / traslado' },
    { hora: '19:00', titulo: 'Recepción' },
    { hora: '20:00', titulo: 'Entrada de la quinceañera' },
    { hora: '20:15', titulo: 'Vals' },
    { hora: '20:30', titulo: 'Cena' },
    { hora: '22:00', titulo: 'Fiesta' },
  ],
  galeria: [
    { src: '/assets/gallery/foto01.webp', alt: 'Espacio para la fotografía 01 de Allison', width: 700, height: 909, placeholder: true },
    { src: '/assets/gallery/foto02.webp', alt: 'Espacio para la fotografía 02 de Allison', width: 700, height: 909, placeholder: true },
    { src: '/assets/gallery/foto03.webp', alt: 'Espacio para la fotografía 03 de Allison', width: 700, height: 909, placeholder: true },
    { src: '/assets/gallery/foto04.webp', alt: 'Espacio para la fotografía 04 de Allison', width: 1200, height: 760, placeholder: true },
    { src: '/assets/gallery/foto05.webp', alt: 'Espacio para la fotografía 05 de Allison', width: 900, height: 909, placeholder: true },
    { src: '/assets/gallery/foto06.webp', alt: 'Espacio para la fotografía 06 de Allison', width: 1200, height: 700, placeholder: true },
  ],
};

export const PENDIENTE = '[PENDIENTE]';
