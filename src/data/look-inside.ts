// Sample content shown on /look-inside/ and in the homepage "Look inside" section: one grammar
// lesson, one Daily Immersion, one live session and a peek at the community.
// Everything marked TODO is waiting for the owner's real content. An empty value shows a dashed
// "TODO" box on the page instead of the missing piece, so nothing breaks while it's being filled.

export interface AnkiCard {
  /** Question side, in French */
  front: string;
  /** Part of `front` shown in bold accent (the grammar point), as on the real card */
  highlight?: string;
  /** Answer side, in English */
  back: string;
  /** Grammar note under the translation */
  note?: string;
  /** The card's audio, under public/ (e.g. "/audio/look-inside/passe-compose-1.mp3") */
  audio?: string;
}

export interface Picture {
  /** Path under public/, e.g. "/images/look-inside/passe-compose-pdf-1.webp" */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Short label shown under the picture */
  caption?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index of the right option in `options` */
  answer: number;
  /** Shown once the question is answered */
  explanation?: string;
}

/** How much there is in the membership, quoted as "over N" on the homepage and /look-inside/ */
export const membershipCounts = {
  grammarLessons: 50,
  immersionTexts: 120,
  livesPerWeek: 3,
};

export const grammarLesson = {
  title: 'The passé composé',
  level: 'A2',
  /** Lesson number in the A2 course */
  lesson: 7,
  summary:
    'How to talk about what happened: avoir or être, the past participle, and the agreements that trip everyone up.',
  /** The lesson's two videos: the course itself, then its immersion (the same grammar in real French) */
  videos: [
    { label: 'The course', youtubeId: 'd3lcG1tq_fU', title: 'Course 7 – Le passé composé' },
    { label: 'The immersion', youtubeId: 'F1VPugLkT6Q', title: 'Immersion 7 – Le passé composé' },
  ],
  /** Excerpts of the lesson PDFs (key takeaways + vocabulary), cropped from A2 lesson 7 */
  pdfExcerpts: [
    {
      src: '/images/look-inside/passe-compose-key-takeaways.webp',
      caption: 'Key takeaways',
      alt: 'Key takeaways PDF of the passé composé lesson: avoir or être + past participle, with example sentences and their translations',
      width: 993,
      height: 653,
    },
    {
      src: '/images/look-inside/passe-compose-vocabulary.webp',
      caption: 'Vocabulary',
      alt: 'Vocabulary PDF of the passé composé lesson: words such as hier, les devoirs and rester, each with its type, definition and an example',
      width: 993,
      height: 857,
    },
  ] as Picture[],
  /** Number of cards in the full deck (a2_lecon_07_passe_compose.apkg) */
  deckSize: 10,
  /** 4 cards from that deck, with their audio */
  ankiCards: [
    {
      front: "Hier, j'ai mangé une pizza avec mes amis.",
      highlight: "j'ai mangé",
      back: 'Yesterday I ate a pizza with my friends.',
      note: 'avoir + mangé (-er → -é)',
      audio: '/audio/look-inside/passe-compose-1.mp3',
    },
    {
      front: 'Nous sommes allés au cinéma hier soir.',
      highlight: 'sommes allés',
      back: 'We went to the cinema last night.',
      note: 'être + allés (agrees: plural)',
      audio: '/audio/look-inside/passe-compose-2.mp3',
    },
    {
      front: 'Il a pris le train de huit heures.',
      highlight: 'a pris',
      back: "He took the eight o'clock train.",
      note: 'avoir + pris (irregular)',
      audio: '/audio/look-inside/passe-compose-3.mp3',
    },
    {
      front: "Je n'ai pas compris la question.",
      highlight: "n'ai pas compris",
      back: "I didn't understand the question.",
      note: "negation: n' … pas around avoir",
      audio: '/audio/look-inside/passe-compose-4.mp3',
    },
  ] as AnkiCard[],
};

export const dailyImmersion = {
  title: 'Mon premier voyage en TGV',
  level: 'A2',
  /** Day number in the Daily Immersion series */
  day: 17,
  grammarTheme: 'the passé composé (with avoir and être)',
  /** The text read aloud */
  audio: '/audio/look-inside/daily-immersion-17.mp3',
  paragraphs: [
    "Le mois dernier, j'ai pris le TGV pour la première fois. Je suis parti de Paris pour aller voir mon frère à Marseille.",
    "J'ai acheté mon billet sur internet deux semaines avant le voyage. Le jour du départ, je suis arrivé à la gare de Lyon très tôt, parce que j'ai eu peur de rater le train. J'ai regardé le grand panneau des départs et j'ai trouvé mon quai.",
    "Je suis monté dans la voiture numéro douze et j'ai cherché ma place. Une vieille dame est venue s'asseoir à côté de moi. Nous avons discuté un peu, et elle a partagé son chocolat avec moi.",
    "Le train est parti à l'heure. Il est allé très vite : trois cents kilomètres à l'heure ! Par la fenêtre, j'ai vu des champs, des villages et des vaches. Après Lyon, j'ai acheté un café et un sandwich à la voiture-bar.",
    "Dans le train, j'ai lu un livre et j'ai écouté de la musique. Le temps a passé très vite. Nous sommes arrivés à Marseille après seulement trois heures et vingt minutes.",
    "Mon frère a attendu sur le quai. Nous sommes sortis de la gare ensemble et nous avons marché jusqu'au Vieux-Port. Ce voyage a été court, mais j'ai adoré le TGV !",
  ] as string[],
  /** The immersion's comprehension quiz, as published on Kajabi */
  quiz: [
    {
      question: 'Où est-ce que le narrateur est allé en TGV ?',
      options: ['À Lyon', 'À Paris', 'À Marseille', 'À Nice'],
      answer: 2,
      explanation: 'The text says: « Je suis parti de Paris pour aller voir mon frère à Marseille. »',
    },
    {
      question: "Pourquoi est-ce qu'il est arrivé très tôt à la gare ?",
      options: [
        "Parce qu'il a eu peur de rater le train",
        "Parce qu'il voulait acheter un café",
        "Parce que son frère l'attendait",
        'Parce que le train partait très tôt',
      ],
      answer: 0,
      explanation: "The text says: « je suis arrivé à la gare de Lyon très tôt, parce que j'ai eu peur de rater le train. »",
    },
    {
      question: "Qu'est-ce que la vieille dame a fait ?",
      options: ['Elle a lu un livre', 'Elle a partagé son chocolat avec lui', 'Elle a acheté un sandwich', 'Elle a raté le train'],
      answer: 1,
      explanation: 'The text says: « Nous avons discuté un peu, et elle a partagé son chocolat avec moi. »',
    },
    {
      question: 'Combien de temps est-ce que le voyage a duré ?',
      options: ['Deux heures', 'Quatre heures', 'Trois heures et vingt minutes', 'Cinq heures'],
      answer: 2,
      explanation: 'The text says: « Nous sommes arrivés à Marseille après seulement trois heures et vingt minutes. »',
    },
    {
      question: "Grammaire du jour — Complétez : Le train ___ parti à l'heure.",
      options: ['a', 'est', 'était', 'va'],
      answer: 1,
      explanation: '"Partir" is a verb of movement: it uses "être" in the passé composé (il est parti).',
    },
    {
      question: "Grammaire du jour — Complétez : J'___ acheté mon billet sur internet.",
      options: ['ai', 'suis', 'étais', 'avais'],
      answer: 0,
      explanation: `"Acheter" uses "avoir" in the passé composé: j'ai acheté.`,
    },
  ] as QuizQuestion[],
  /** Number of cards in its deck (DI-Jour17-A2-anki.apkg); the page only names its PDF and deck */
  deckSize: 18,
};

export const liveSession = {
  /** YouTube ID of a live session excerpt */
  youtubeId: 'vyzDJNDXemc',
  /** Follows "3 live sessions every week, up to B2:" */
  caption: 'we read together, chat, tell stories and discuss, in French, with other learners.',
};

export interface ChatMessage {
  /** "member" (shown anonymised) or "felix" */
  from: 'member' | 'felix';
  /** One string per line, in French */
  lines: string[];
  /** Heart reactions under the message */
  hearts?: number;
}

/**
 * A real exchange from the community's "Share your daily wins" channel (Oct 25, 2026), anonymised:
 * the member's name is removed; their French is left as written.
 */
export const communityChat = {
  channel: 'Share your daily wins',
  time: 'Oct 25, 9:21 AM',
  messages: [
    {
      from: 'member',
      lines: [
        "Bonjour a tous ! J'apprends la francais depuis tois ans. J'ai commence la Liminal French la semaine dernier. Aujourd'hui , j'ai terminal le \"A1/A2 -Course\" jour 4, et \"A1 - Daily Immersion.",
      ],
      hearts: 1,
    },
    { from: 'felix', lines: ['Bien joué (well done) !', "Un petit peu tous les jours c'est la clé"] },
  ] as ChatMessage[],
};
