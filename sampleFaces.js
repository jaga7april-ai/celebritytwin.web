/**
 * Sample Faces for Instant 1-Click Testing
 * Features real portrait photography alongside vector SVG fallbacks.
 */

function createSampleFaceSvg(skinColor, hairColor, eyeColor, hairStyle, title) {
    let hair = "";
    if (hairStyle === "curly-dark") {
        hair = `
            <circle cx="70" cy="50" r="28" fill="${hairColor}" />
            <circle cx="105" cy="35" r="26" fill="${hairColor}" />
            <circle cx="135" cy="35" r="26" fill="${hairColor}" />
            <circle cx="170" cy="50" r="28" fill="${hairColor}" />
            <path d="M48 70 C40 40, 80 20, 120 20 C160 20, 200 40, 192 70 C185 50, 155 35, 120 35 C85 35, 55 50, 48 70 Z" fill="${hairColor}" />
        `;
    } else if (hairStyle === "long-waves") {
        hair = `
            <path d="M40 70 C35 25, 80 15, 120 15 C160 15, 205 25, 200 70 C210 115, 210 160, 190 195 C180 165, 190 120, 180 80 C160 40, 80 40, 60 80 C50 120, 60 165, 50 195 C30 160, 30 115, 40 70 Z" fill="${hairColor}" />
        `;
    } else if (hairStyle === "short-blonde") {
        hair = `
            <path d="M48 65 C45 30, 80 20, 120 20 C160 20, 195 30, 192 65 C185 45, 155 35, 120 35 C85 35, 55 45, 48 65 Z" fill="${hairColor}" />
            <path d="M48 65 Q42 95 50 110 Q54 85 62 70 Z" fill="${hairColor}" />
            <path d="M192 65 Q198 95 190 110 Q186 85 178 70 Z" fill="${hairColor}" />
        `;
    } else {
        hair = `
            <path d="M44 65 C40 25, 85 18, 120 18 C155 18, 200 25, 196 65 C202 105, 195 145, 182 165 C175 135, 182 95, 175 75 C160 40, 80 40, 65 75 C58 95, 65 135, 58 165 C45 145, 38 105, 44 65 Z" fill="${hairColor}" />
        `;
    }

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
        <rect width="240" height="240" rx="18" fill="#1e293b"/>
        <path d="M45 240 C50 195, 85 180, 120 180 C155 180, 190 195, 195 240 Z" fill="#334155"/>
        <rect x="105" y="142" width="30" height="38" rx="6" fill="${skinColor}"/>
        <path d="M58 88 C58 52, 182 52, 182 88 C182 136, 160 174, 120 174 C80 174, 58 136, 58 88 Z" fill="${skinColor}"/>
        <path d="M74 84 Q90 80 104 84" stroke="${hairColor}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M136 84 Q150 80 166 84" stroke="${hairColor}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="89" cy="99" rx="10" ry="7" fill="#ffffff"/>
        <ellipse cx="151" cy="99" rx="10" ry="7" fill="#ffffff"/>
        <circle cx="89" cy="99" r="5" fill="${eyeColor}"/>
        <circle cx="151" cy="99" r="5" fill="${eyeColor}"/>
        <path d="M120 98 L116 122 Q120 125 124 122" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M102 144 Q120 156 138 144" stroke="#be123c" stroke-width="3" stroke-linecap="round" fill="none"/>
        ${hair}
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
}

window.SAMPLE_FACES = [
    {
        name: "Alex",
        desc: "Sculpted jaw & curly dark waves",
        photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
        fallbackSvg: createSampleFaceSvg("#fcd0a1", "#26150b", "#3b82f6", "curly-dark", "Alex")
    },
    {
        name: "Maya",
        desc: "Golden warm undertone & almond eyes",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        fallbackSvg: createSampleFaceSvg("#c98f63", "#171717", "#451a03", "long-waves", "Maya")
    },
    {
        name: "Liam",
        desc: "Square jawline & blonde sleek styling",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        fallbackSvg: createSampleFaceSvg("#fed7aa", "#ca8a04", "#0284c7", "short-blonde", "Liam")
    },
    {
        name: "Elena",
        desc: "Radiant smile & auburn bob cut",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        fallbackSvg: createSampleFaceSvg("#fff1f2", "#b91c1c", "#059669", "auburn-bob", "Elena")
    }
];
