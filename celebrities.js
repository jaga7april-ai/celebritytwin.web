/**
 * Celebrity Doppelgänger Database
 * Contains curated celebrity profiles with real headshot photography URLs,
 * fallback biometric SVG avatars, vector baselines, career highlights, and quotes.
 */

// Helper to generate stylized SVG avatars for celebrities (offline/fallback mode)
function generateCelebSvg(config) {
    const {
        skinColor = "#fcd0a1",
        hairColor = "#3d2314",
        hairStyle = "short", // 'short', 'wavy-long', 'curly', 'slick', 'buzz', 'bun', 'bob', 'fade'
        eyeColor = "#4b2d18",
        facialHair = "none", // 'none', 'stubble', 'beard', 'goatee'
        accentColor = "#6366f1",
        glasses = false,
        earrings = false,
        name = "Celeb"
    } = config;

    let hairPath = "";
    if (hairStyle === "short") {
        hairPath = `<path d="M40 70 C35 30, 85 15, 120 15 C155 15, 205 30, 200 70 C195 50, 160 30, 120 32 C80 30, 45 50, 40 70 Z" fill="${hairColor}" />
                    <path d="M40 70 Q35 100 48 115 Q52 80 60 70 Z" fill="${hairColor}" />
                    <path d="M200 70 Q205 100 192 115 Q188 80 180 70 Z" fill="${hairColor}" />`;
    } else if (hairStyle === "wavy-long") {
        hairPath = `<path d="M35 75 C30 20, 85 10, 120 10 C155 10, 210 20, 205 75 C215 110, 215 160, 195 200 C185 170, 195 120, 185 85 C165 40, 75 40, 55 85 C45 120, 55 170, 45 200 C25 160, 25 110, 35 75 Z" fill="${hairColor}" />`;
    } else if (hairStyle === "curly") {
        hairPath = `<circle cx="65" cy="45" r="28" fill="${hairColor}" />
                    <circle cx="100" cy="30" r="28" fill="${hairColor}" />
                    <circle cx="140" cy="30" r="28" fill="${hairColor}" />
                    <circle cx="175" cy="45" r="28" fill="${hairColor}" />
                    <circle cx="45" cy="80" r="25" fill="${hairColor}" />
                    <circle cx="195" cy="80" r="25" fill="${hairColor}" />
                    <circle cx="45" cy="115" r="22" fill="${hairColor}" />
                    <circle cx="195" cy="115" r="22" fill="${hairColor}" />`;
    } else if (hairStyle === "slick") {
        hairPath = `<path d="M48 65 C45 25, 80 18, 120 18 C160 18, 195 25, 192 65 C185 45, 155 35, 120 35 C85 35, 55 45, 48 65 Z" fill="${hairColor}" />
                    <path d="M46 65 Q42 95 50 110 Q54 85 62 70 Z" fill="${hairColor}" />
                    <path d="M194 65 Q198 95 190 110 Q186 85 178 70 Z" fill="${hairColor}" />`;
    } else if (hairStyle === "buzz") {
        hairPath = `<path d="M52 65 C50 35, 80 26, 120 26 C160 26, 190 35, 188 65 C175 45, 150 38, 120 38 C90 38, 65 45, 52 65 Z" fill="${hairColor}" opacity="0.85"/>`;
    } else if (hairStyle === "bob") {
        hairPath = `<path d="M42 65 C40 20, 85 15, 120 15 C155 15, 200 20, 198 65 C205 105, 200 150, 185 165 C175 140, 185 100, 175 75 C160 40, 80 40, 65 75 C55 100, 65 140, 55 165 C40 150, 35 105, 42 65 Z" fill="${hairColor}" />`;
    } else if (hairStyle === "fade") {
        hairPath = `<path d="M50 55 C52 28, 85 18, 120 18 C155 18, 188 28, 190 55 C180 35, 150 28, 120 28 C90 28, 60 35, 50 55 Z" fill="${hairColor}" />
                    <rect x="48" y="55" width="8" height="40" fill="${hairColor}" opacity="0.4" />
                    <rect x="184" y="55" width="8" height="40" fill="${hairColor}" opacity="0.4" />`;
    } else { // bun
        hairPath = `<circle cx="120" cy="18" r="24" fill="${hairColor}" />
                    <path d="M48 65 C48 30, 80 25, 120 25 C160 25, 192 30, 192 65 C180 50, 155 40, 120 40 C85 40, 60 50, 48 65 Z" fill="${hairColor}" />`;
    }

    let facialHairPath = "";
    if (facialHair === "beard") {
        facialHairPath = `<path d="M72 135 C70 175, 85 200, 120 200 C155 200, 170 175, 168 135 C160 145, 140 155, 120 155 C100 155, 80 145, 72 135 Z" fill="${hairColor}" opacity="0.9" />
                          <path d="M98 142 Q120 145 142 142 Q135 152 120 152 Q105 152 98 142 Z" fill="${hairColor}" opacity="0.9" />`;
    } else if (facialHair === "stubble") {
        facialHairPath = `<path d="M75 140 C75 170, 90 195, 120 195 C150 195, 165 170, 165 140 C155 148, 138 154, 120 154 C102 154, 85 148, 75 140 Z" fill="${hairColor}" opacity="0.25" stroke="${hairColor}" stroke-dasharray="2,3" stroke-width="2"/>`;
    } else if (facialHair === "goatee") {
        facialHairPath = `<path d="M102 140 Q120 143 138 140 Q133 150 120 150 Q107 150 102 140 Z" fill="${hairColor}" opacity="0.85"/>
                          <path d="M105 160 Q120 162 135 160 Q130 195 120 195 Q110 195 105 160 Z" fill="${hairColor}" opacity="0.85"/>`;
    }

    let glassesEl = glasses ? `
        <rect x="68" y="88" width="38" height="26" rx="5" fill="none" stroke="#e2e8f0" stroke-width="3.5" opacity="0.9"/>
        <rect x="134" y="88" width="38" height="26" rx="5" fill="none" stroke="#e2e8f0" stroke-width="3.5" opacity="0.9"/>
        <line x1="106" y1="99" x2="134" y2="99" stroke="#e2e8f0" stroke-width="3.5"/>
        <line x1="50" y1="97" x2="68" y2="97" stroke="#e2e8f0" stroke-width="2.5"/>
        <line x1="172" y1="97" x2="190" y2="97" stroke="#e2e8f0" stroke-width="2.5"/>
    ` : "";

    let earringsEl = earrings ? `
        <circle cx="48" cy="115" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <circle cx="192" cy="115" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
    ` : "";

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
        <defs>
            <linearGradient id="bgGrad_${name.replace(/\s+/g,'_')}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#1e1b4b"/>
                <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <radialGradient id="aura_${name.replace(/\s+/g,'_')}" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
            </radialGradient>
        </defs>

        <rect width="240" height="240" rx="24" fill="url(#bgGrad_${name.replace(/\s+/g,'_')})"/>
        <circle cx="120" cy="100" r="85" fill="url(#aura_${name.replace(/\s+/g,'_')})"/>

        <!-- Shoulders / Clothes -->
        <path d="M40 240 C45 190, 80 175, 120 175 C160 175, 195 190, 200 240 Z" fill="#1e293b"/>
        <path d="M85 180 L120 220 L155 180 L135 240 L105 240 Z" fill="${accentColor}" opacity="0.7"/>

        <!-- Neck -->
        <rect x="104" y="140" width="32" height="40" rx="6" fill="${skinColor}"/>

        <!-- Ears -->
        <circle cx="53" cy="105" r="14" fill="${skinColor}"/>
        <circle cx="187" cy="105" r="14" fill="${skinColor}"/>

        <!-- Face Shape -->
        <path d="M56 85 C56 50, 184 50, 184 85 C184 135, 160 175, 120 175 C80 175, 56 135, 56 85 Z" fill="${skinColor}"/>

        <!-- Facial Hair -->
        ${facialHairPath}

        <!-- Eyebrows -->
        <path d="M72 82 Q88 77 104 82" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M136 82 Q152 77 168 82" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none"/>

        <!-- Eyes -->
        <ellipse cx="88" cy="98" rx="10" ry="7" fill="#ffffff"/>
        <ellipse cx="152" cy="98" rx="10" ry="7" fill="#ffffff"/>
        <circle cx="88" cy="98" r="5" fill="${eyeColor}"/>
        <circle cx="152" cy="98" r="5" fill="${eyeColor}"/>
        <circle cx="86" cy="96" r="1.5" fill="#ffffff"/>
        <circle cx="150" cy="96" r="1.5" fill="#ffffff"/>

        <!-- Nose -->
        <path d="M120 95 L116 122 Q120 125 125 122" stroke="#d49366" stroke-width="2.5" stroke-linecap="round" fill="none"/>

        <!-- Mouth -->
        <path d="M102 142 Q120 152 138 142" stroke="#b91c1c" stroke-width="3.5" stroke-linecap="round" fill="none"/>

        <!-- Hair overlay -->
        ${hairPath}

        <!-- Accessories -->
        ${glassesEl}
        ${earringsEl}

        <circle cx="120" cy="120" r="95" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="6,8" opacity="0.3"/>
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
}

/**
 * 24 Diverse, World-Famous Celebrities with:
 * - photoUrl: Real photographic portraits from high-resolution Wikimedia Commons archives
 * - avatarSvg: Offline instant fallback vector portrait
 * - vector: 12-dimensional normalized biometric baselines
 */
window.CELEBRITY_DATABASE = [
    {
        id: "timothee-chalamet",
        name: "Timothée Chalamet",
        gender: "male",
        category: "Cinema",
        knownFor: "Dune, Wonka, Call Me by Your Name",
        twinVibe: "Sculpted Romantic Intensity & Ethereal Curls",
        quote: "There's an intuition and a spontaneity that I'm always looking for.",
        signatureLook: "Chiseled jawline, wavy tousled brunette hair, deep thoughtful gaze.",
        funFact: "Known for possessing one of the most mathematically symmetrical jawlines in modern cinema.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Timoth%C3%A9e_Chalamet_2019_%28cropped%29.jpg/640px-Timoth%C3%A9e_Chalamet_2019_%28cropped%29.jpg",
        vector: [0.48, 0.52, 0.86, 0.62, 0.58, 0.74, 0.45, 0.96, 0.42, 0.78, 0.68, 0.88],
        avatarSvg: generateCelebSvg({
            name: "Timothée Chalamet",
            skinColor: "#fae8d2",
            hairColor: "#291b14",
            hairStyle: "curly",
            eyeColor: "#3b483e",
            accentColor: "#a855f7",
            facialHair: "none"
        })
    },
    {
        id: "zendaya",
        name: "Zendaya",
        gender: "female",
        category: "Cinema",
        knownFor: "Euphoria, Dune, Spider-Man: No Way Home",
        twinVibe: "High-Fashion Haute Contour & Radiant Grace",
        quote: "Determination is doing what needs to be done even when you don't feel like it.",
        signatureLook: "Regal posture, razor-sharp cheekbones, expressive hazel eyes.",
        funFact: "Her red carpet fashion symmetry regularly breaks viral fashion metrics.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg/640px-Zendaya_-_2019_by_Glenn_Francis.jpg",
        vector: [0.52, 0.44, 0.92, 0.70, 0.62, 0.62, 0.68, 0.97, 0.58, 0.82, 0.82, 0.85],
        avatarSvg: generateCelebSvg({
            name: "Zendaya",
            skinColor: "#c98f63",
            hairColor: "#2a1810",
            hairStyle: "wavy-long",
            eyeColor: "#57351c",
            accentColor: "#ec4899",
            earrings: true
        })
    },
    {
        id: "leonardo-dicaprio",
        name: "Leonardo DiCaprio",
        gender: "male",
        category: "Cinema",
        knownFor: "Titanic, Inception, The Revenant, The Wolf of Wall Street",
        twinVibe: "Golden-Age Hollywood Magnetic Charm",
        quote: "If you can do what you do best and be happy, you're further along in life than most people.",
        signatureLook: "Intense blue eyes, slicked blonde-brown mane, piercing brow line.",
        funFact: "Has maintained an iconic screen presence for over three decades.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Leonardo_DiCaprio_2014.jpg/640px-Leonardo_DiCaprio_2014.jpg",
        vector: [0.58, 0.72, 0.75, 0.58, 0.55, 0.76, 0.52, 0.94, 0.54, 0.45, 0.60, 0.74],
        avatarSvg: generateCelebSvg({
            name: "Leonardo DiCaprio",
            skinColor: "#fed7aa",
            hairColor: "#785028",
            hairStyle: "slick",
            eyeColor: "#2563eb",
            accentColor: "#f59e0b",
            facialHair: "stubble"
        })
    },
    {
        id: "scarlett-johansson",
        name: "Scarlett Johansson",
        gender: "female",
        category: "Cinema",
        knownFor: "Black Widow, Lost in Translation, Her, Marriage Story",
        twinVibe: "Classic Femme Fatale & Velvety Elegance",
        quote: "I'm always looking for things that surprise me and take me out of my comfort zone.",
        signatureLook: "Voluptuous smile, arched golden brows, expressive green-hazel eyes.",
        funFact: "Voted one of the most recognizable screen faces globally by visual AI indexes.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg/640px-Scarlett_Johansson_by_Gage_Skidmore_2_%28cropped%29.jpg",
        vector: [0.54, 0.48, 0.88, 0.65, 0.52, 0.80, 0.58, 0.96, 0.75, 0.32, 0.78, 0.68],
        avatarSvg: generateCelebSvg({
            name: "Scarlett Johansson",
            skinColor: "#ffedd5",
            hairColor: "#d97706",
            hairStyle: "bob",
            eyeColor: "#059669",
            accentColor: "#f43f5e",
            earrings: true
        })
    },
    {
        id: "keanu-reeves",
        name: "Keanu Reeves",
        gender: "male",
        category: "Cinema",
        knownFor: "The Matrix, John Wick, Speed",
        twinVibe: "Timeless Cyberpunk Stoicism & Kind Soul",
        quote: "The simple act of paying attention can take you a long way.",
        signatureLook: "Shoulder-length black hair, brooding dark eyes, soulful beard.",
        funFact: "Known as the internet's most universally beloved action hero.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Reevesbis02023_%28cropped%29.jpg/640px-Reevesbis02023_%28cropped%29.jpg",
        vector: [0.46, 0.64, 0.78, 0.54, 0.65, 0.68, 0.48, 0.95, 0.38, 0.92, 0.55, 0.82],
        avatarSvg: generateCelebSvg({
            name: "Keanu Reeves",
            skinColor: "#fde68a",
            hairColor: "#111827",
            hairStyle: "wavy-long",
            eyeColor: "#1f2937",
            accentColor: "#06b6d4",
            facialHair: "beard"
        })
    },
    {
        id: "margot-robbie",
        name: "Margot Robbie",
        gender: "female",
        category: "Cinema",
        knownFor: "Barbie, The Wolf of Wall Street, Babylon, Harley Quinn",
        twinVibe: "Sun-Kissed Platinum Radiance & Dazzling Mega-Watt Smile",
        quote: "Always aim high and work hard to make your dreams a reality.",
        signatureLook: "Electric blue eyes, radiant wide smile, high golden cheekbones.",
        funFact: "Her smile was scientifically analyzed to reveal one of the widest dental arches in Hollywood.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg/640px-Margot_Robbie_at_Somerset_House_in_2013_%28cropped%29.jpg",
        vector: [0.55, 0.50, 0.85, 0.68, 0.50, 0.84, 0.55, 0.98, 0.86, 0.22, 0.72, 0.72],
        avatarSvg: generateCelebSvg({
            name: "Margot Robbie",
            skinColor: "#fff1f2",
            hairColor: "#fef08a",
            hairStyle: "wavy-long",
            eyeColor: "#38bdf8",
            accentColor: "#ec4899",
            earrings: true
        })
    },
    {
        id: "cillian-murphy",
        name: "Cillian Murphy",
        gender: "male",
        category: "Cinema",
        knownFor: "Oppenheimer, Peaky Blinders, Inception, 28 Days Later",
        twinVibe: "Hypnotic Piercing Eyes & Razor-Edged Jawline",
        quote: "You have to be willing to be vulnerable and expose yourself.",
        signatureLook: "Astonishingly translucent blue eyes, sharp cheekbones, enigmatic composure.",
        funFact: "Christopher Nolan called his eyes 'extraordinary and impossible to look away from'.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cillian_Murphy_at_Berlinale_2024%2C_Ausschnitt.jpg/640px-Cillian_Murphy_at_Berlinale_2024%2C_Ausschnitt.jpg",
        vector: [0.47, 0.68, 0.94, 0.60, 0.56, 0.82, 0.38, 0.97, 0.35, 0.65, 0.62, 0.95],
        avatarSvg: generateCelebSvg({
            name: "Cillian Murphy",
            skinColor: "#fef3c7",
            hairColor: "#374151",
            hairStyle: "short",
            eyeColor: "#0284c7",
            accentColor: "#6366f1",
            facialHair: "none"
        })
    },
    {
        id: "taylor-swift",
        name: "Taylor Swift",
        gender: "female",
        category: "Music",
        knownFor: "The Eras Tour, Midnights, 1989, Folklore",
        twinVibe: "Iconic Crimson Lip & Blue-Eyed Lyrical Royalty",
        quote: "No matter what happens in life, be good to people. Being good to people is a wonderful legacy.",
        signatureLook: "Signature bangs, cat-eye eyeliner, bright crimson lips, blonde tresses.",
        funFact: "One of the most photographed and analyzed cultural icons of the 21st century.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_3.png/640px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_3.png",
        vector: [0.50, 0.46, 0.80, 0.64, 0.54, 0.85, 0.42, 0.97, 0.72, 0.30, 0.80, 0.65],
        avatarSvg: generateCelebSvg({
            name: "Taylor Swift",
            skinColor: "#fff7ed",
            hairColor: "#fde047",
            hairStyle: "bob",
            eyeColor: "#0284c7",
            accentColor: "#ef4444",
            earrings: true
        })
    },
    {
        id: "michael-b-jordan",
        name: "Michael B. Jordan",
        gender: "male",
        category: "Cinema",
        knownFor: "Creed, Black Panther, Fruitvale Station",
        twinVibe: "Chiseled Athletic Royalty & Warm Confident Smile",
        quote: "If you don't break your own rules, how do you expect to build something new?",
        signatureLook: "Athletic jaw definition, warm deep eyes, sharp fade haircut.",
        funFact: "Ranked People's Sexiest Man Alive and renowned for peak physical aesthetic.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_B._Jordan_Cannes_2018.jpg/640px-Michael_B._Jordan_Cannes_2018.jpg",
        vector: [0.56, 0.76, 0.84, 0.64, 0.54, 0.38, 0.78, 0.96, 0.70, 0.95, 0.65, 0.84],
        avatarSvg: generateCelebSvg({
            name: "Michael B. Jordan",
            skinColor: "#854d0e",
            hairColor: "#171717",
            hairStyle: "fade",
            eyeColor: "#292524",
            accentColor: "#eab308",
            facialHair: "goatee"
        })
    },
    {
        id: "deepika-padukone",
        name: "Deepika Padukone",
        gender: "female",
        category: "Bollywood",
        knownFor: "Padmaavat, Pathaan, Om Shanti Om, xXx: Return of Xander Cage",
        twinVibe: "Regal Global Siren & Iconic Dimpled Smile",
        quote: "To me, the mind and body are one. I'm very passionate about emotional well-being.",
        signatureLook: "Deep iconic cheek dimples, large doe-like brown eyes, high arched brows.",
        funFact: "Unveiled the FIFA World Cup trophy and served on the Cannes Film Festival jury.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Deepika_Padukone_Cannes_2018_%28cropped%29.jpg/640px-Deepika_Padukone_Cannes_2018_%28cropped%29.jpg",
        vector: [0.49, 0.45, 0.90, 0.72, 0.58, 0.64, 0.72, 0.98, 0.82, 0.92, 0.84, 0.76],
        avatarSvg: generateCelebSvg({
            name: "Deepika Padukone",
            skinColor: "#d97706",
            hairColor: "#1c1917",
            hairStyle: "bun",
            eyeColor: "#451a03",
            accentColor: "#f59e0b",
            earrings: true
        })
    },
    {
        id: "shah-rukh-khan",
        name: "Shah Rukh Khan",
        gender: "male",
        category: "Bollywood",
        knownFor: "Dilwale Dulhania Le Jayenge, Jawan, Pathaan, My Name Is Khan",
        twinVibe: "The King of Romance & Magnetic Charismatic Dimples",
        quote: "Success is not a good teacher, failure makes you humble.",
        signatureLook: "Iconic flopped locks, deep dimples, intense soulful brown gaze.",
        funFact: "Widely regarded as the biggest movie star in the world by total global audience reach.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_book_%2725_years_of_a_life_in_cinema%27_%28cropped%29.jpg/640px-Shah_Rukh_Khan_graces_the_launch_of_the_book_%2725_years_of_a_life_in_cinema%27_%28cropped%29.jpg",
        vector: [0.53, 0.66, 0.82, 0.62, 0.60, 0.55, 0.75, 0.95, 0.78, 0.90, 0.70, 0.78],
        avatarSvg: generateCelebSvg({
            name: "Shah Rukh Khan",
            skinColor: "#b45309",
            hairColor: "#0c0a09",
            hairStyle: "short",
            eyeColor: "#292524",
            accentColor: "#3b82f6",
            facialHair: "stubble"
        })
    },
    {
        id: "rihanna",
        name: "Rihanna",
        gender: "female",
        category: "Music",
        knownFor: "Anti, Diamonds, Umbrella, Fenty Beauty",
        twinVibe: "Unapologetic BadGal Empire & Striking Green-Hazel Eyes",
        quote: "There's something so special about a woman who dominates in a man's world.",
        signatureLook: "Striking green hazel eyes, high arched forehead, trendsetting lips.",
        funFact: "Revolutionized the beauty industry with 50-shade inclusive foundation lines.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/640px-Rihanna_Fenty_2018.png",
        vector: [0.55, 0.52, 0.88, 0.74, 0.70, 0.52, 0.70, 0.95, 0.65, 0.88, 0.88, 0.80],
        avatarSvg: generateCelebSvg({
            name: "Rihanna",
            skinColor: "#a16207",
            hairColor: "#18181b",
            hairStyle: "curly",
            eyeColor: "#15803d",
            accentColor: "#ec4899",
            earrings: true
        })
    },
    {
        id: "robert-downey-jr",
        name: "Robert Downey Jr.",
        gender: "male",
        category: "Cinema",
        knownFor: "Iron Man, Oppenheimer, Sherlock Holmes, Avengers",
        twinVibe: "Razor-Witted Genius & Magnetic Billionaire Charm",
        quote: "I know very little about acting. I'm just an incredibly gifted faker.",
        signatureLook: "Sculpted anchor goatee, expressive mischievous brown eyes, tinted shades.",
        funFact: "Won the Academy Award for his transformative role as Lewis Strauss in Oppenheimer.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/640px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg",
        vector: [0.55, 0.65, 0.76, 0.60, 0.58, 0.75, 0.55, 0.94, 0.68, 0.68, 0.65, 0.79],
        avatarSvg: generateCelebSvg({
            name: "Robert Downey Jr.",
            skinColor: "#fed7aa",
            hairColor: "#451a03",
            hairStyle: "short",
            eyeColor: "#451a03",
            accentColor: "#ef4444",
            facialHair: "goatee",
            glasses: true
        })
    },
    {
        id: "emma-stone",
        name: "Emma Stone",
        gender: "female",
        category: "Cinema",
        knownFor: "La La Land, Poor Things, The Favourite, Cruella",
        twinVibe: "Vibrant Emerald Gaze & Effervescent Comic Genius",
        quote: "What makes you different right now might be what makes you stand out later.",
        signatureLook: "Enormous saucer-like green eyes, auburn hair, infectious husky laugh.",
        funFact: "Two-time Academy Award winner celebrated for daring expressive physical performances.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Emma_Stone_at_the_39th_Mill_Valley_Film_Festival_%28cropped%29.jpg/640px-Emma_Stone_at_the_39th_Mill_Valley_Film_Festival_%28cropped%29.jpg",
        vector: [0.57, 0.46, 0.82, 0.78, 0.52, 0.86, 0.40, 0.96, 0.84, 0.48, 0.74, 0.64],
        avatarSvg: generateCelebSvg({
            name: "Emma Stone",
            skinColor: "#fff1f2",
            hairColor: "#b91c1c",
            hairStyle: "bob",
            eyeColor: "#059669",
            accentColor: "#10b981",
            earrings: true
        })
    },
    {
        id: "harry-styles",
        name: "Harry Styles",
        gender: "male",
        category: "Music",
        knownFor: "As It Was, Watermelon Sugar, Fine Line",
        twinVibe: "Rock-and-Roll Romantic & Dapper Whimsical Soul",
        quote: "A dream is only a dream until you decide to make it real.",
        signatureLook: "Cascading dark waves, boyish dimples, vintage 70s rock aesthetic.",
        funFact: "First solo man to appear on the solo cover of American Vogue.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Harry_Styles_November_2019_%28cropped%29.jpg/640px-Harry_Styles_November_2019_%28cropped%29.jpg",
        vector: [0.51, 0.54, 0.82, 0.64, 0.56, 0.78, 0.48, 0.96, 0.76, 0.74, 0.65, 0.70],
        avatarSvg: generateCelebSvg({
            name: "Harry Styles",
            skinColor: "#ffedd5",
            hairColor: "#292524",
            hairStyle: "curly",
            eyeColor: "#15803d",
            accentColor: "#8b5cf6",
            earrings: true
        })
    },
    {
        id: "ana-de-armas",
        name: "Ana de Armas",
        gender: "female",
        category: "Cinema",
        knownFor: "Knives Out, Blade Runner 2049, No Time to Die, Blonde",
        twinVibe: "Green-Eyed Velvet Glamour & Breathtaking Screen Radiance",
        quote: "I am ambitious, and I work hard to prove that I can bring something unique.",
        signatureLook: "Large hazel-green eyes, full lips, delicate symmetrical oval face.",
        funFact: "Earned an Oscar nomination for her uncanny transformation into Marilyn Monroe.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Ana_de_Armas_by_Gage_Skidmore_2020.jpg/640px-Ana_de_Armas_by_Gage_Skidmore_2020.jpg",
        vector: [0.52, 0.44, 0.86, 0.72, 0.52, 0.82, 0.50, 0.97, 0.74, 0.55, 0.72, 0.68],
        avatarSvg: generateCelebSvg({
            name: "Ana de Armas",
            skinColor: "#fef3c7",
            hairColor: "#57351c",
            hairStyle: "bob",
            eyeColor: "#65a30d",
            accentColor: "#ec4899",
            earrings: true
        })
    },
    {
        id: "chris-hemsworth",
        name: "Chris Hemsworth",
        gender: "male",
        category: "Cinema",
        knownFor: "Thor, Extraction, The Avengers, Furiosa",
        twinVibe: "Norse God Ruggedness & Sky-Blue Stare",
        quote: "You have to be willing to take a chance on something that scares you.",
        signatureLook: "Towering square jaw, golden blonde locks, piercing ocean eyes.",
        funFact: "Frequently cited in biometric studies as having optimal classical jaw proportions.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg/640px-Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg",
        vector: [0.59, 0.88, 0.86, 0.64, 0.52, 0.78, 0.60, 0.96, 0.62, 0.35, 0.58, 0.92],
        avatarSvg: generateCelebSvg({
            name: "Chris Hemsworth",
            skinColor: "#fed7aa",
            hairColor: "#ca8a04",
            hairStyle: "short",
            eyeColor: "#0284c7",
            accentColor: "#0284c7",
            facialHair: "beard"
        })
    },
    {
        id: "billie-eilish",
        name: "Billie Eilish",
        gender: "female",
        category: "Music",
        knownFor: "Bad Guy, What Was I Made For?, Happier Than Ever",
        twinVibe: "Ethereal Dream-Pop Melancholy & Ocean Blue Eyes",
        quote: "Words are more powerful than some noises. Noises won't last long, words will.",
        signatureLook: "Piercing icy blue eyes, delicate snub nose, transformative hair palettes.",
        funFact: "Youngest person in history to win two Academy Awards.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Billie_Eilish_at_the_2023_Golden_Globes.jpg/640px-Billie_Eilish_at_the_2023_Golden_Globes.jpg",
        vector: [0.54, 0.46, 0.76, 0.66, 0.56, 0.86, 0.35, 0.96, 0.44, 0.20, 0.62, 0.62],
        avatarSvg: generateCelebSvg({
            name: "Billie Eilish",
            skinColor: "#fff1f2",
            hairColor: "#111827",
            hairStyle: "short",
            eyeColor: "#38bdf8",
            accentColor: "#10b981",
            earrings: true
        })
    },
    {
        id: "pedro-pascal",
        name: "Pedro Pascal",
        gender: "male",
        category: "Cinema",
        knownFor: "The Last of Us, The Mandalorian, Game of Thrones, Narcos",
        twinVibe: "The Internet's Protective Dad & Weathered Warmth",
        quote: "I'm just a goofy guy who loves acting and happens to get good work.",
        signatureLook: "Gentle crinkling eye smile, signature salt-and-pepper mustache, relatable charm.",
        funFact: "Broke internet metrics in 2023 becoming one of the most meme'd and loved figures globally.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pedro_Pascal_by_Gage_Skidmore.jpg/640px-Pedro_Pascal_by_Gage_Skidmore.jpg",
        vector: [0.56, 0.70, 0.76, 0.60, 0.58, 0.72, 0.62, 0.94, 0.66, 0.70, 0.60, 0.76],
        avatarSvg: generateCelebSvg({
            name: "Pedro Pascal",
            skinColor: "#fed7aa",
            hairColor: "#44403c",
            hairStyle: "short",
            eyeColor: "#451a03",
            accentColor: "#d97706",
            facialHair: "stubble"
        })
    },
    {
        id: "gal-gadot",
        name: "Gal Gadot",
        gender: "female",
        category: "Cinema",
        knownFor: "Wonder Woman, Fast & Furious, Red Notice",
        twinVibe: "Amazonian Warrior Elegance & Sunlit Radiance",
        quote: "I think women are amazing for showing how strong they are.",
        signatureLook: "High athletic cheekbones, warm almond brown eyes, tall commanding smile.",
        funFact: "Former Miss Israel and military combat instructor turned superhero icon.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Gal_Gadot_cropped_lighting_corrected_2b.jpg/640px-Gal_Gadot_cropped_lighting_corrected_2b.jpg",
        vector: [0.50, 0.48, 0.88, 0.68, 0.55, 0.72, 0.66, 0.97, 0.78, 0.80, 0.76, 0.78],
        avatarSvg: generateCelebSvg({
            name: "Gal Gadot",
            skinColor: "#fde68a",
            hairColor: "#1c1917",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#e11d48",
            earrings: true
        })
    },
    {
        id: "dwayne-johnson",
        name: "Dwayne Johnson",
        gender: "male",
        category: "Cinema",
        knownFor: "Moana, Jumanji, Fast & Furious, Black Adam",
        twinVibe: "The People's Eyebrow & Pure Unstoppable Energy",
        quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
        signatureLook: "Signature arched eyebrow, dazzling white smile, indestructible jawline.",
        funFact: "His arched eyebrow signature move has been recognized by facial expression algorithms worldwide.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Dwayne_%22The_Rock%22_Johnson_Visits_the_Pentagon_%282019%29_cropped.jpg/640px-Dwayne_%22The_Rock%22_Johnson_Visits_the_Pentagon_%282019%29_cropped.jpg",
        vector: [0.62, 0.92, 0.88, 0.66, 0.62, 0.58, 0.75, 0.95, 0.82, 0.10, 0.92, 0.90],
        avatarSvg: generateCelebSvg({
            name: "Dwayne Johnson",
            skinColor: "#b45309",
            hairColor: "#b45309",
            hairStyle: "buzz",
            eyeColor: "#292524",
            accentColor: "#f59e0b",
            facialHair: "stubble"
        })
    },
    {
        id: "natalie-portman",
        name: "Natalie Portman",
        gender: "female",
        category: "Cinema",
        knownFor: "Black Swan, Star Wars, Leon: The Professional, Thor",
        twinVibe: "Harvard Intellectual Brilliance & Delicate Sculpted Beauty",
        quote: "I'd rather be smart than a movie star.",
        signatureLook: "Signature beauty mark, refined jawline, deep dark brown gaze.",
        funFact: "Holds a psychology degree from Harvard University and co-authored scientific papers.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Natalie_Portman_%2848470988352%29_%28cropped%29.jpg/640px-Natalie_Portman_%2848470988352%29_%28cropped%29.jpg",
        vector: [0.50, 0.46, 0.88, 0.66, 0.52, 0.80, 0.54, 0.98, 0.70, 0.76, 0.75, 0.76],
        avatarSvg: generateCelebSvg({
            name: "Natalie Portman",
            skinColor: "#fff1f2",
            hairColor: "#3e2723",
            hairStyle: "bob",
            eyeColor: "#3e2723",
            accentColor: "#8b5cf6",
            earrings: true
        })
    },
    {
        id: "tom-cruise",
        name: "Tom Cruise",
        gender: "male",
        category: "Cinema",
        knownFor: "Top Gun, Mission: Impossible, Jerry Maguire, Edge of Tomorrow",
        twinVibe: "High-Octane Adrenaline & The Billion-Dollar Smirk",
        quote: "I don't agree with people who think you learn more from getting beat up than you do from winning.",
        signatureLook: "Aviator sunglasses, mega-watt grin, ageless action hero focus.",
        funFact: "Performs nearly all of his death-defying aerial, motorcycle, and underwater stunts himself.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg/640px-Tom_Cruise_by_Gage_Skidmore_2.jpg",
        vector: [0.55, 0.74, 0.80, 0.62, 0.50, 0.78, 0.58, 0.96, 0.86, 0.68, 0.64, 0.82],
        avatarSvg: generateCelebSvg({
            name: "Tom Cruise",
            skinColor: "#fed7aa",
            hairColor: "#382216",
            hairStyle: "short",
            eyeColor: "#059669",
            accentColor: "#2563eb",
            glasses: true
        })
    },
    {
        id: "beyonce",
        name: "Beyoncé",
        gender: "female",
        category: "Music",
        knownFor: "Renaissance, Lemonade, Crazy in Love, Single Ladies",
        twinVibe: "Queen Bey Regal Magnificence & Honey-Golden Glow",
        quote: "If everything was perfect, you would never learn and you would never grow.",
        signatureLook: "Cascading honey-blonde waves, golden skin luminescence, commanding gaze.",
        funFact: "The most awarded artist in Grammy history with 32 Grammy wins.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/640px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png",
        vector: [0.54, 0.48, 0.90, 0.70, 0.56, 0.60, 0.80, 0.98, 0.80, 0.55, 0.82, 0.78],
        avatarSvg: generateCelebSvg({
            name: "Beyoncé",
            skinColor: "#c2803b",
            hairColor: "#eab308",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#eab308",
            earrings: true
        })
    },
    // ==========================================
    // BOLLYWOOD CELEBRITIES
    // ==========================================
    {
        id: "hrithik-roshan",
        name: "Hrithik Roshan",
        gender: "male",
        category: "Bollywood",
        knownFor: "War, Krrish, Dhoom 2, Zindagi Na Milegi Dobara",
        twinVibe: "The Greek God of Bollywood & Piercing Hazel-Green Eyes",
        quote: "Life is about continuous growth and discovering your true limits.",
        signatureLook: "Chiseled razor-sharp jawline, striking light hazel-green eyes, sculpted symmetry.",
        funFact: "Frequently voted in international polls as one of the world's most handsome men.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Hrithik_Roshan_2022.jpg/640px-Hrithik_Roshan_2022.jpg",
        vector: [0.52, 0.78, 0.92, 0.64, 0.56, 0.72, 0.58, 0.98, 0.68, 0.65, 0.75, 0.94],
        avatarSvg: generateCelebSvg({
            name: "Hrithik Roshan",
            skinColor: "#fed7aa",
            hairColor: "#451a03",
            hairStyle: "short",
            eyeColor: "#65a30d",
            accentColor: "#10b981",
            facialHair: "stubble"
        })
    },
    {
        id: "ranbir-kapoor",
        name: "Ranbir Kapoor",
        gender: "male",
        category: "Bollywood",
        knownFor: "Animal, Rockstar, Barfi!, Yeh Jawaani Hai Deewani",
        twinVibe: "Soulful Cinematic Intensity & Effortless Charm",
        quote: "I believe in working hard and letting your silence do the talking.",
        signatureLook: "Expressive deep-set brown eyes, relaxed wavy hair, classic Kapoor family contours.",
        funFact: "Considered one of the finest method actors of his generation in Indian cinema.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ranbir_Kapoor_promoting_Brahmastra.jpg/640px-Ranbir_Kapoor_promoting_Brahmastra.jpg",
        vector: [0.50, 0.62, 0.80, 0.60, 0.62, 0.70, 0.60, 0.96, 0.62, 0.78, 0.65, 0.76],
        avatarSvg: generateCelebSvg({
            name: "Ranbir Kapoor",
            skinColor: "#fde68a",
            hairColor: "#292524",
            hairStyle: "short",
            eyeColor: "#451a03",
            accentColor: "#f59e0b",
            facialHair: "stubble"
        })
    },
    {
        id: "ranveer-singh",
        name: "Ranveer Singh",
        gender: "male",
        category: "Bollywood",
        knownFor: "Padmaavat, Bajirao Mastani, Gully Boy, Simmba",
        twinVibe: "Electric High-Octane Magnetism & Fearless Swagger",
        quote: "Live life with passion, energy, and zero regrets.",
        signatureLook: "Iconic sculpted mustache, intense fiery gaze, athletic chiseled jawline.",
        funFact: "Famous for his boundless energy and immersive method acting transformations.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ranveer_Singh_in_2023.jpg/640px-Ranveer_Singh_in_2023.jpg",
        vector: [0.54, 0.74, 0.86, 0.62, 0.54, 0.62, 0.70, 0.96, 0.78, 0.92, 0.82, 0.86],
        avatarSvg: generateCelebSvg({
            name: "Ranveer Singh",
            skinColor: "#d97706",
            hairColor: "#171717",
            hairStyle: "short",
            eyeColor: "#292524",
            accentColor: "#ef4444",
            facialHair: "beard"
        })
    },
    {
        id: "alia-bhatt",
        name: "Alia Bhatt",
        gender: "female",
        category: "Bollywood",
        knownFor: "Gangubai Kathiawadi, Raazi, Brahmastra, Highway",
        twinVibe: "Luminous Expressive Grace & Radiant Dimpled Warmth",
        quote: "I want to be remembered for the courage I showed in my choices.",
        signatureLook: "Delicate feminine contours, playful dimples, large expressive brown eyes.",
        funFact: "Time Magazine named her one of the 100 most influential people in the world.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Alia_Bhatt_at_an_event_in_2022.jpg/640px-Alia_Bhatt_at_an_event_in_2022.jpg",
        vector: [0.55, 0.44, 0.82, 0.68, 0.50, 0.78, 0.58, 0.97, 0.84, 0.80, 0.72, 0.65],
        avatarSvg: generateCelebSvg({
            name: "Alia Bhatt",
            skinColor: "#fef3c7",
            hairColor: "#3e2723",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#ec4899",
            earrings: true
        })
    },
    {
        id: "priyanka-chopra",
        name: "Priyanka Chopra",
        gender: "female",
        category: "Bollywood",
        knownFor: "Barfi!, Bajirao Mastani, Quantico, Citadel",
        twinVibe: "Global Powerhouse Elegance & Unapologetic Confidence",
        quote: "You can't be everyone's cup of tea, so just be someone's shot of tequila.",
        signatureLook: "Sculpted full lips, arched brows, warm honey-bronze undertone, magnetic gaze.",
        funFact: "Former Miss World turned international producer, author, and Hollywood star.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Priyanka_Chopra_at_Penn_Campus_crop.jpg/640px-Priyanka_Chopra_at_Penn_Campus_crop.jpg",
        vector: [0.52, 0.48, 0.92, 0.70, 0.55, 0.58, 0.78, 0.98, 0.80, 0.88, 0.86, 0.82],
        avatarSvg: generateCelebSvg({
            name: "Priyanka Chopra",
            skinColor: "#c2803b",
            hairColor: "#1c1917",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#8b5cf6",
            earrings: true
        })
    },
    {
        id: "katrina-kaif",
        name: "Katrina Kaif",
        gender: "female",
        category: "Bollywood",
        knownFor: "Tiger 3, Zindagi Na Milegi Dobara, Dhoom 3, Ek Tha Tiger",
        twinVibe: "Sculpted Porcelain Symmetry & Action Heroine Poise",
        quote: "Discipline and dedication are the cornerstones of lasting success.",
        signatureLook: "Symmetrical oval face, glowing porcelain skin, long dark brown tresses.",
        funFact: "Renowned as one of Bollywood's most disciplined and athletic performers.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Katrina_Kaif_in_2019.jpg/640px-Katrina_Kaif_in_2019.jpg",
        vector: [0.51, 0.46, 0.88, 0.66, 0.52, 0.82, 0.52, 0.98, 0.72, 0.75, 0.76, 0.72],
        avatarSvg: generateCelebSvg({
            name: "Katrina Kaif",
            skinColor: "#fff1f2",
            hairColor: "#292524",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#06b6d4",
            earrings: true
        })
    },
    {
        id: "salman-khan",
        name: "Salman Khan",
        gender: "male",
        category: "Bollywood",
        knownFor: "Bajrangi Bhaijaan, Sultan, Dabangg, Tiger 3",
        twinVibe: "Bhaijaan Dominance & Brooding Blockbuster Aura",
        quote: "Do whatever you want to do, but don't trouble your mother.",
        signatureLook: "Broad masculine jaw, intense piercing gaze, signature blue turquoise bracelet.",
        funFact: "One of the highest-grossing box office forces in the history of Indian entertainment.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Salman_Khan_at_Renault_Star_Guild_Awards.jpg/640px-Salman_Khan_at_Renault_Star_Guild_Awards.jpg",
        vector: [0.60, 0.86, 0.82, 0.60, 0.55, 0.64, 0.68, 0.95, 0.58, 0.88, 0.64, 0.88],
        avatarSvg: generateCelebSvg({
            name: "Salman Khan",
            skinColor: "#fed7aa",
            hairColor: "#171717",
            hairStyle: "short",
            eyeColor: "#292524",
            accentColor: "#3b82f6",
            facialHair: "stubble"
        })
    },
    {
        id: "kiara-advani",
        name: "Kiara Advani",
        gender: "female",
        category: "Bollywood",
        knownFor: "Shershaah, Kabir Singh, Bhool Bhulaiyaa 2, Satyaprem Ki Katha",
        twinVibe: "Radiant Sun-Dappled Warmth & Ethereal Sweetness",
        quote: "Stay grounded, stay true, and let your genuine energy shine.",
        signatureLook: "Delicate harmonious features, bright smile, expressive almond brown eyes.",
        funFact: "Praised as one of the most naturally photogenic screen presences of her generation.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kiara_Advani_at_Sidharth_Malhotra%27s_birthday_bash.jpg/640px-Kiara_Advani_at_Sidharth_Malhotra%27s_birthday_bash.jpg",
        vector: [0.52, 0.44, 0.84, 0.68, 0.52, 0.74, 0.65, 0.98, 0.85, 0.84, 0.74, 0.68],
        avatarSvg: generateCelebSvg({
            name: "Kiara Advani",
            skinColor: "#fef3c7",
            hairColor: "#292524",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#ec4899",
            earrings: true
        })
    },

    // ==========================================
    // KOLLYWOOD (TAMIL CINEMA) CELEBRITIES
    // ==========================================
    {
        id: "rajinikanth",
        name: "Rajinikanth",
        gender: "male",
        category: "Kollywood",
        knownFor: "Jailer, Baashha, Sivaji: The Boss, Enthiran (Robot)",
        twinVibe: "The Immortal Superstar Swagger & Phenomenal Charisma",
        quote: "If I say it once, it's equivalent to saying it a hundred times.",
        signatureLook: "Electrifying gaze, legendary sunglasses flip, iconic charismatic presence.",
        funFact: "Regarded with god-like reverence across the world and celebrated with legendary early morning premieres.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Rajinikanth_in_2013.jpg/640px-Rajinikanth_in_2013.jpg",
        vector: [0.52, 0.66, 0.80, 0.62, 0.60, 0.50, 0.72, 0.96, 0.75, 0.90, 0.68, 0.80],
        avatarSvg: generateCelebSvg({
            name: "Rajinikanth",
            skinColor: "#854d0e",
            hairColor: "#171717",
            hairStyle: "short",
            eyeColor: "#1c1917",
            accentColor: "#f59e0b",
            glasses: true
        })
    },
    {
        id: "thalapathy-vijay",
        name: "Thalapathy Vijay",
        gender: "male",
        category: "Kollywood",
        knownFor: "Leo, Master, Mersal, Ghilli, Thuppakki, GOAT",
        twinVibe: "The Commander's Unstoppable Masses Magnetism",
        quote: "Focus on your goal and conquer your silence with success.",
        signatureLook: "Athletic frame, energetic warm smile, sharp trim jawline, youthful charisma.",
        funFact: "Commands one of the most fiercely loyal fan followings in global cinema history.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vijay_at_the_Nadigar_Sangam_Protest.jpg/640px-Vijay_at_the_Nadigar_Sangam_Protest.jpg",
        vector: [0.53, 0.68, 0.84, 0.62, 0.56, 0.54, 0.74, 0.96, 0.82, 0.92, 0.70, 0.82],
        avatarSvg: generateCelebSvg({
            name: "Thalapathy Vijay",
            skinColor: "#b45309",
            hairColor: "#171717",
            hairStyle: "short",
            eyeColor: "#292524",
            accentColor: "#ef4444",
            facialHair: "stubble"
        })
    },
    {
        id: "ajith-kumar",
        name: "Ajith Kumar",
        gender: "male",
        category: "Kollywood",
        knownFor: "Mankatha, Billa, Vedalam, Thunivu, Viswasam, Vidaa Muyarchi",
        twinVibe: "Salt-and-Pepper King & High-Velocity Racing Dignity",
        quote: "Live and let live. Treat triumph and disaster just the same.",
        signatureLook: "Dapper silver-gray mane, chiseled square jaw, fearless stoic gaze.",
        funFact: "Professional race car driver and licensed aeromodelling drone pilot alongside acting.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Ajith_Kumar_at_the_Billa_2_Press_Meet.jpg/640px-Ajith_Kumar_at_the_Billa_2_Press_Meet.jpg",
        vector: [0.58, 0.82, 0.82, 0.62, 0.54, 0.68, 0.60, 0.96, 0.55, 0.40, 0.62, 0.88],
        avatarSvg: generateCelebSvg({
            name: "Ajith Kumar",
            skinColor: "#fed7aa",
            hairColor: "#94a3b8",
            hairStyle: "short",
            eyeColor: "#334155",
            accentColor: "#0284c7",
            facialHair: "stubble"
        })
    },
    {
        id: "suriya",
        name: "Suriya",
        gender: "male",
        category: "Kollywood",
        knownFor: "Jai Bhim, Soorarai Pottru, Singam, Ghajini, Kanguva, 24",
        twinVibe: "Sculpted Passionate Fire & National Award-Winning Intensity",
        quote: "Give everything you have to what you love, and the world will make room.",
        signatureLook: "Chiseled athletic jaw, piercing honey-brown eyes, sculpted cheek contours.",
        funFact: "Won the National Film Award for Best Actor for Soorarai Pottru and founded the Agaram Foundation.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Suriya_at_24_Press_Meet.jpg/640px-Suriya_at_24_Press_Meet.jpg",
        vector: [0.51, 0.72, 0.88, 0.64, 0.55, 0.58, 0.72, 0.97, 0.70, 0.92, 0.72, 0.86],
        avatarSvg: generateCelebSvg({
            name: "Suriya",
            skinColor: "#b45309",
            hairColor: "#171717",
            hairStyle: "short",
            eyeColor: "#451a03",
            accentColor: "#f59e0b",
            facialHair: "beard"
        })
    },
    {
        id: "dhanush",
        name: "Dhanush",
        gender: "male",
        category: "Kollywood",
        knownFor: "Asuran, Karnan, Aadukalam, Raanjhanaa, Raayan, The Gray Man",
        twinVibe: "Raw Vulnerability & Transcendent Acting Mastery",
        quote: "Talent needs no grand wrapping; sincerity shines on its own.",
        signatureLook: "Lean chiseled jawline, soulful expressive eyes, understated regal poise.",
        funFact: "Multiple-time National Award winner who starred alongside Ryan Gosling in Hollywood's The Gray Man.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Dhanush_at_The_Gray_Man_Premiere.jpg/640px-Dhanush_at_The_Gray_Man_Premiere.jpg",
        vector: [0.46, 0.54, 0.84, 0.60, 0.58, 0.48, 0.76, 0.96, 0.64, 0.94, 0.68, 0.85],
        avatarSvg: generateCelebSvg({
            name: "Dhanush",
            skinColor: "#854d0e",
            hairColor: "#171717",
            hairStyle: "short",
            eyeColor: "#1c1917",
            accentColor: "#8b5cf6",
            facialHair: "beard"
        })
    },
    {
        id: "chiyaan-vikram",
        name: "Chiyaan Vikram",
        gender: "male",
        category: "Kollywood",
        knownFor: "Anniyan, Ponniyin Selvan (Aditha Karikalan), I, Pithamagan, Thangalaan",
        twinVibe: "The Ultimate Chameleon & Ferocious Method Power",
        quote: "I don't just act a character; I dissolve completely into them.",
        signatureLook: "Deep chiseled cheekbones, intense shape-shifting gaze, powerful jawline.",
        funFact: "Gained and lost over 30 kg multiple times for single roles in cinema history.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vikram_at_the_Iru_Mugan_Audio_Launch.jpg/640px-Vikram_at_the_Iru_Mugan_Audio_Launch.jpg",
        vector: [0.50, 0.76, 0.90, 0.62, 0.56, 0.56, 0.70, 0.97, 0.58, 0.85, 0.74, 0.92],
        avatarSvg: generateCelebSvg({
            name: "Chiyaan Vikram",
            skinColor: "#a16207",
            hairColor: "#1c1917",
            hairStyle: "short",
            eyeColor: "#292524",
            accentColor: "#d97706",
            facialHair: "beard"
        })
    },
    {
        id: "kamal-haasan",
        name: "Kamal Haasan",
        gender: "male",
        category: "Kollywood",
        knownFor: "Vikram, Nayakan, Indian, Vishwaroopam, Dasavathaaram, Kalki 2898 AD",
        twinVibe: "The Universal Hero & Infinite Cinema Genius",
        quote: "I am an actor who considers cinema a temple and truth its deity.",
        signatureLook: "Piercing intellectual gaze, classical South Indian facial geometry, iconic mustache.",
        funFact: "Has received the highest number of Filmfare Awards and National Award honors in Indian history.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Kamal_Haasan_at_the_Vishwaroopam_press_meet.jpg/640px-Kamal_Haasan_at_the_Vishwaroopam_press_meet.jpg",
        vector: [0.55, 0.72, 0.82, 0.62, 0.58, 0.62, 0.72, 0.96, 0.65, 0.80, 0.70, 0.82],
        avatarSvg: generateCelebSvg({
            name: "Kamal Haasan",
            skinColor: "#c2803b",
            hairColor: "#292524",
            hairStyle: "short",
            eyeColor: "#292524",
            accentColor: "#10b981",
            facialHair: "stubble"
        })
    },
    {
        id: "nayanthara",
        name: "Nayanthara",
        gender: "female",
        category: "Kollywood",
        knownFor: "Jawan, Netrikann, Aramm, Bigil, Raja Rani, Maya",
        twinVibe: "The Lady Superstar & Regal Unshakable Poise",
        quote: "Believe in yourself even when the world questions your path.",
        signatureLook: "Sculpted high cheekbones, commanding expressive eyes, poised regal tilt.",
        funFact: "The highest-paid and most influential actress across South Indian cinema.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Nayanthara_at_SIIMA_2016.jpg/640px-Nayanthara_at_SIIMA_2016.jpg",
        vector: [0.50, 0.46, 0.92, 0.70, 0.54, 0.64, 0.72, 0.98, 0.76, 0.92, 0.84, 0.80],
        avatarSvg: generateCelebSvg({
            name: "Nayanthara",
            skinColor: "#d97706",
            hairColor: "#171717",
            hairStyle: "bun",
            eyeColor: "#451a03",
            accentColor: "#ec4899",
            earrings: true
        })
    },
    {
        id: "samantha-ruth-prabhu",
        name: "Samantha Ruth Prabhu",
        gender: "female",
        category: "Kollywood",
        knownFor: "Theri, Super Deluxe, The Family Man 2, Kushi, Eega, Citadel: Honey Bunny",
        twinVibe: "Radiant Fitness Warrior & Dazzling Magnetic Smile",
        quote: "Strength doesn't come from what you can do, it comes from overcoming what you once thought you couldn't.",
        signatureLook: "Gleaming high cheekbones, sculpted jawline, infectious radiant eye smile.",
        funFact: "Her nuanced performance in The Family Man 2 earned international critical acclaim.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Samantha_at_the_Launch_of_South_India_Shopping_Mall.jpg/640px-Samantha_at_the_Launch_of_South_India_Shopping_Mall.jpg",
        vector: [0.51, 0.45, 0.88, 0.70, 0.52, 0.70, 0.68, 0.98, 0.88, 0.86, 0.78, 0.74],
        avatarSvg: generateCelebSvg({
            name: "Samantha Ruth Prabhu",
            skinColor: "#c2803b",
            hairColor: "#292524",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#06b6d4",
            earrings: true
        })
    },
    {
        id: "trisha-krishnan",
        name: "Trisha Krishnan",
        gender: "female",
        category: "Kollywood",
        knownFor: "Ponniyin Selvan (Princess Kundavai), 96, Ghilli, Leo, Vinnaithaandi Varuvaayaa",
        twinVibe: "Timeless Princess Kundavai Elegance & Ethereal Grace",
        quote: "Grace is not about standing out, it's about being remembered.",
        signatureLook: "Doe-like almond eyes, sweet symmetrical smile, timeless royal South Indian features.",
        funFact: "Her portrayal of Chola Princess Kundavai in Ponniyin Selvan became an instant cultural icon.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Trisha_Krishnan_at_SIIMA_2016.jpg/640px-Trisha_Krishnan_at_SIIMA_2016.jpg",
        vector: [0.50, 0.44, 0.86, 0.72, 0.54, 0.72, 0.66, 0.98, 0.80, 0.88, 0.80, 0.72],
        avatarSvg: generateCelebSvg({
            name: "Trisha Krishnan",
            skinColor: "#d97706",
            hairColor: "#1c1917",
            hairStyle: "wavy-long",
            eyeColor: "#451a03",
            accentColor: "#a855f7",
            earrings: true
        })
    },
    {
        id: "sai-pallavi",
        name: "Sai Pallavi",
        gender: "female",
        category: "Kollywood",
        knownFor: "Gargi, Premam (Malar), Maari 2 (Rowdy Baby), Shyam Singha Roy, Amaran",
        twinVibe: "Pure Natural Radiance & Spellbinding Dance Energy",
        quote: "True beauty is embracing who you are naturally without hiding behind makeup.",
        signatureLook: "Cascading natural curls, unadorned glowing skin, infectious vibrant laugh.",
        funFact: "Qualified medical doctor whose 'Rowdy Baby' dance video surpassed 1.5 billion views on YouTube.",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sai_Pallavi_at_the_Gargi_Press_Meet.jpg/640px-Sai_Pallavi_at_the_Gargi_Press_Meet.jpg",
        vector: [0.52, 0.46, 0.82, 0.68, 0.54, 0.66, 0.72, 0.97, 0.88, 0.94, 0.72, 0.68],
        avatarSvg: generateCelebSvg({
            name: "Sai Pallavi",
            skinColor: "#c2803b",
            hairColor: "#171717",
            hairStyle: "curly",
            eyeColor: "#292524",
            accentColor: "#10b981",
            earrings: true
        })
    }
];

/**
 * Return the primary image URL for a celebrity (defaults to real photoUrl with avatarSvg fallback)
 */
window.getCelebImageUrl = function(celeb, preferReal = true) {
    if (!celeb) return "";
    return preferReal && celeb.photoUrl ? celeb.photoUrl : celeb.avatarSvg;
};
