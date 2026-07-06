# FountainCraft 🌊

A drag-and-drop 3D fountain design tool. Build custom fountains with water jets, lights, and decorative elements, then visualize them in real-time with 3D graphics and realistic water physics.

## ✨ Features

- **Drag & Drop Builder** - Grab parts from the sidebar and place them in your fountain
- **3D Visualization** - Real-time 3D preview with OrbitControls (rotate, zoom, pan)
- **Multiple Part Types**:
  - Bases (Round Pedestal, Square, Tiered, etc.)
  - Water Jets (Vertical, Arc, Spray)
  - Lights (RGB LED, Warm, Spotlight)
  - Decorations (Stone, Plants, etc.)
- **Environment Backgrounds** - Switch between Day, Night, Rain, Autumn, Forest, and White House settings
- **Save & Share** - (Coming soon: Save designs, export as JSON, share links)

## 🚀 Quick Start

### Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
  app/
    layout.tsx        - Root layout with metadata
    page.tsx          - Main page
    globals.css       - Global styles
  components/
    Canvas3D.tsx      - 3D scene renderer (Three.js)
    FountainBuilder.tsx - Main app component
    FountainScene.tsx  - Fountain parts renderer
    PartComponent.tsx  - Individual part 3D model
    PartsPalette.tsx  - Parts sidebar UI
    ControlPanel.tsx  - Play/Pause/Reset controls
  store.ts            - State management (Zustand)
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for R3F (lighting, controls, etc.)
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling

## 🎮 How to Use

1. **Add Parts** - Click any part in the left sidebar to add it to your fountain, or drag them
2. **Rotate View** - Click and drag in the 3D area to rotate the view
3. **Zoom** - Scroll to zoom in/out
4. **Change Background** - Use the background buttons in the sidebar
5. **Play** - Click the Play button in the top-right to animate the fountain
6. **Reset** - Clear all parts and start over

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub:
   ```bash
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Vercel will auto-detect Next.js and deploy automatically
5. Your site will be live at `fountain-engineering.vercel.app`

## 📦 What's Next

- [ ] Water physics simulation (particles, gravity, splash)
- [ ] Save/Load designs with user accounts
- [ ] Share designs via links
- [ ] Export as JSON/glTF
- [ ] More part variety (50+ total)
- [ ] Color picker for custom parts
- [ ] Mobile responsiveness
- [ ] Sound effects

## 🐛 Troubleshooting

**`npm install` fails with peer dependency errors:**
```bash
npm install --legacy-peer-deps
```

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**3D not rendering:**
- Make sure your browser supports WebGL
- Check browser console for errors (F12)
- Try a different browser

## 📝 License

Created with ❤️ by Claude

## 🤝 Contributing

Feel free to extend this project! Some ideas:
- Add more fountain base shapes
- Implement custom water colors
- Add particle physics for realistic water
- Create preset fountain designs
- Add music/sound effects

---

**Let's build some beautiful fountains!** 🎨💧
