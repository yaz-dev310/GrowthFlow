# GrowthFlow

**Plateforme SaaS de gestion marketing destinée aux agences digitales**

GrowthFlow est un projet personnel de conception et de développement d'une interface web de gestion marketing. L'objectif est de proposer aux agences digitales un espace centralisé pour suivre leurs clients, organiser leurs campagnes, gérer leurs prospects et visualiser leurs performances.

Le projet est actuellement développé sous la forme d'une démonstration frontend interactive. Les données sont stockées localement dans le navigateur. L'intégration d'un backend, d'une API et d'une base de données fait partie des évolutions envisagées.

---

## 1. Présentation du projet

GrowthFlow cherche à simplifier le suivi de l'activité marketing d'une agence grâce à une interface centralisée, moderne et responsive.

### Objectifs principaux

- Centraliser les informations relatives aux clients.
- Organiser et suivre les campagnes marketing.
- Gérer les prospects et leur progression.
- Visualiser les indicateurs de performance.
- Consulter les activités et notifications.
- Personnaliser les informations de l'agence.
- Proposer une interface multilingue.

## 2. Fonctionnalités

### Tableau de bord

- Vue synthétique de l'activité.
- Indicateurs clés.
- Visualisation graphique des données.
- Suivi des activités récentes.

### Gestion des clients

- Consultation des clients.
- Organisation des informations clients.
- Suivi des données enregistrées dans l'application.

### Gestion des campagnes

- Consultation et suivi des campagnes marketing.
- Organisation des informations relatives aux campagnes.

### Gestion des prospects (Leads)

- Consultation des prospects.
- Suivi des informations et de leur évolution.

### Analytics

- Visualisation des données à travers des graphiques.
- Indicateurs permettant de suivre l'activité marketing.

### Notifications

- Consultation des notifications.
- Marquage comme lues.
- Suppression des notifications.
- Journalisation de certaines activités.

### Paramètres

- Gestion des informations de l'agence.
- Préférences de notification.
- Conservation des paramètres dans le navigateur.

### Authentification — pages Login et Register

GrowthFlow intègre deux interfaces dédiées à la gestion des accès :

**Login — Connexion**
- Interface de connexion utilisateur.
- Champs de saisie des identifiants.
- Structure frontend prévue pour transmettre les informations à un futur service d'authentification.
- Base d'intégration pour la gestion des réponses et erreurs renvoyées par le serveur.

**Register — Inscription**
- Interface de création de compte utilisateur.
- Champs destinés à recueillir les informations nécessaires à l'inscription.
- Structure frontend prévue pour communiquer avec une future API backend.
- Base d'intégration pour la création et l'enregistrement des comptes utilisateurs.

**Perspective d'intégration pour une entreprise**

Ces deux interfaces ont été conçues pour pouvoir être connectées à l'infrastructure backend d'une entreprise. Elles constituent une première base frontend pour une future mise en place de :

- Une API REST pour la connexion et l'inscription.
- Une base de données pour enregistrer les comptes utilisateurs.
- Un système sécurisé de gestion des mots de passe.
- Un mécanisme de gestion des sessions ou des tokens.
- Un système de rôles et de permissions.
- Un processus de récupération et de réinitialisation des mots de passe.

**État actuel :** les pages Login et Register sont des interfaces frontend de démonstration. Elles ne réalisent pas encore d'authentification réelle et ne communiquent pas avec un backend. Leur connexion à une API et leur sécurisation restent à développer.

## 3. Technologies utilisées

| Technologie | Utilisation |
|---|---|
| React | Construction de l'interface |
| TypeScript | Typage et fiabilité du code |
| Vite | Environnement de développement et build |
| Tailwind CSS v4 | Mise en forme et responsive design |
| React Router v7 | Navigation entre les pages |
| Recharts | Graphiques et visualisation des données |
| i18next | Gestion des traductions |
| react-i18next | Intégration des traductions dans React |
| lucide-react | Icônes |
| localStorage | Persistance locale des données |

## 4. Architecture du projet

```text
growthflow-react/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── fr.json
│   │       ├── en.json
│   │       ├── es.json
│   │       └── de.json
│   │
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   │
│   ├── pages/
│   │   ├── Overview.tsx
│   │   ├── Clients.tsx
│   │   ├── Campaigns.tsx
│   │   ├── Analytics.tsx
│   │   ├── Leads.tsx
│   │   └── Settings.tsx
│   │
│   ├── utils/
│   │   └── activityLogger.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .gitignore
└── README.md
```

### Rôle des principaux dossiers

- `auth/` : interfaces de connexion et d'inscription.
- `components/` : composants partagés, notamment l'en-tête et la barre latérale.
- `i18n/` : configuration du système de traduction et fichiers de langues.
- `layouts/` : structure générale des pages de l'application.
- `pages/` : écrans principaux de GrowthFlow.
- `utils/` : fonctions utilitaires, notamment la journalisation des activités.

## 5. Fonctionnement technique

### 5.1 Point d'entrée

Le fichier `src/main.tsx` constitue le point d'entrée de l'application React.

Il initialise l'application et charge notamment la configuration i18n avant le rendu de l'interface.

### 5.2 Navigation

Le fichier `src/App.tsx` configure la navigation avec React Router.

Les principales routes sont :

| Route | Page |
|---|---|
| `/login` | Connexion |
| `/register` | Inscription |
| `/` | Tableau de bord |
| `/clients` | Clients |
| `/campaigns` | Campagnes |
| `/analytics` | Analyses |
| `/leads` | Prospects |
| `/settings` | Paramètres |

Les pages sont chargées à la demande avec `React.lazy()` et `Suspense`. Cela permet de répartir le code en plusieurs fichiers JavaScript et de charger les pages lorsqu'elles sont nécessaires.

### 5.3 Layout principal

`DashboardLayout.tsx` fournit la structure commune de l'espace de gestion.

Il s'appuie notamment sur :

- `Sidebar.tsx` pour la navigation latérale.
- `Header.tsx` pour les éléments de navigation et les actions générales.
- Les pages affichées dans la zone principale.

### 5.4 Gestion des données

Dans la version actuelle, les données sont conservées dans le `localStorage` du navigateur.

Cela permet :

- De conserver certaines informations après actualisation.
- De retrouver les données sur le même navigateur.
- De réaliser une démonstration sans serveur backend.

Certaines modifications déclenchent également l'événement personnalisé `growthflow:data-updated`, utilisé pour actualiser les données affichées dans les différentes parties de l'interface.

**Limite actuelle :** les données ne sont pas synchronisées entre plusieurs utilisateurs ou appareils. Elles ne sont pas stockées sur un serveur centralisé.

### 5.5 Journalisation des activités

Le fichier `utils/activityLogger.ts` centralise certaines opérations liées à l'historique des activités et aux notifications.

Il permet notamment de signaler les changements afin que les composants concernés puissent actualiser leurs informations.

### 5.6 Internationalisation

GrowthFlow utilise `i18next` et `react-i18next`.

Les quatre langues disponibles sont :

- Français (`fr`)
- Anglais (`en`)
- Espagnol (`es`)
- Allemand (`de`)

Les traductions sont organisées dans `src/i18n/locales/`.

La langue sélectionnée est conservée dans le navigateur sous la clé `growthflow_language`.

## 6. Installation et lancement

### Prérequis

- Node.js
- npm
- Git (facultatif, pour cloner le dépôt)

### Récupérer le projet

```bash
git clone URL_DU_DEPOT
cd growthflow-react
```

Remplacer `URL_DU_DEPOT` par l'adresse réelle du dépôt GitHub.

### Installer les dépendances

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

Vite affiche ensuite l'adresse locale à ouvrir dans le navigateur, généralement :

`http://localhost:5173`

### Compiler le projet

```bash
npm run build
```

Les fichiers de production sont générés dans le dossier `dist/`.

### Vérifier le code

```bash
npm run lint
```

Cette commande lance les vérifications ESLint si le script correspondant est présent dans `package.json`.

## 7. Configuration et données

La version actuelle ne nécessite pas de serveur backend pour fonctionner.

Les données de démonstration et les préférences sont gérées côté navigateur.

Aucun fichier `.env` contenant des secrets ou des clés privées ne doit être publié sur GitHub.

## 8. État actuel et évolutions envisagées

### Fonctionnalités disponibles dans la démonstration

- Interface responsive.
- Tableau de bord.
- Gestion des clients, campagnes et prospects.
- Visualisation analytique.
- Notifications et activités.
- Paramètres de l'agence.
- Interface multilingue.
- Persistance locale des données.
- Chargement différé des pages.
- Interfaces de connexion et d'inscription prêtes à être étudiées pour une future intégration backend.

### Évolutions envisagées

- Développement d'une API backend.
- Mise en place d'une base de données.
- Connexion réelle des pages Login et Register.
- Authentification sécurisée.
- Gestion des rôles et permissions.
- Gestion de plusieurs agences et utilisateurs.
- Synchronisation des données entre appareils.
- Déploiement d'une véritable plateforme SaaS.

## 9. Contribution et utilisation

GrowthFlow est un projet personnel développé par Arouna Yazid Agnide Olawoumi.

Toute utilisation, reproduction, modification ou redistribution du code source nécessite l'autorisation préalable de son auteur.

Pour toute demande de collaboration ou d'utilisation, merci de contacter l'auteur.

## 10. Auteur

**Arouna Yazid Agnide Olawoumi**

Développeur Web | Étudiant en MSc Cybersécurité à EPITECH Nancy

Projet : GrowthFlow

---

*GrowthFlow — Centraliser, organiser et piloter l'activité marketing.*