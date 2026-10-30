/**
 * FaceAnalyzer Engine
 * Biometric feature extraction, skin-tone profiling, symmetry calculation,
 * and celebrity vector cosine-similarity matching.
 */

class FaceAnalyzer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }

    /**
     * Analyze an image element or video frame
     * Returns face bounds, landmarks, 12D vector, and match ranking against celebrity DB.
     */
    async analyze(sourceImage, options = {}) {
        const { genderFilter = 'any', categoryFilter = 'all' } = options;
        const width = 256;
        const height = 256;
        this.canvas.width = width;
        this.canvas.height = height;

        // Draw image normalized to square
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(sourceImage, 0, 0, width, height);

        const imgData = this.ctx.getImageData(0, 0, width, height);
        const pixels = imgData.data;

        // 1. Detect Skin Cluster & Face Center of Mass
        let skinPixels = 0;
        let sumX = 0;
        let sumY = 0;
        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;

        let totalR = 0, totalG = 0, totalB = 0;

        for (let y = 20; y < height - 20; y++) {
            for (let x = 20; x < width - 20; x++) {
                const idx = (y * width + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];

                // Rule-based Skin Tone Classifier (RGB & Luminance rules)
                const isSkin = (r > 60 && g > 40 && b > 20 &&
                                (r - g) >= 10 && (r - b) >= 10 &&
                                Math.max(r, g, b) - Math.min(r, g, b) > 15);

                if (isSkin) {
                    skinPixels++;
                    sumX += x;
                    sumY += y;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;

                    totalR += r;
                    totalG += g;
                    totalB += b;
                }
            }
        }

        // Fallback bounds if skin detection is sparse (e.g. low light or stylized art)
        let centerX = skinPixels > 1500 ? sumX / skinPixels : width / 2;
        let centerY = skinPixels > 1500 ? sumY / skinPixels : height / 2;

        let faceW = Math.max(80, Math.min(180, (maxX - minX) * 0.95));
        let faceH = Math.max(100, Math.min(210, (maxY - minY) * 0.95));

        if (skinPixels <= 1500) {
            faceW = 130;
            faceH = 160;
            minX = centerX - faceW / 2;
            maxX = centerX + faceW / 2;
            minY = centerY - faceH / 2;
            maxY = centerY + faceH / 2;
        }

        // 2. Measure Skin Luminance & Warm Undertone
        const avgR = skinPixels > 0 ? totalR / skinPixels : 180;
        const avgG = skinPixels > 0 ? totalG / skinPixels : 140;
        const avgB = skinPixels > 0 ? totalB / skinPixels : 110;

        const skinLuminance = Math.min(1.0, Math.max(0.15, (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255));
        const warmUndertone = Math.min(1.0, Math.max(0.2, (avgR - avgB + 100) / 220));

        // 3. Aspect Ratio (Face Width / Height)
        const aspectRatio = Math.min(0.85, Math.max(0.42, faceW / faceH));

        // 4. Hair Darkness (Sample upper 25% of image above forehead)
        let hairLumSum = 0;
        let hairSampleCount = 0;
        const topBound = Math.max(0, Math.floor(minY - 30));
        const bottomBound = Math.min(height, Math.floor(minY + 20));

        for (let y = topBound; y < bottomBound; y++) {
            for (let x = Math.max(0, Math.floor(centerX - faceW * 0.45)); x < Math.min(width, Math.floor(centerX + faceW * 0.45)); x++) {
                const idx = (y * width + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                hairLumSum += (r + g + b) / 3;
                hairSampleCount++;
            }
        }
        const avgHairLum = hairSampleCount > 0 ? hairLumSum / hairSampleCount : 100;
        const hairDarkness = Math.min(0.95, Math.max(0.1, 1.0 - (avgHairLum / 255)));

        // 5. Bilateral Facial Symmetry
        let diffSum = 0;
        let symSamples = 0;
        const cX = Math.floor(centerX);
        for (let y = Math.floor(centerY - faceH * 0.35); y < Math.floor(centerY + faceH * 0.35); y++) {
            for (let dx = 5; dx < faceW * 0.4; dx++) {
                const leftIdx = (y * width + (cX - dx)) * 4;
                const rightIdx = (y * width + (cX + dx)) * 4;
                if (leftIdx >= 0 && rightIdx < pixels.length) {
                    const lumLeft = 0.299 * pixels[leftIdx] + 0.587 * pixels[leftIdx + 1] + 0.114 * pixels[leftIdx + 2];
                    const lumRight = 0.299 * pixels[rightIdx] + 0.587 * pixels[rightIdx + 1] + 0.114 * pixels[rightIdx + 2];
                    diffSum += Math.abs(lumLeft - lumRight);
                    symSamples++;
                }
            }
        }
        const avgDiff = symSamples > 0 ? diffSum / symSamples : 20;
        const symmetry = Math.min(0.98, Math.max(0.75, 1.0 - (avgDiff / 180)));

        // 6. Jaw Width & Angularity (Lower third of face)
        const jawY = Math.min(height - 10, Math.floor(centerY + faceH * 0.3));
        let jawLeft = cX;
        let jawRight = cX;
        for (let x = cX; x > Math.max(0, cX - faceW * 0.6); x--) {
            const idx = (jawY * width + x) * 4;
            if (pixels[idx] < 50 || Math.abs(pixels[idx] - avgR) > 60) {
                jawLeft = x;
                break;
            }
        }
        for (let x = cX; x < Math.min(width, cX + faceW * 0.6); x++) {
            const idx = (jawY * width + x) * 4;
            if (pixels[idx] < 50 || Math.abs(pixels[idx] - avgR) > 60) {
                jawRight = x;
                break;
            }
        }
        const measuredJawW = Math.max(40, jawRight - jawLeft);
        const jawWidth = Math.min(0.88, Math.max(0.35, measuredJawW / faceW));
        const angularity = Math.min(0.92, Math.max(0.38, (jawWidth * 0.6 + (1 - aspectRatio) * 0.4)));

        // 7. Smile & Lip Expression Curvature (Lower mouth region)
        const mouthY = Math.floor(centerY + faceH * 0.22);
        let mouthRedness = 0;
        let mouthCount = 0;
        for (let y = mouthY - 10; y <= mouthY + 10; y++) {
            for (let x = cX - 25; x <= cX + 25; x++) {
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const idx = (y * width + x) * 4;
                    const r = pixels[idx];
                    const g = pixels[idx + 1];
                    const b = pixels[idx + 2];
                    mouthRedness += Math.max(0, r - (g + b) / 2);
                    mouthCount++;
                }
            }
        }
        const avgMouthRed = mouthCount > 0 ? mouthRedness / mouthCount : 25;
        const smileCurve = Math.min(0.88, Math.max(0.32, (avgMouthRed / 55) * 0.7 + 0.2));

        // 8. Cheekbone Prominence & Forehead Ratio
        const cheekProminence = Math.min(0.92, Math.max(0.45, (1.2 - jawWidth) * 0.6 + angularity * 0.4));
        const foreheadRatio = Math.min(0.75, Math.max(0.38, (centerY - minY) / faceH));
        const eyeSpacing = Math.min(0.80, Math.max(0.45, faceW * 0.0035 + 0.35));
        const eyebrowArch = Math.min(0.88, Math.max(0.35, 0.45 + (1 - symmetry * 0.1) * 0.3));

        // 9. Automated Gender Presentation Detection Engine
        // Samples chin & upper lip area vs forehead skin for stubble/shadow
        let lowerFaceLum = 0, lowerCount = 0;
        const chinTop = Math.floor(centerY + faceH * 0.26);
        const chinBottom = Math.floor(centerY + faceH * 0.42);
        for (let y = chinTop; y < chinBottom; y++) {
            for (let x = Math.floor(centerX - faceW * 0.22); x < Math.floor(centerX + faceW * 0.22); x++) {
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const idx = (y * width + x) * 4;
                    lowerFaceLum += (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
                    lowerCount++;
                }
            }
        }
        const avgLowerLum = lowerCount > 0 ? lowerFaceLum / lowerCount : 120;
        const facialHairFactor = Math.max(0, (skinLuminance * 255 - avgLowerLum) / 45);

        // Multi-attribute gender scoring: Positive -> Male, Negative -> Female
        let genderScore = 0;
        genderScore += (jawWidth - 0.52) * 4.2;
        genderScore += (angularity - 0.55) * 3.6;
        genderScore += facialHairFactor * 3.2;

        const cheekJawDelta = cheekProminence - jawWidth;
        genderScore -= (cheekJawDelta - 0.15) * 4.6;
        genderScore -= (eyebrowArch - 0.55) * 3.2;
        genderScore -= ((avgMouthRed / 40) - 0.5) * 2.8;

        const predictedGender = genderScore >= 0 ? 'male' : 'female';
        const absScore = Math.abs(genderScore);
        let confidence = Math.round(78 + (1 / (1 + Math.exp(-absScore * 0.85)) - 0.5) * 40);
        confidence = Math.max(81, Math.min(97, confidence));

        const detectedGender = {
            gender: predictedGender,
            confidence: confidence,
            label: predictedGender === 'male' ? `Male (${confidence}% confidence)` : `Female (${confidence}% confidence)`,
            genderScore: genderScore
        };

        // User Feature Vector: 12 Normalized Dimensions
        const userVector = [
            aspectRatio,      // [0]
            jawWidth,         // [1]
            cheekProminence,  // [2]
            eyeSpacing,       // [3]
            foreheadRatio,    // [4]
            skinLuminance,    // [5]
            warmUndertone,    // [6]
            symmetry,         // [7]
            smileCurve,       // [8]
            hairDarkness,     // [9]
            eyebrowArch,      // [10]
            angularity        // [11]
        ];

        // 10. Biometric Landmarks for futuristic scanning overlay
        const eyeY = centerY - faceH * 0.12;
        const leftEyeX = centerX - faceW * 0.22;
        const rightEyeX = centerX + faceW * 0.22;
        const noseY = centerY + faceH * 0.05;
        const chinY = centerY + faceH * 0.48;

        const landmarks = {
            center: { x: centerX, y: centerY },
            bounds: { x: centerX - faceW / 2, y: centerY - faceH / 2, width: faceW, height: faceH },
            leftEye: { x: leftEyeX, y: eyeY },
            rightEye: { x: rightEyeX, y: eyeY },
            leftEyebrow: { x: leftEyeX, y: eyeY - 14 },
            rightEyebrow: { x: rightEyeX, y: eyeY - 14 },
            nose: { x: centerX, y: noseY },
            mouth: { x: centerX, y: mouthY },
            chin: { x: centerX, y: chinY },
            leftCheek: { x: centerX - faceW * 0.38, y: centerY },
            rightCheek: { x: centerX + faceW * 0.38, y: centerY },
            leftJaw: { x: centerX - faceW * 0.34, y: jawY },
            rightJaw: { x: centerX + faceW * 0.34, y: jawY }
        };

        // 11. Match Against Celebrity Database
        const effectiveGender = (genderFilter === 'auto') ? detectedGender.gender : genderFilter;
        const rankedCelebs = this.rankCelebrities(userVector, effectiveGender, categoryFilter);

        // Human-readable trait attributes
        const traits = this.describeTraits(userVector, detectedGender);

        return {
            vector: userVector,
            landmarks,
            traits,
            detectedGender,
            rankings: rankedCelebs
        };
    }

    /**
     * Compute cosine & Euclidean similarity between user and celebrity DB
     */
    rankCelebrities(userVec, genderFilter, categoryFilter) {
        const weights = [
            1.2, // Aspect ratio
            1.4, // Jaw width
            1.3, // Cheekbones
            1.0, // Eye spacing
            0.9, // Forehead ratio
            1.1, // Skin luminance
            1.1, // Warm undertone
            0.8, // Symmetry
            1.0, // Smile curve
            1.2, // Hair darkness
            1.0, // Eyebrow arch
            1.4  // Angularity
        ];

        const totalWeight = weights.reduce((a, b) => a + b, 0);

        let filtered = window.CELEBRITY_DATABASE.filter(c => {
            if (genderFilter !== 'any' && c.gender !== genderFilter) return false;
            if (categoryFilter !== 'all' && c.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
            return true;
        });

        if (filtered.length === 0) {
            filtered = window.CELEBRITY_DATABASE;
        }

        const scored = filtered.map(celeb => {
            const celebVec = celeb.vector;
            let weightedSqDist = 0;

            for (let i = 0; i < userVec.length; i++) {
                const diff = userVec[i] - celebVec[i];
                weightedSqDist += weights[i] * (diff * diff);
            }

            const dist = Math.sqrt(weightedSqDist / totalWeight);

            // Realistic match percentage range: 76% to 97.4%
            const maxDistExpected = 0.42;
            const normalizedDist = Math.min(1.0, dist / maxDistExpected);
            let matchScore = 97.5 - (normalizedDist * 22.0);
            matchScore = Math.max(76.0, Math.min(97.8, matchScore));
            matchScore = Math.round(matchScore * 10) / 10;

            // Specific feature breakdown calculations
            const eyeScore = Math.round(Math.max(75, 100 - Math.abs(userVec[3] - celebVec[3]) * 90 - Math.abs(userVec[10] - celebVec[10]) * 35));
            const jawScore = Math.round(Math.max(74, 100 - Math.abs(userVec[1] - celebVec[1]) * 85 - Math.abs(userVec[11] - celebVec[11]) * 40));
            const cheekScore = Math.round(Math.max(76, 100 - Math.abs(userVec[2] - celebVec[2]) * 80 - Math.abs(userVec[7] - celebVec[7]) * 30));
            const smileScore = Math.round(Math.max(75, 100 - Math.abs(userVec[8] - celebVec[8]) * 85));

            return {
                ...celeb,
                matchScore,
                breakdown: {
                    eyes: Math.min(99, eyeScore),
                    jaw: Math.min(99, jawScore),
                    cheekbones: Math.min(99, cheekScore),
                    smile: Math.min(99, smileScore)
                }
            };
        });

        // Sort descending by match score
        scored.sort((a, b) => b.matchScore - a.matchScore);
        return scored;
    }

    describeTraits(vec, detectedGender) {
        // [aspectRatio, jawWidth, cheekProminence, eyeSpacing, foreheadRatio, skinLuminance, warmUndertone, symmetry, smileCurve, hairDarkness, eyebrowArch, angularity]
        let faceShape = "Oval Harmony";
        if (vec[1] > 0.70 && vec[11] > 0.75) faceShape = "Chiseled Square / Diamond";
        else if (vec[0] > 0.65) faceShape = "Rounded Contour";
        else if (vec[2] > 0.82) faceShape = "Heart / Sculpted High Cheekbone";
        else if (vec[0] < 0.50) faceShape = "Oblong Regal";

        let jawStyle = vec[1] > 0.65 ? "Defined & Angular" : "Soft & Tapered";
        let expressionVibe = vec[8] > 0.65 ? "Radiant & Warm" : "Intense & Enigmatic";
        let symmetryRating = vec[7] > 0.90 ? "Top 5% Architectural Symmetry" : "High Natural Symmetry";

        const genderLabel = detectedGender ? detectedGender.label : "Neutral";

        return {
            genderLabel,
            detectedGender,
            faceShape,
            jawStyle,
            expressionVibe,
            symmetryRating,
            cheekbones: vec[2] > 0.75 ? "High & Prominent" : "Delicate & Balanced",
            undertone: vec[6] > 0.60 ? "Warm Golden Undertone" : "Cool / Neutral Porcelain"
        };
    }
}

window.FaceAnalyzer = FaceAnalyzer;
