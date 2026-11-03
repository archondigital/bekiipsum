import type { Dictionary } from "@lib/generator";

/**
 * Used only when the CMS can't be reached or has no bekiipsum content yet.
 * The live values come from Payload (site "bekiipsum"): Dictionaries, Pages "home" + "privacy".
 * Mirrors archon-payload scripts/bekiipsum-words.ts.
 * `words` is safe for work; `nsfwWords` joins it only when the visitor ticks "Allow NSFW".
 */
export const fallbackDictionaries: Dictionary[] = [
  {
    slug: "bekinese",
    name: "Bekinese",
    description: "Ang orihinal na Swardspeak vocabulary — isinalin at inilapat ni @smoileh.",
    opening: "Lorem ipsum keme keme",
    words: ["keme", "48 years", "antibiotic", "balaj", "valaj", "bella", "bigalou", "biway", "guash", "bongga", "bonggakea", "borta", "boyband", "buya", "chaka", "chuckie", "shonget", "ma-kyonget", "chapter", "jupang-pang", "cheapangga", "chipipay", "keme keme", "kemerloo", "conalei", "daki", "dites", "doonek", "effem", "emena gushung", "fayatollah kumenis", "ganda lang", "ganders", "intonses", "jowa", "jowabelles", "jowabella", "jutay", "juts", "kabog", "katagalugan", "katol", "kirara", "klapeypey-klapeypey", "krang-krang", "krung-krung", "lulu", "tungril", "mahogany", "mashumers", "ugmas", "mabaho", "majubis", "matod", "nakakalurky", "neuro", "oblation", "otoko", "pamin", "paminta", "pamentos", "pamenthol", "pinkalou", "pranella", "quality control", "sangkatuts", "shala", "shogal", "shokot", "bokot", "shonga", "shongaers", "planggana", "shonga-shonga", "makyonget", "shontis", "sudems", "tamalis", "urky", "warla", "wasok", "wiz", "waz", "wrangler", "thunder", "tanders", "majonders", "Cholo", "Gino", "Pocholo", "Gab", "Cloyd", "Junatan", "charot", "char", "chos", "echosera", "eme", "emerut", "chenes", "chenelyn", "churva", "churvaness", "chuva", "chuvaness", "chever", "keri", "keri lang", "keribels", "kaloka", "kalurkey", "nakakaloka", "lafang", "lafangan", "chika", "chikahan", "chikadora", "anech", "anetch", "sinetch", "ditey", "gora", "gorabels", "ganern", "pak ganern", "bet", "betchay", "waley", "kebs", "witchels", "mudra", "pudra", "mujer", "beki", "bekimon", "bading", "dyosa", "imbyerna", "talbog", "juskolord", "bonggacious", "bongga ka day", "gandara", "jowable", "fafa", "papables", "eklavu", "eksena", "tralala", "Chaka Khan", "Tom Jones", "Haggardo Versoza", "Givenchy", "Julanis Morissette", "Anaconda", "Sharon Cuneta", "Gelli de Belen", "Rica Peralejo", "Purita Kalaw"],
    nsfwWords: ["chopopo", "tetetet", "jongoloids"],
    connectors: ["at", "ng", "nang", "kasi", "bakit", "ano", "ang", "na", "na ang", "at ang", "at nang", "at bakit", "sa"],
    connectorRatio: 0.35,
    isDefault: true,
  },
];
