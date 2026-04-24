
// La librería de voz — escrita con la voz de Müsel para Val.
// Cada contexto tiene un grupo; el motor elige uno que ella no haya visto recientemente.
export const MESSAGES = {
  coding: [
    "usted es mejor que ese bug 😤",
    "el punto y coma probablemente está en la línea 42. siempre lo está.",
    "beba un sorbo de agua antes del próximo commit",
    "usted es la mejor programadorsinga, amor",
    "console.log('la amo') — Müsel",
  ],
  social: [
    "mi amor es adicta a redes ",
    "usted tiene permiso para cerrar la app, por cierto",
    "diez minutos más y volvemos a la realidad ✌️",
    "energía de personaje principal detectada 🎬",
    "el algoritmo no la conoce como yo",
    "haga scroll con suavidad, amor",
    "ese reel no se va a ir a ninguna parte",
  ],
  video: [
    "orgulloso de que usted esté descansando",
    "este es un buen uso para un momento de ocio",
    "disfrútelo, se lo ha ganado",
    "el descanso es productivo <3",
  ],
  email: [
    "responda a ese correo que ha estado evitando 👀",
    "respire. es solo una reunión.",
    "cierre 3 pestañas. se sentirá mejor.",
    "usted escribe los mejores correos del mundo",
  ],
  docs: [
    "estoy orgulloso de usted",
    "una frase a la vez",
    "las comas son una sugerencia",
    "leería cualquier cosa que usted escribiera",
    "primero escriba mal. luego lo arregla.",
  ],
  shopping: [
    "vale para darse un capricho, firmado: M 💛",
    "añádalo al carrito",
    "si cuesta menos de $20 y la hace sonreír, sí.",
  ],
  learning: [
    "orgulloso de que usted esté aprendiendo esto",
    "la curiosidad le queda tan bien",
    "ahor me la imagino como el perrito con lentes jajaj",
  ],
  late: [
    "oiga. duerma. por fi. 💤",
    "cierre la laptop, la amo",
  ],
  ambient: [
    "hola. solo pasaba a ver cómo está usted 💛",
    "usted puede con esto",
    "beba agua, por favor mi preciosa",
    "estoy orgulloso de usted",
    "revise su postura, hermosa",
    "recuerde comer algo real hoy mi amor",
    "pensando en usted, como siempre",
  ],
  planning: [
    "tiene todo bajo control, aunque no lo parezca",
    "un evento a la vez, amor",
    "orgulloso de lo organizada que es usted",
    "ese bloque del calendario lo puede mover si necesita",
  ],
  music: [
    "buena elección 🎵",
    "¿qué está escuchando? apuesto que es bueno",
    "la música le queda tan bien",
    "ponga algo que la haga moverse aunque sea un poco",
  ],
  work: [
    "usted puede con esta reunión",
    "respire antes de entrar",
    "usted es la persona más capaz de la llamada, sepa eso",
    "ya casi termina esto, le prometo",
  ],
  search: [
    "buscando cosas interesantes como siempre",
    "curiosa y hermosa, combinación perfecta",
    "espero que encuentre lo que busca mi amor",
  ],
  // easter eggs — específicos de sitios
  youtube: [
    "disfrute de la madriguera de conejo 🐇",
    "seguramente está viendo alguna reseña de cine mi amor",
  ],
  instagram: [
    "usted es más linda que cualquier post de aquí",
    "usted es la mejor influencer que existe",
  ],
  github: [
    "AI a tope",
    "puro claude code",
  ],
};

// Momentos "especiales" poco comunes — un poco más largos
export const RARE_MESSAGES = [
  "hola val. no sé que día es hoy para usted pero estoy en algún lugar haciendo algo y le prometo que estoy pensando en usted.  — M 💛",
  "pauso internet un segundo para recordarle que usted es, objetivamente, mi persona favorita. 💌",
  "si usted está teniendo un día difícil sabe que puede contar conmigo,  la amo demasiado.",
  "recordatorio de que la forma en que usted se ríe de sus propios chistes es lo mejor, oye eso es un insulto para mi xd",
];
