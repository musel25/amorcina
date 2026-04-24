
// La librería de voz — escrita con la voz de Müsel para Val.
// Cada contexto tiene un grupo; el motor elige uno que ella no haya visto recientemente.

export const MESSAGES = {
  coding: [
    "eres mejor que este bug 😤",
    "el punto y coma probablemente está en la línea 42. siempre lo está.",
    "quien escribió este código era un idiota. espera. 🫠",
    "bebe un sorbo de agua antes del próximo commit",
    "hazte un 'git blame' con cariño",
    "depuras como nadie, amor",
    "stack overflow es básicamente un abrazo grupal",
    "el patito de goma dice hola. y que tú puedes con esto.",
    "console.log('te amo') — Müsel",
    "el error es una pista, no un insulto",
  ],
  social: [
    "cuidado, distorsión temporal detectada ⏳",
    "tienes permiso para cerrar la app, por cierto",
    "diez minutos más y volvemos a la realidad ✌️",
    "energía de personaje principal detectada 🎬",
    "el algoritmo no te conoce como yo",
    "haz scroll con suavidad, amor",
    "¿guardamos algo y soltamos el teléfono?",
    "ese reel no se va a ir a ninguna parte",
  ],
  video: [
    "orgulloso de que estés descansando",
    "este es un buen uso para un domingo",
    "disfrútalo, te lo has ganado",
    "el descanso es productivo, en serio",
    "espero que lo que sea que estés viendo sea una tontería",
    "modo sofá activado. con respeto.",
  ],
  email: [
    "el 'inbox zero' es un mito, pero lo estás haciendo genial",
    "responde a ese correo que has estado evitando 👀",
    "respira. es solo una reunión.",
    "cierra 3 pestañas. te sentirás mejor.",
    "escribes los mejores correos de todo el hilo",
    "archiva sin miedo, amor",
  ],
  docs: [
    "tu cerebro es genuinamente impresionante",
    "se supone que el borrador sea tosco",
    "una frase a la vez",
    "las comas son una sugerencia. las ideas son tuyas.",
    "leería cualquier cosa que escribieras",
    "primero escribe mal. luego lo arreglas.",
  ],
  shopping: [
    "compra el bueno. te lo has ganado.",
    "vale para darte un capricho, firmado: M 💛",
    "añádelo al carrito. consúltalo con la almohada. ¿aún lo quieres? cómpralo.",
    "si cuesta menos de $20 y te hace sonreír, sí.",
  ],
  learning: [
    "orgulloso de que estés aprendiendo esto",
    "lento es fluido, fluido es rápido",
    "la curiosidad te queda tan bien",
    "cada lección cuenta, incluso las que confunden",
  ],
  late: [
    "oye. duerme. por fi. 💤",
    "internet seguirá aquí mañana",
    "cierra la laptop, te amo",
    "¿una cosa más y a la cama? ¿trato?",
    "le prometiste a tu 'yo del pasado' que dormirías más temprano",
  ],
  ambient: [
    "hola. solo pasaba a ver cómo estás 💛",
    "tú puedes con esto",
    "bebe agua, por favor",
    "estoy orgulloso de ti",
    "revisa tu postura, hermosa",
    "recuerda comer algo real hoy",
    "hola desde una tarde de martes",
    "pensando en ti, como siempre",
  ],
  // easter eggs — específicos de sitios
  youtube: [
    "disfruta de la madriguera de conejo 🐇",
    "guarda la receta. ¿la haces para nosotros luego?",
  ],
  instagram: [
    "eres más linda que cualquier post de aquí",
    "no compares. tú eres el modelo original.",
  ],
  github: [
    "¿conflicto de merge? estoy de tu lado.",
    "el PR de tus sueños está a la vuelta de la esquina",
  ],
};

// Momentos "especiales" poco comunes — un poco más largos
export const RARE_MESSAGES = [
  "hola val. es martes, estoy en algún lugar haciendo algo y te prometo que estoy pensando en ti. espero que el día esté siendo amable contigo. — M 💛",
  "pauso internet un segundo para recordarte que eres, objetivamente, mi persona favorita. puedes volver a tu scroll habitual. 💌",
  "si estás teniendo un día difícil — lo veo. no tienes que estar bien ahora mismo. te amo de cualquier forma.",
  "recordatorio de que la forma en que te ríes de tus propios chistes es lo mejor de internet, y eso que llevo mucho tiempo en internet.",
];
