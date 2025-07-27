# Anchorman

> Quick and precise anchor point positioning for After Effects

A lightweight Script UI Panel that provides instant anchor point control with a clean 3×3 grid interface.

![Anchorman Preview](https://img.shields.io/badge/After%20Effects-Compatible-blue?style=flat-square&logo=adobe-after-effects)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

## ✨ Features

- **🎯 3×3 Grid Interface** - Click any position to instantly move anchor points
- **🔒 Keep Visual Position** - Maintains layer's screen position when anchor moves
- **📦 Batch Mode** - Apply changes to multiple selected layers simultaneously  
- **⏱️ Keyframe Support** - Add anchor point keyframes at current time
- **🎨 Clean UI** - Compact, professional interface with helpful tooltips
- **⚡ Lightweight** - Just 2 files (script + logo), no complex installation

## 🚀 Quick Start

### Installation

1. **Download** both `Anchorman.jsx` and `anchorman-logo.png` from this repository
2. **Copy both files** to your After Effects ScriptUI Panels folder:
   - **macOS**: `/Applications/Adobe After Effects [Version]/Scripts/ScriptUI Panels/`
   - **Windows**: `C:\Program Files\Adobe\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\`
3. **Restart** After Effects
4. **Access** via `Window > Anchorman.jsx`

**Note**: Both files must be in the same folder for the logo to display correctly.

### Usage

1. **Select layers** in your composition
2. **Configure options**:
   - ✅ **Keep visual position** (recommended)
   - ✅ **Batch mode** for multiple layers
3. **Click any grid position** to move anchor points:
   ```
   ┌─────┬─────┬─────┐
   │ ●   │  ●  │   ● │  Top
   ├─────┼─────┼─────┤
   │ ●   │  ●  │   ● │  Center  
   ├─────┼─────┼─────┤
   │ ●   │  ●  │   ● │  Bottom
   └─────┴─────┴─────┘
    Left  Center Right
   ```
4. **Add keyframes** with the "Keyframe Anchor Point" button

## 🎬 Compatibility

- **After Effects**: CC 2018 and later
- **OS**: Windows 10+ / macOS 10.14+
- **Layer Types**: Shape, Text, Footage, Composition layers

## 🛠️ Development

### Project Structure
```
anchorman/
├── Anchorman.jsx          # Main Script UI Panel
├── README.md              # Documentation
└── .gitignore            # Git ignore rules
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the After Effects community
- Inspired by the need for quick anchor point workflows
- Designed for simplicity and efficiency

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](../../issues).

---

**Made with ❤️ for After Effects artists** 