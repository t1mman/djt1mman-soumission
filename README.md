# **🎧 Portail de Soumission & Logistique — Dj T1mMan**

Portail web interactif pour la gestion des demandes de soumissions tarifaires et la collecte des feuilles de route logistiques pour les prestations de **Dj T1mMan**.  
**URL en ligne sur GitHub Pages :** [https://t1mman.github.io/djt1mman-soumission/](https://t1mman.github.io/djt1mman-soumission/)

## **⚡ Fonctionnalités clés**

### **1\. Soumission & Évaluation Tarifaire (Page 1\)**

> * Formulaire complet de contact avec courriel obligatoire et masque automatique du téléphone québécois (XXX) XXX-XXXX.  
> * Paramètres de manutention : ville/distance, type d'accès (rez-de-chaussée vs étage avec ascenseur/monte-charge).  
> * Sélection du matériel sonore et lumineux requis, ainsi que des services associés (animation, karaoké, diapo, quiz, jeux interactifs).  
> * Bouton de styles musicaux avec champ texte dynamique « Autre ».  
> * **Génération automatique d'un code de suivi unique** (format DJ-YYYYMMDD-XXXX).

### **2\. Feuille de Route Logistique & Déroulement (Page 2\)**

> * Synchronisation et pré-remplissage automatique des options choisies en soumission (ou chargement manuel par code de dossier).  
> * **Bloc Cérémonie conditionnel :** chansons d'entrée du cortège, marié, mariée, signature et rituels (affiché uniquement si coché en soumission).  
> * **Bloc Animation & Jeux conditionnel :** horaires et descriptifs des jeux 1, 2 et 3 (affiché uniquement si les jeux interactifs ou quiz ont été cochés).  
> * Prise en charge d'un lien vers une playlist partagée (Spotify, Apple Music, YouTube) et notes techniques.

### **3\. Sécurité & Envoi EmailJS**

> * Aucune clé d'API en clair dans le code source (lecture via import.meta.env et configuration dans .env.local / GitHub Secrets).  
> * Deux modèles de courriels distincts (Soumission et Logistique).

## **🛠️ Stack Technique**

> * **Framework :** React 19 \+ Vite  
> * **Déploiement :** GitHub Pages (gh-pages)  
> * **Envoi de courriels :** @emailjs/browser  
> * **Design :** Dark Glassmorphism avec accents néon jaune électrique (\#FFE600)

## **🚀 Installation & Développement Local**

### **1\. Cloner le projet**

`git clone https://github.com/t1mman/djt1mman-soumission.git`  
`cd djt1mman-soumission`

### **2\. Installer les dépendances**

`npm install`

### **3\. Configurer les variables d'environnement**

Créez un fichier .env.local à la racine du projet (ignoré par Git) :  
`VITE_EMAILJS_SERVICE_ID=votre_service_id`  
`VITE_EMAILJS_TEMPLATE_SOUMISSION=votre_template_id_soumission`  
`VITE_EMAILJS_TEMPLATE_LOGISTIQUE=votre_template_id_logistique`  
`VITE_EMAILJS_PUBLIC_KEY=votre_public_key`

### **4\. Lancer le serveur local**

`npm run dev`

## **🔄 Procédure de Synchronisation & Déploiement**

### **1\. Sauvegarder sur GitHub (branche main)**

`git status`  
`git add .`  
`git commit -m "Mise à jour: description de vos changements"`  
`git push origin main`

### **2\. Déployer en production sur GitHub Pages**

`npm run deploy`  
Cette commande exécute npm run build (compilation avec injection des variables d'environnement) puis pousse le dossier dist/ vers la branche gh-pages.

## **📬 Variables EmailJS utilisées**

| Variable | Description   |
| :---- | :---- |
| {{booking\_code}} | Code unique du dossier (ex: DJ-20260907-1234) |
| {{nom}} | Nom complet du client ou responsable |
| {{courriel}} | Adresse courriel du client (à utiliser dans Reply-To) |
| {{telephone}} | Numéro de téléphone formaté (XXX) XXX-XXXX |
| {{typeEvenement}} | Type d'événement (Mariage, Corpo, Party privé, etc.) |
| {{dateSouhaitee}} | Date prévue pour l'événement |
| {{lieuVille}} | Lieu et ville pour le calcul du transport |
| {{playlistPartagee}} | Lien vers la playlist (Spotify, Apple Music, YouTube) |
| {{ceremonieActive}} | Statut OUI/NON de l'option cérémonie |
| {{chansonEntreeMariee}} | Chanson d'entrée de la mariée |
| {{jeu1}}, {{jeu2}}, {{jeu3}} | Heures et descriptifs des blocs d'animation et jeux |

