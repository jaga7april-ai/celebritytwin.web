# ✨ CelebTwin AI — Celebrity Doppelgänger Finder

An interactive, futuristic web application that analyzes your photo or webcam selfie using biometric facial geometry and vector matching to discover your celebrity doppelgänger.

---

## 🚀 Quick Start

Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave):

- **Double-click:** `d:\celebrity-doppelganger\index.html`
- Or from PowerShell:
  ```powershell
  Start-Process "d:\celebrity-doppelganger\index.html"
  ```

---

## 🌟 Key Features

1. **Multiple Ways to Test:**
   - **Upload Photo:** Drag & drop any photo (JPG, PNG, WEBP), browse files, or simply press **Ctrl+V** to paste an image directly from your clipboard!
   - **Live Camera:** Snap a selfie directly in the browser with real-time facial guide oval, 3-second countdown, and flash shutter sound!
   - **1-Click Sample Faces:** Test right away with 4 diverse preloaded portrait samples (Alex, Maya, Liam, Elena) without needing an image on hand.

2. **Real Biometric Facial Geometry Extraction & AI Gender Identification (`faceAnalyzer.js`):**
   - **Automated Gender Detection:** Analyzes jaw width, brow ridge prominence, facial hair/shadow gradients, and cheekbone taper to automatically classify the photo's gender presentation with confidence metrics (e.g., *Female • 94% Confidence*).
   - **Smart Auto-Filtering:** Defaults to automatically matching you with celebrities corresponding to your detected gender, with manual override anytime.
   - **Face Bounds & Center of Mass Detection:** Detects skin cluster and isolates the face.
   - **Bilateral Symmetry Analysis:** Measures left vs right facial symmetry across midline.
   - **Jawline & Angularity Measurement:** Analyzes contour angles and width.
   - **Cheekbone Prominence & Forehead Proportions:** Evaluates facial structure ratios.
   - **Smile Curvature & Expression Aura:** Detects lips curvature and expression.
   - **12-Dimensional Vector Normalization:** Calculates standard vector metrics.

3. **High-Tech Animated Biometric HUD Scanner:**
   - Futuristic neon laser scan line sweeping across your photo.
   - Dynamic landmark tracking nodes and biometric wireframe mesh rendered in real-time on HTML5 canvas.
   - Sound FX powered by the Web Audio API (futuristic scan pulses, shutter snaps, triumphant fanfare).

4. **Interactive Match Results & Real Photo Comparison:**
   - **Bollywood & Kollywood Superstars Included:** Dedicated profiles for icons such as Rajinikanth, Thalapathy Vijay, Ajith Kumar, Suriya, Dhanush, Chiyaan Vikram, Kamal Haasan, Nayanthara, Samantha Ruth Prabhu, Trisha Krishnan, Sai Pallavi, Shah Rukh Khan, Hrithik Roshan, Ranbir Kapoor, Ranveer Singh, Deepika Padukone, Alia Bhatt, Priyanka Chopra, Katrina Kaif, Salman Khan, and Kiara Advani.
   - **Industry Filter:** Filter your search specifically by **Bollywood (Hindi Cinema)**, **Kollywood (Tamil Cinema)**, **Hollywood**, **Music Icons**, or **All Industries**.
   - **Authentic Celebrity Photography:** Compare your photo side-by-side with high-resolution, real photographic portraits of global cinema icons.
   - **Real Photos vs. Stylized Art Toggle:** Switch between authentic photographic portraits and stylized vector art with one click via the top bar button.
   - **Interactive Before/After Split Curtain Slider:** Drag the handle left or right to seamlessly wipe between your face and the real celebrity's face!
   - **Feature Breakdown:** Individual similarity percentages for Eyes & Brow, Jawline, Cheekbones, and Smile.
   - **Facial Geometry Radar / Spider Chart:** 5-axis visualization of your facial geometry vs your celebrity twin.
   - **Biometric Traits Profile:** Human-readable descriptors (Face shape, jaw definition, symmetry score, undertone).
   - **Runner-Up Doppelgängers:** 2nd, 3rd, and 4th place matches that can be clicked to swap to the main spotlight!

5. **VIP Doppelgänger Card & Sharing:**
   - **Download VIP Doppelgänger Card:** Generates a high-definition certified card with your photo, celebrity photo, gold match seal, traits, and barcode stamp as a PNG image!
   - **Share Result:** 1-click sharing via Native Web Share API or automatic clipboard copy.

6. **Privacy First:**
   - **100% Client-Side:** All image processing and analysis happens locally in your browser's canvas. No photos are ever uploaded to any cloud server or third party.

---

## 📁 File Structure

```text
celebrity-doppelganger/
├── index.html        # Main application layout and interface
├── style.css         # Modern dark cyberpunk & luxury styling
├── app.js            # UI interactions, camera, slider & card generator
├── faceAnalyzer.js   # Biometric computer vision & vector matching engine
├── celebrities.js    # Curated celebrity database with vector baselines & SVG avatars
├── sampleFaces.js    # Preloaded sample faces for 1-click testing
├── soundFx.js        # Pure Web Audio API sound synthesizer
└── README.md         # Documentation & guide
```
