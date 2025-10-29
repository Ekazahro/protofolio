# Firebase Setup Guide

## 🚀 Langkah-langkah Setup Firebase

### 1. Buat Firebase Project
1. Pergi ke [Firebase Console](https://console.firebase.google.com/)
2. Klik "Create a project" atau "Add project"
3. Masukkan nama project: `eka-portfolio` (atau nama lain)
4. Disable Google Analytics (optional untuk portfolio)
5. Klik "Create project"

### 2. Setup Firestore Database
1. Di Firebase Console, pilih "Firestore Database"
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi server (asia-southeast1 untuk Indonesia)
5. Klik "Done"

### 3. Setup Web App
1. Di Firebase Console, klik ikon web `</>`
2. Masukkan app nickname: `eka-portfolio-web`
3. **Jangan** centang "Firebase Hosting" (kita akan deploy ke Netlify)
4. Klik "Register app"
5. **COPY** konfigurasi Firebase yang muncul

### 4. Konfigurasi Environment Variables
1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` dan masukkan nilai dari Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=eka-portfolio.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=eka-portfolio
   VITE_FIREBASE_STORAGE_BUCKET=eka-portfolio.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 5. Install Firebase SDK
```bash
npm install firebase
```

### 6. Test Koneksi
1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka browser dan check console untuk error
3. Coba tambah project di Admin Dashboard
4. Check di Firebase Console > Firestore untuk melihat data

## 🔧 Firestore Collections Structure

Portfolio ini akan membuat collections berikut:

```
/projects
  - id (auto-generated)
  - title: string
  - description: string
  - technologies: array
  - liveUrl: string
  - githubUrl: string
  - image: string
  - createdAt: timestamp
  - updatedAt: timestamp

/skills
  /userSkills
    - skills: object
      - frontend: array
      - backend: array
      - tools: array
    - updatedAt: timestamp

/about
  /userAbout
    - title: string
    - description: string
    - updatedAt: timestamp

/messages
  - id (auto-generated)
  - name: string
  - email: string
  - subject: string
  - message: string
  - timestamp: string
  - createdAt: timestamp
```

## 🛡️ Security Rules (Production)

Untuk production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to portfolio data
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /about/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Messages can be written by anyone, read by authenticated users
    match /messages/{document} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## 🔄 Migration dari localStorage

Setelah Firebase setup selesai, jalankan migration:

1. Buka Admin Dashboard
2. Data localStorage akan otomatis dimigrate ke Firebase
3. Backup data lama dengan Export Data sebelum migration

## ⚠️ Troubleshooting

### Error: "Firebase config not found"
- Pastikan file `.env` ada dan berisi config yang benar
- Restart development server setelah edit `.env`

### Error: "Permission denied"
- Pastikan Firestore rules dalam "test mode"
- Check Firebase Console > Firestore > Rules

### Error: "Network error"
- Check koneksi internet
- Pastikan Firebase project aktif

## 🎯 Next Steps

Setelah Firebase setup:
1. ✅ Test CRUD operations di Admin Dashboard
2. ✅ Verify data sync across devices
3. ✅ Deploy to production hosting
4. ✅ Setup authentication untuk admin (optional)

## 📞 Support

Jika ada masalah setup Firebase, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
