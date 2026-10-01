import json

# Comprehensive C1 Spanish Vocabulary for High-Performance Mnemonic Training
c1_concretos = [
    # Elementos originales base
    "tiburón", "bicicleta", "microondas", "trompeta", "sandía", "submarino", "plátano", "cohete", 
    "guitarra", "elefante", "paraguas", "volcán", "ovni", "hamburguesa", "espada", "helado", 
    "canguro", "reloj", "castillo", "extintor", "zapatilla", "telescopio", "piña", "camaleón", 
    "diamante", "robot", "fantasma", "monopatín", "cactus", "fuego", "espejo", "pulpo", 
    "bombilla", "batería", "pizza", "tractor", "hacha", "momia", "girasol", "maleta", 
    "avión", "corona", "cisne", "taza", "helicóptero", "murciélago", "tarta", "cámara", 
    "ancla", "globo", "león", "serpiente", "dinosaurio", "teléfono", "computadora", "martillo", 
    "zapato", "sombrero", "botella", "mochila", "llave", "candado", "moneda", "puente", 
    "faro", "nube", "árbol", "montaña", "río", "coche", "barco", "tren", "lápiz", 
    "bolígrafo", "cuaderno", "libro",
    # Instrumentos históricos, náuticos y científicos (C1)
    "astrolabio", "catalejo", "clepsidra", "péndulo", "galeón", "daguerrotipo", "escafandra", 
    "gramófono", "sextante", "periscopio", "brújula", "barómetro", "microscopio", "sismógrafo", 
    "crisol", "alambique", "ánfora", "fuelle", "yunque", "bisturí", "batuta", "diapasón", 
    "teodolito", "diario", "partitura", "pergamino", "papiro", "sello", "monóculo", "relicario",
    # Arquitectura, vestigios y estructuras monumentales
    "obelisco", "góndola", "gárgola", "sarcófago", "cúpula", "claustro", "menhir", "dolmen", 
    "laberinto", "acantilado", "alminar", "almena", "baluarte", "catacumba", "cenotafio", 
    "acueducto", "viaducto", "fortaleza", "alcázar", "torreón", "cripta", "mausoleo", 
    "bastión", "arbotante", "rosetón", "zigurat", "anfiteatro", "coliseo", "muralla", 
    "atalaya", "foso", "puente levadizo", "bastón", "tiara", "cetro", "trono",
    # Geología, cosmos y fenómenos naturales
    "estalactita", "estalagmita", "géiser", "cenote", "fiordo", "arrecife", "manglar", 
    "iceberg", "glaciar", "cráter", "duna", "abismo", "cañón", "fósil", "meteorito", 
    "cometa", "asteroide", "nebulosa", "constelación", "magma", "aurora", "eclipse", 
    "relámpago", "torbellino", "tifón", "tsunami", "cascada", "selva", "pantano", "oasis",
    # Fauna y flora especializada y exótica
    "crisálida", "colibrí", "libélula", "escarabajo", "mantarraya", "escorpión", "salamandra", 
    "nautilo", "medusa", "halcón", "búho", "leopardo", "pantera", "chimpancé", "gorila", 
    "rinoceronte", "cocodrilo", "camello", "avestruz", "flamenco", "pelícano", "tucán", 
    "secuoya", "baobab", "loto", "orquídea", "mandrágora", "hiedra", "helecho", "musgo", 
    "bambú", "bonsái", "carnívora", "alga", "coral", "hongo", "trufa",
    # Objetos de arte, música, tecnología y armería
    "violonchelo", "arpa", "laúd", "clavicémbalo", "oboe", "fagot", "platillos", "marimba", 
    "timbal", "órgano", "caballera", "armadura", "escudo", "alabarda", "ballesta", "arco", 
    "cimitarra", "florete", "daga", "catana", "turbina", "reactor", "satélite", "dron", 
    "microchip", "antena", "generador", "sintetizador", "acelerador", "cápsula", "propulsor",
    # Indumentaria, accesorios y objetos cotidianos enriquecidos
    "esmoquin", "frac", "capa", "antifaz", "kimono", "turbante", "corsé", "armiño", 
    "joyero", "rubí", "zafiro", "esmeralda", "ópalo", "amatista", "lingote", "cáliz", 
    "candelabro", "farol", "linterna", "antorcha", "mechero", "pipa", "catálogo", "diccionario", 
    "enciclopedia", "mapamundi", "globo terráqueo", "balanza", "termómetro", "veleta",
    # Utensilios, recipientes y oficios
    "mortero", "embudo", "soplete", "tornos", "cincel", "gubia", "lija", "serrucho", 
    "tenazas", "alicates", "tuerca", "tornillo", "resorte", "polea", "engranaje", "válvula", 
    "caldero", "barril", "tonel", "botijo", "cántaro", "tarro", "frasco", "matraz", 
    "pipeta", "probeta", "bisturí", "termos", "brida", "herradura", "arado", "molino"
]

c1_abstractos = [
    # Filosofía, psicología y mente humana (C1)
    "tiempo", "libertad", "justicia", "peligro", "miedo", "amor", "odio", "esperanza", 
    "éxito", "fracaso", "secreto", "misterio", "fuerza", "poder", "locura", "paz", 
    "guerra", "memoria", "olvido", "sueño", "pesadilla", "duda", "verdad", "mentira", 
    "envidia", "orgullo", "dolor", "alegría", "tristeza", "soledad", "amistad", "traición", 
    "destino", "suerte", "magia", "silencio", "ruido", "energía", "caos", "orden", 
    "velocidad", "gravedad", "riqueza", "pobreza", "hambre", "sed", "salud", "enfermedad", 
    "muerte", "vida", "juventud", "vejez", "sabiduría", "inocencia", "culpa", "perdón", 
    "venganza", "paciencia", "ansiedad", "valor",
    # Conceptos C1 de alta precisión léxica
    "resiliencia", "paradoja", "serendipia", "hegemonía", "vicisitud", "altruismo", "melancolía", 
    "catarsis", "dogmatismo", "ambivalencia", "ecuanimidad", "disonancia", "letargia", "perplejidad", 
    "sosiego", "indolencia", "soberbia", "templanza", "abnegación", "elocuencia", "perspicacia", 
    "lucidez", "decadencia", "posteridad", "vorágine", "sublimidad", "impunidad", "obsolescencia", 
    "nostalgia", "anonimato", "efervescencia", "transitoriedad", "redención", "magnificencia", 
    "vehemencia", "certidumbre", "incertidumbre", "utopía", "distopía", "entropía", "efímero", 
    "dogma", "metáfora", "paradigmas", "sinergia", "añoranza", "aflicción", "clemencia", 
    "desdén", "desidia", "dilema", "idiosincrasia", "inercia", "ironía", "longevidad", 
    "magnanimidad", "mutabilidad", "parsimonia", "pragmatismo", "prodigio", "reciedumbre", 
    "reminiscencia", "retórica", "sagacidad", "sobriedad", "tenacidad", "veleidad", "veneración", 
    "verosimilitud", "virulencia", "volatilidad", "vulnerabilidad", "zenit", "desasosiego", 
    "conmoción", "abstracción", "anhelo", "cordura", "desmesura", "devoción", "empirismo", 
    "equidad", "escepticismo", "euforia", "finitud", "gratitud", "hidalguía", "ilusión", 
    "impetu", "inefabilidad", "ingenio", "inquietud", "intrepidez", "perserverancia", 
    "plenitud", "providencia", "pundonor", "recelo", "resignación", "rigor", "santidad", 
    "severidad", "simbiosis", "sutileza", "tacto", "tribulación", "ubicuidad", "vacilación"
]

c1_adjetivos = [
    # Calificativos de alta expresividad mnemotécnica
    "gigante", "diminuto", "congelado", "ardiente", "oxidado", "brillante", "eléctrico", 
    "invisible", "pegajoso", "elástico", "pesado", "volador", "furioso", "dormido", 
    "explosivo", "luminoso", "transparente", "venenoso", "dorado", "metálico", "suave", 
    "áspero", "ruidoso", "silencioso", "mojado", "seco", "podrido", "salvaje", "veloz", 
    "ligero", "afilado", "blando", "duro", "espeluznante", "mágico", "flotante", 
    "fosforescente", "húmedo", "radioactivo", "peludo", "resbaladizo", "blindado", 
    "hinchado", "aplastado", "envenenado", "hirviente", "desenfrenado", "helado", "mutante",
    # Adjetivos C1
    "efímero", "taciturno", "incandescente", "vertiginoso", "polifacético", "minucioso", 
    "inexorable", "fulgurante", "quimérico", "tenebroso", "inmarcesible", "deleznable", 
    "imperturbable", "febril", "diáfano", "lúgubre", "onírico", "gélido", "ancestral", 
    "frenético", "esplendoroso", "imponente", "vórtice", "colosal", "inaudito", "indómito", 
    "sublime", "etéreo", "abrumador", "enigmático", "visceral", "titánico", "insondable", 
    "intempestivo", "sempiterno", "protervo", "impetuoso", "lóbrego", "crepuscular", 
    "sibilino", "plácido", "incombustible", "magnánimo", "perentorio", "fúlgido"
]

# Comprehensive visual anchors for abstract words (essential for absurd associations)
abstract_anchors = {
    "tiempo": "un reloj de arena gigante que gotea lava",
    "libertad": "una estatua de la libertad rompiendo cadenas láser",
    "justicia": "una balanza dorada que aplasta un mazo de juez",
    "peligro": "una calavera fluorescente con cables chispeantes",
    "miedo": "un monstruo tembloroso tapándose los ojos con una sábana",
    "amor": "un corazón con alas de murciélago disparando flechas",
    "odio": "un puño envuelto en llamas negras",
    "esperanza": "una pequeña vela verde que no se apaga bajo el agua",
    "éxito": "una copa de trofeo gigante lanzando confeti explosivo",
    "secreto": "un cofre blindado con diez candados y una boca cosida",
    "misterio": "una lupa mágica que revela huellas que brillan en la oscuridad",
    "fuerza": "un brazo de hierro levantando un camión entero",
    "poder": "una corona de rayos eléctricos que hace levitar al que la lleva",
    "locura": "un gorro con hélices que giran echando chispas de colores",
    "paz": "una paloma blanca gigante con casco de astronauta",
    "guerra": "dos tanques chocando en el aire como carneros",
    "memoria": "un cerebro con cajones transparentes que se abren",
    "sueño": "una nube esponjosa con una almohada que ronca",
    "pesadilla": "un reloj despertador con dientes de cocodrilo",
    "duda": "un signo de interrogación gigante bailando claqué",
    "verdad": "un espejo luminoso que refleja esqueletos bailando",
    "mentira": "una nariz de Pinocho que crece como un árbol hasta romper el techo",
    "magia": "una chistera de mago de la que sale un dragón diminuto",
    "silencio": "un candado gigante cerrando los labios de una pared",
    "ruido": "un megáfono que echa llamaradas con cada grito",
    "caos": "un tornado de platos voladores chocando entre sí",
    "velocidad": "unas zapatillas con cohetes que dejan una línea de fuego",
    "suerte": "un trébol de cuatro hojas metálico que gira como una ruleta",
    "resiliencia": "un muelle de titanio que rebota tras ser aplastado por un yunque",
    "paradoja": "dos espejos enfrentados que muestran a la persona al revés",
    "serendipia": "un pirata que tropieza con una piedra y resulta ser un diamante",
    "hegemonía": "un trono dorado que absorbe como imán las coronas vecinas",
    "vicisitud": "una montaña rusa con bucles que pasa de la nieve al fuego",
    "altruismo": "una mano luminosa que se arranca un pedazo de pan para darlo",
    "melancolía": "un violín empapado que llora notas musicales de lluvia",
    "catarsis": "una presa de agua que estalla liberando un río de arcoíris",
    "dogmatismo": "un libro de piedra maciza encadenado con cinco candados",
    "ambivalencia": "una máscara con media cara riendo y media cara llorando",
    "ecuanimidad": "un monje flotando inmóvil en medio de un huracán",
    "disonancia": "dos campanas de iglesia sonando con chirrido desafinado",
    "letargia": "un caracol gigante durmiendo con un gorro de lana",
    "perplejidad": "una cabeza a la que le sale humo y signos de interrogación",
    "sosiego": "un lago cristalino que refleja un cielo sin una sola nube",
    "soberbia": "un pavo real gigante con corona que mira por encima del hombro",
    "templanza": "un vaso de agua helada calmando una antorcha ardiente",
    "lucidez": "una bombilla de mil vatios encendiéndose dentro de un cráneo de cristal",
    "decadencia": "un palacio de mármol cubierto de enredaderas y columnas caídas",
    "entropía": "un jarrón chino rompiéndose en mil pedazos flotantes",
    "utopía": "una ciudad flotante de cristal donde vuelan bicicletas con alas",
    "distopía": "un ojo mecánico gigante vigilando calles bajo lluvia ácida",
    "nostalgia": "un tocadiscos antiguo del que brota vapor con recuerdos",
    "efervescencia": "un matraz con poción burbujeante que desborda espuma fosforescente",
    "redención": "un cuervo negro cuyas plumas se vuelven de oro brillante",
    "vehemencia": "un volcán que escupe palabras ardientes como proyectiles",
    "incertidumbre": "un cruce de diez caminos cubierto de densa niebla",
    "aflicción": "un corazón de plomo que hunde el suelo a su paso",
    "desasosiego": "una mariposa con alas de cuchilla revoloteando en el estómago",
    "cordura": "un compás dorado trazando círculos perfectos en la arena",
    "rigor": "una regla milimétrica de acero quirúrgico afilada como un sable"
}

# Clean and dedup
clean_concretos = sorted(list(set(c1_concretos)))
clean_abstractos = sorted(list(set(c1_abstractos)))
clean_adjetivos = sorted(list(set(c1_adjetivos)))

vocab_data = {
    "vocabulary": {
        "concretos": clean_concretos,
        "abstractos": clean_abstractos,
        "adjetivos": clean_adjetivos
    },
    "abstract_anchors": abstract_anchors
}

output_path = "src/data/curated_vocabulary.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(vocab_data, f, ensure_ascii=False, indent=2)

print(f"Curated vocabulary updated successfully!")
print(f"Concretos: {len(clean_concretos)}")
print(f"Abstractos: {len(clean_abstractos)}")
print(f"Adjetivos: {len(clean_adjetivos)}")
print(f"Total vocabulary words: {len(clean_concretos) + len(clean_abstractos) + len(clean_adjetivos)}")
print(f"Total abstract anchors: {len(abstract_anchors)}")
