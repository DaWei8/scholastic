export interface Scholarship {
    id: string;
    title: string;
    institution: string;
    country: string;
    region: "US" | "UK" | "China" | "EU";
    deadline: string;
    degree_level: string[];
    funding: string;
    description: string;
    url: string;
    fields: string[];
    is_fully_funded: boolean;
}

export const scholarships: Scholarship[] = [
    // ── United States ──────────────────────────────
    {
        id: "us-fulbright",
        title: "Fulbright Foreign Student Program",
        institution: "U.S. Department of State",
        country: "United States",
        region: "US",
        deadline: "October 2026",
        degree_level: ["Master's", "PhD"],
        funding: "Full Tuition + Living Stipend",
        description:
            "Covers tuition, airfare, a living stipend, and health insurance for international students pursuing graduate study at U.S. universities.",
        url: "https://foreign.fulbrightonline.org",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "us-nsf-grfp",
        title: "NSF Graduate Research Fellowship",
        institution: "National Science Foundation",
        country: "United States",
        region: "US",
        deadline: "October 2026",
        degree_level: ["PhD"],
        funding: "$37,000/year + $16,000 COE Allowance",
        description:
            "Three years of financial support for graduate students in STEM fields. One of the most prestigious early-career research fellowships in the U.S.",
        url: "https://www.nsfgrfp.org",
        fields: ["STEM", "Social Sciences"],
        is_fully_funded: true,
    },
    {
        id: "us-knight-hennessy",
        title: "Knight-Hennessy Scholars",
        institution: "Stanford University",
        country: "United States",
        region: "US",
        deadline: "October 2026",
        degree_level: ["Master's", "PhD", "Professional"],
        funding: "Full Funding for up to 3 years",
        description:
            "Fully funds graduate education at Stanford, including tuition, stipend, travel, and a leadership development program.",
        url: "https://knight-hennessy.stanford.edu",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "us-mit-presidential",
        title: "MIT Presidential Fellowship",
        institution: "Massachusetts Institute of Technology",
        country: "United States",
        region: "US",
        deadline: "December 2026",
        degree_level: ["PhD"],
        funding: "Full Tuition + Stipend",
        description:
            "Awarded to the most outstanding incoming doctoral students at MIT. Covers full tuition, fees, and a 12-month stipend.",
        url: "https://oge.mit.edu",
        fields: ["Engineering", "Science", "Computing"],
        is_fully_funded: true,
    },

    // ── United Kingdom ─────────────────────────────
    {
        id: "uk-chevening",
        title: "Chevening Scholarships",
        institution: "UK Government",
        country: "United Kingdom",
        region: "UK",
        deadline: "November 2026",
        degree_level: ["Master's"],
        funding: "Full Tuition + Living Costs + Flights",
        description:
            "The UK government's flagship scholarship for future leaders. Fully funds a one-year Master's degree at any UK university.",
        url: "https://www.chevening.org",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "uk-rhodes",
        title: "Rhodes Scholarship",
        institution: "University of Oxford",
        country: "United Kingdom",
        region: "UK",
        deadline: "July 2026",
        degree_level: ["Master's", "PhD"],
        funding: "Full Tuition + £18,180/year Stipend",
        description:
            "The world's oldest international scholarship, funding outstanding students for postgraduate study at Oxford.",
        url: "https://www.rhodeshouse.ox.ac.uk",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "uk-gates-cambridge",
        title: "Gates Cambridge Scholarship",
        institution: "University of Cambridge",
        country: "United Kingdom",
        region: "UK",
        deadline: "December 2026",
        degree_level: ["Master's", "PhD"],
        funding: "Full Cost of Study + Maintenance",
        description:
            "Funded by the Bill & Melinda Gates Foundation. Covers the full cost of studying at the University of Cambridge.",
        url: "https://www.gatescambridge.org",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "uk-commonwealth",
        title: "Commonwealth Scholarships",
        institution: "Commonwealth Scholarship Commission",
        country: "United Kingdom",
        region: "UK",
        deadline: "December 2026",
        degree_level: ["Master's", "PhD"],
        funding: "Full Tuition + Airfare + Stipend",
        description:
            "For students from Commonwealth countries to study at UK universities. Covers tuition, living expenses, and travel.",
        url: "https://cscuk.fcdo.gov.uk",
        fields: ["All Fields"],
        is_fully_funded: true,
    },

    // ── China ──────────────────────────────────────
    {
        id: "cn-csc",
        title: "Chinese Government Scholarship (CSC)",
        institution: "China Scholarship Council",
        country: "China",
        region: "China",
        deadline: "January–April 2027",
        degree_level: ["Bachelor's", "Master's", "PhD"],
        funding: "Full Tuition + Accommodation + Stipend",
        description:
            "The most comprehensive scholarship for international students in China. Covers tuition, accommodation, living allowance, and medical insurance.",
        url: "https://www.campuschina.org",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "cn-tsinghua",
        title: "Schwarzman Scholars",
        institution: "Tsinghua University",
        country: "China",
        region: "China",
        deadline: "September 2026",
        degree_level: ["Master's"],
        funding: "Full Tuition + Room & Board + Travel",
        description:
            "A one-year Master's in Global Affairs at Tsinghua University. Modeled after the Rhodes Scholarship but focused on China.",
        url: "https://www.schwarzmanscholars.org",
        fields: ["Global Affairs", "Economics", "Public Policy"],
        is_fully_funded: true,
    },
    {
        id: "cn-confucius",
        title: "Confucius Institute Scholarship",
        institution: "Ministry of Education, China",
        country: "China",
        region: "China",
        deadline: "May 2027",
        degree_level: ["Bachelor's", "Master's"],
        funding: "Full Tuition + Stipend",
        description:
            "For students studying Chinese language, culture, or education at designated Chinese universities.",
        url: "https://www.chinese.cn",
        fields: ["Chinese Language", "Education", "Culture"],
        is_fully_funded: true,
    },

    // ── European Union ─────────────────────────────
    {
        id: "eu-erasmus",
        title: "Erasmus Mundus Joint Master's",
        institution: "European Commission",
        country: "Multiple EU Countries",
        region: "EU",
        deadline: "January 2027",
        degree_level: ["Master's"],
        funding: "€25,000/year + Travel + Insurance",
        description:
            "Study at multiple European universities with full funding. Over 100 joint Master's programs across all disciplines.",
        url: "https://erasmus-plus.ec.europa.eu",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "eu-daad",
        title: "DAAD Scholarships",
        institution: "German Academic Exchange Service",
        country: "Germany",
        region: "EU",
        deadline: "October 2026",
        degree_level: ["Master's", "PhD"],
        funding: "€934–1,300/month + Tuition + Insurance",
        description:
            "Germany's largest scholarship organization for international students. Covers living expenses, health insurance, and travel.",
        url: "https://www.daad.de",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
    {
        id: "eu-eiffel",
        title: "Eiffel Excellence Scholarship",
        institution: "French Ministry of Europe",
        country: "France",
        region: "EU",
        deadline: "January 2027",
        degree_level: ["Master's", "PhD"],
        funding: "€1,181—€1,700/month",
        description:
            "France's prestigious scholarship for international students. Covers living allowance, return flights, and health insurance.",
        url: "https://www.campusfrance.org",
        fields: ["Sciences", "Engineering", "Economics", "Law", "Political Science"],
        is_fully_funded: false,
    },
    {
        id: "eu-si-sweden",
        title: "Swedish Institute Scholarships",
        institution: "Swedish Institute",
        country: "Sweden",
        region: "EU",
        deadline: "February 2027",
        degree_level: ["Master's"],
        funding: "Full Tuition + SEK 10,000/month",
        description:
            "Fully funded Master's study in Sweden. Covers tuition, living expenses, travel grant, and insurance.",
        url: "https://si.se/en/apply/scholarships",
        fields: ["All Fields"],
        is_fully_funded: true,
    },
];
