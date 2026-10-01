import urllib.request
import csv
import io
import re
import json

# Blacklist of unwanted/vulgar/inappropriate or meta words for a memory trainer
BLACKLIST = {
    'pornografía', 'porno', 'puta', 'puto', 'mierda', 'coño', 'joder', 'polla', 
    'follar', 'cabrón', 'maricón', 'tetas', 'culo', 'sexo', 'sexual', 'genital',
    'subtítulo', 'subtítulos', 'rip', 'dvd', 'vhs', 'bluray', 'traducción',
    'sincronización', 'fps', 'audio', 'video'
}

def is_concrete(word, pos):
    # Common concrete endings or categories
    # Mostly nouns that can be touched, seen or imagined as physical objects/beings
    abstract_endings = (
        'dad', 'ción', 'sión', 'ismo', 'eza', 'ura', 'cia', 'ncia', 'miento', 
        'anza', 'tud', 'or', 'ez', 'idad'
    )
    if pos == 'adj':
        return False
    for ending in abstract_endings:
        if word.endswith(ending) and word not in ('zapato', 'mesa', 'cabeza', 'pala', 'casa'):
            return False
    return True

def build_b2_vocabulary():
    print("Downloading official Spanish lemma frequency dataset...")
    url = 'https://raw.githubusercontent.com/doozan/spanish_data/master/frequency.csv'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=20)
    content = resp.read().decode('utf-8')

    reader = csv.reader(io.StringIO(content))
    next(reader) # skip header

    valid_word_re = re.compile(r'^[a-záéíóúüñ]{3,}$')

    concretos = []
    abstractos = []
    adjetivos = []
    seen = set()

    # Load existing abstract anchors so we preserve them
    existing_anchors = {}
    try:
        with open('src/data/curated_vocabulary.json', 'r', encoding='utf-8') as f:
            old_data = json.load(f)
            existing_anchors = old_data.get('abstract_anchors', {})
            # also seed with original base words
            for w in old_data.get('vocabulary', {}).get('concretos', []):
                w = w.lower().strip()
                if valid_word_re.match(w) and w not in BLACKLIST:
                    seen.add(w)
                    concretos.append(w)
            for w in old_data.get('vocabulary', {}).get('abstractos', []):
                w = w.lower().strip()
                if valid_word_re.match(w) and w not in BLACKLIST:
                    seen.add(w)
                    abstractos.append(w)
            for w in old_data.get('vocabulary', {}).get('adjetivos', []):
                w = w.lower().strip()
                if valid_word_re.match(w) and w not in BLACKLIST:
                    seen.add(w)
                    adjetivos.append(w)
    except Exception as e:
        print("Note: Starting fresh for anchors if needed", e)

    # Process frequent Spanish lemmas
    for row in reader:
        if len(row) < 3:
            continue
        word = row[1].strip().lower()
        pos = row[2].strip()

        if word in seen or word in BLACKLIST:
            continue
        if not valid_word_re.match(word):
            continue

        if pos == 'adj':
            if len(adjetivos) < 800:
                seen.add(word)
                adjetivos.append(word)
        elif pos == 'n':
            seen.add(word)
            if is_concrete(word, pos):
                concretos.append(word)
            else:
                abstractos.append(word)

        # Stop when we have comfortably exceeded 5,000 words total
        if len(seen) >= 5500:
            break

    total = len(concretos) + len(abstractos) + len(adjetivos)
    print(f"Extracted {total} high-frequency B2 Spanish words:")
    print(f" - Concretos (objetos, seres, lugares, alimentos): {len(concretos)}")
    print(f" - Abstractos (conceptos, emociones, tiempo, acciones): {len(abstractos)}")
    print(f" - Adjetivos (cualidades, colores, formas): {len(adjetivos)}")

    output_data = {
        "vocabulary": {
            "concretos": sorted(list(set(concretos))),
            "abstractos": sorted(list(set(abstractos))),
            "adjetivos": sorted(list(set(adjetivos)))
        },
        "abstract_anchors": existing_anchors
    }

    with open('src/data/curated_vocabulary.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print("Successfully written to src/data/curated_vocabulary.json!")

if __name__ == '__main__':
    build_b2_vocabulary()
