# 🥬 VegHop - Vegetable Ordering System

> **Senior-friendly vegetable ordering and billing system with Hindi + English support**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://priyanshugusain2004.github.io/veghop2/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://pages.github.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)](https://web.dev/progressive-web-apps/)

## ✨ Features

### 🛒 Shopping Experience
- **Multi-user Support**: Independent shopping carts for multiple users
- **Smart Quantity Input**: Enter weights in grams (100g, 250g, 500g, 1kg)
- **Real-time Pricing**: Automatic price calculation based on weight
- **Visual Shopping**: Click vegetable images to add items
- **Cart Management**: View, edit, and checkout with detailed billing

### 🌐 Accessibility & Internationalization
- **Bilingual Interface**: Complete Hindi + English support
- **Senior-Friendly Design**: Large buttons, high contrast, simple navigation
- **Mobile-First**: Responsive design for all screen sizes
- **Offline Support**: PWA with service worker for offline access
- **Keyboard Navigation**: Full keyboard accessibility

### 🔧 Admin Panel
- **Daily Price Updates**: Easy price management interface
- **CSV Upload/Download**: Bulk price updates via CSV files
- **Persistent Storage**: Price changes saved locally
- **Secure Access**: Password-protected admin panel

## 🚀 Live Demo

**Try it now**: [https://priyanshugusain2004.github.io/veghop2/](https://priyanshugusain2004.github.io/veghop2/)

### 🔑 Admin Access
- Click the "Admin" button (top-right)
- Contact repository owner for admin password
- Update vegetable prices daily through the admin panel

## 💻 Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/priyanshugusain2004/veghop2.git
cd veghop2

# Start local server (Python 3)
python3 -m http.server 8000

# Or using Node.js
npx serve .

# Open in browser
open http://localhost:8000
```

### No Build Required! 🎉
This project uses:
- **React** via ES modules from CDN
- **Tailwind CSS** via CDN
- **Pure ES6** modules - no bundler needed
- **Static files** - deploy anywhere

## 📱 Progressive Web App (PWA)

### Features
- 📱 **Install on Mobile**: Add to home screen
- 🔄 **Offline Support**: Works without internet
- ⚡ **Fast Loading**: Service worker caching
- 🎨 **Native Feel**: Full-screen experience

### Install Instructions
1. Visit the live demo on mobile
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Install App"
4. Enjoy native-like experience!

## 🗂️ Project Structure

```
veghop2/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── _config.yml            # GitHub Pages config
├── src/
│   ├── main.js            # App entry point
│   ├── App.js             # Main app component
│   ├── context/
│   │   └── UserContext.js # State management
│   ├── components/
│   │   ├── UserSelection.js
│   │   ├── VegetableList.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── AdminLogin.js
│   │   └── AdminPanel.js
│   └── data/
│       └── vegetables.json # Default vegetable data
└── README.md
```

## 🔧 Admin Panel Usage

### Daily Price Updates
1. **Direct Editing**: Edit prices in the admin interface
2. **CSV Upload**: Bulk update using CSV files
3. **Export Current**: Download current prices as CSV

### CSV Format
```csv
id,price
tomato,45
potato,28
onion,35
carrot,65
capsicum,85
```

## 🌟 Use Cases

### 🏪 Small Grocery Stores
- Easy order taking from customers
- Quick billing with automatic calculations
- Multi-language support for diverse customers

### 🏘️ Local Vegetable Vendors
- Mobile-friendly for on-the-go use
- Simple interface for elderly customers
- Daily price management

### 👴 Senior Citizens
- Large, accessible interface
- Visual shopping with images
- Bilingual support (Hindi/English)

## 🚀 Deployment

### GitHub Pages (Current)
```bash
# Already configured! Just push to main branch
git add .
git commit -m "Update app"
git push origin main
```

### Other Platforms
```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir .

# Vercel
npm install -g vercel
vercel --prod

# Firebase
firebase init hosting
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **React Team** for the amazing library
- **Tailwind CSS** for the utility-first CSS framework
- **Unsplash** for the beautiful vegetable images
- **GitHub Pages** for free hosting

---

**Made with ❤️ for senior-friendly shopping**

🌐 **Live Demo**: [https://priyanshugusain2004.github.io/veghop2/](https://priyanshugusain2004.github.io/veghop2/)
