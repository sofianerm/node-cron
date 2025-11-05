# 🚀 Déployer sur Render (GRATUIT)

## ❌ L'ERREUR QUE VOUS AVEZ EUE

```
Error: Cannot find module '/opt/render/project/src/dist/index.js'
```

**Pourquoi ?** Render essayait de lancer l'app comme une app Node.js classique, mais c'est **Next.js** !

---

## ✅ SOLUTION : Configuration correcte pour Render

### 📋 Dans Render Dashboard

1. **Allez sur votre service** qui a échoué
2. **Settings → Build & Deploy**
3. **Configurez exactement comme ceci :**

```
Build Command:
npm install && npm run build

Start Command:
npm run start
```

4. **Environment → Environment Variables**
   Ajoutez :
   ```
   NODE_VERSION = 20
   ```

5. **Cliquez "Manual Deploy" → "Deploy latest commit"**

---

## 🎯 OU : Recommencer depuis zéro (plus sûr)

1. **Supprimez l'ancien service** dans Render Dashboard

2. **Créez un nouveau Web Service**
   - Repository : `sofianerm/node-cron`
   - Branch : `claude/ultrathink-vision-011CUpqwpD7TgeRHez48qQQQ`

3. **Configurez :**
   ```
   Name: pdf-quote-filler
   Region: Oregon (US West)
   Branch: claude/ultrathink-vision-011CUpqwpD7TgeRHez48qQQQ
   Root Directory: (laissez vide)
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm run start
   Plan: Free
   ```

4. **Environment Variables :**
   ```
   NODE_VERSION = 20
   ```

5. **Cliquez "Create Web Service"**

---

## ⏱️ Temps de déploiement

- **Build** : ~3-5 minutes
- **Premier déploiement** : peut prendre jusqu'à 10 minutes

Soyez patient, c'est normal !

---

## 🎉 Résultat

Vous aurez une URL du type :
```
https://pdf-quote-filler.onrender.com
```

---

## 💡 Pourquoi ça marchait pas avant ?

Render cherchait `dist/index.js` parce qu'il pensait que c'était une app Node.js classique.

Mais Next.js fonctionne différemment :
- `npm run build` → Crée `.next/` (pas `dist/`)
- `npm run start` → Lance `next start` (pas `node dist/index.js`)

Maintenant c'est fixé ! ✅

---

## 🆘 Si ça échoue encore

Vérifiez les logs dans Render Dashboard :
1. Allez sur votre service
2. Cliquez "Logs"
3. Cherchez l'erreur exacte

Et envoyez-moi l'erreur, je vous aide ! 🚀
