import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// Lecture des clés depuis les variables d'environnement (GitHub Secrets / .env.local)
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_SOUMISSION: import.meta.env.VITE_EMAILJS_TEMPLATE_SOUMISSION || '',
  TEMPLATE_LOGISTIQUE: import.meta.env.VITE_EMAILJS_TEMPLATE_LOGISTIQUE || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
};

// Date du jour par défaut (format YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Génération du code dossier style MOTJAW
const generateBookingCode = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `DJ-${dateStr}-${randomSuffix}`;
};

export default function DjSubmissionPortal() {
  const [currentPage, setCurrentPage] = useState('soumission'); // 'soumission' | 'logistique'
  const [isSending, setIsSending] = useState(false);
  const [activeBookingCode, setActiveBookingCode] = useState('');
  const [soumissionSentSuccess, setSoumissionSentSuccess] = useState(false);
  const [logistiqueSentSuccess, setLogistiqueSentSuccess] = useState(false);
  const [codeSearchInput, setCodeSearchInput] = useState('');

  // État global synchronisé
  const [form, setForm] = useState({
    bookingCode: '',

    // --- PAGE 1 : SOUMISSION & FIXATION DU PRIX ---
    nom: '',
    courriel: '',
    telephone: '',
    typeEvenement: 'mariage',
    nbPersonnes: '50-100', // Par défaut 50-100
    dateSouhaitee: getTodayDate(), // Par défaut aujourd'hui
    heureDebut: '17:00',
    dureePrevue: '4 heures',

    // Lieu & Accès
    lieuVille: '',
    etageType: 'rdc', // 'rdc' | 'etage'
    ascenseurPresent: false,

    // Matériel requis
    materiel: {
      audio: true,
      eclairage: true,
      microEtTrepie: false,
      affichage: false,
      autre: false
    },
    materielAutreDetail: '',

    // Services requis
    services: {
      dj: true,
      animation: false,
      karaoke: false,
      affichageParoles: false,
      diapo: false,
      effetsVisuels: false,
      jeuxInteractifs: false,
      quiz: false,
      presentation: false
    },

    // Blocs de temps requis
    tempsRequis: {
      ceremonie: false,
      souper: false,
      soireeUniquement: true,
      autre: false
    },
    tempsRequisAutreDetail: '',

    // Styles musicaux
    stylesMusicaux: [''],
    autreStyleMusical: '',

    // --- PAGE 2 : LOGISTIQUE & DÉROULEMENT ---
    playlistPartagee: '',
    ceremonieDetails: {
      heureCeremonie: '15:30',
      chansonEntreeCortege: '',
      chansonEntreeMarie: '',
      chansonEntreeMariee: '',
      chansonSignature: '',
      chansonSortie: '',
      autreMusiqueCeremonie: ''
    },
    horairesLogistique: {
      heureSouper: '18:30',
      premiereDanseTitre: '',
      heureJeu1: '19:30',
      descJeu1: '',
      heureJeu2: '20:15',
      descJeu2: '',
      heureJeu3: '21:00',
      descJeu3: ''
    },
    notesLogistique: ''
  });

  // Masquage et formatage automatique du téléphone québécois (XXX) XXX-XXXX
const handlePhoneChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 10) digits = digits.slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }
    setForm({ ...form, telephone: formatted });
  };

  const handleCheckboxChange = (category, item) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  const handleStyleToggle = (style) => {
    setForm((prev) => {
      const exists = prev.stylesMusicaux.includes(style);
      return {
        ...prev,
        stylesMusicaux: exists
          ? prev.stylesMusicaux.filter((s) => s !== style)
          : [...prev.stylesMusicaux, style]
      };
    });
  };

  const availableStyles = [
    'Nu-Metal, emo, Punk',
    'Dance / EDM / Club',
    'Hip-Hop & R&B',
    'Top 40 / Pop',
    'Rock / Classic Rock',
    'Années 80 / 90s',
    'Classiques Québécois',
    'Latino / Reggaeton',
    'Country / Folk',
    'Lounge / Cocktail / Jazz',
    'Autre'
  ];

  // ENVOI DE LA SOUMISSION (PAGE 1)
  const handleSendSoumission = async (e) => {
    e.preventDefault();
 if (!form.nom || !form.courriel) {
    alert('Veuillez compléter au moins votre nom et votre adresse courriel.');
    return;
  }

    const newCode = activeBookingCode || generateBookingCode();
    setActiveBookingCode(newCode);

    const updatedForm = {
      ...form,
      bookingCode: newCode
    };
    setForm(updatedForm);

    // Sauvegarde dans le localStorage
    localStorage.setItem(`djt1mman_${newCode}`, JSON.stringify(updatedForm));

    setIsSending(true);

    const emailParams = {
      booking_code: newCode,
    nom: updatedForm.nom,
    courriel: updatedForm.courriel,
    telephone: updatedForm.telephone || 'Non renseigné',
      typeEvenement: updatedForm.typeEvenement,
      nbPersonnes: updatedForm.nbPersonnes,
      dateSouhaitee: updatedForm.dateSouhaitee,
      heureDebut: updatedForm.heureDebut,
      dureePrevue: updatedForm.dureePrevue,
      lieuVille: updatedForm.lieuVille,
      etageType: updatedForm.etageType,
      ascenseurPresent: updatedForm.ascenseurPresent ? 'Oui' : 'Non',
      materiel: Object.keys(updatedForm.materiel).filter((k) => updatedForm.materiel[k]).join(', ') +
        (updatedForm.materiel.autre ? ` (${updatedForm.materielAutreDetail})` : ''),
      services: Object.keys(updatedForm.services).filter((k) => updatedForm.services[k]).join(', '),
      tempsRequis: Object.keys(updatedForm.tempsRequis).filter((k) => updatedForm.tempsRequis[k]).join(', ') +
        (updatedForm.tempsRequis.autre ? ` (${updatedForm.tempsRequisAutreDetail})` : ''),
      stylesMusicaux: updatedForm.stylesMusicaux.filter(Boolean).join(', ') +
        (updatedForm.autreStyleMusical ? ` [Autre: ${updatedForm.autreStyleMusical}]` : '')
    };

    try {
      if (EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_SOUMISSION) {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_SOUMISSION,
          emailParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );
      } else {
        console.warn("Variables EmailJS manquantes. Données simulées :", emailParams);
        await new Promise((r) => setTimeout(r, 800));
      }
      setSoumissionSentSuccess(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi EmailJS :", err);
      alert("Une erreur est survenue lors de l'envoi de la soumission. Veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  // CHARGER UN DOSSIER AVEC UN CODE EXISTANT
  const handleLoadBookingCode = () => {
    const cleanCode = codeSearchInput.trim().toUpperCase();
    if (!cleanCode) return;

    const saved = localStorage.getItem(`djt1mman_${cleanCode}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm(parsed);
      setActiveBookingCode(parsed.bookingCode);
      alert(`Dossier ${parsed.bookingCode} chargé avec succès !`);
    } else {
      alert(`Aucun dossier local trouvé avec le code "${cleanCode}".`);
    }
  };

  // ENVOI DE LA FEUILLE DE ROUTE LOGISTIQUE (PAGE 2)
  const handleSendLogistique = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const emailParams = {
      booking_code: activeBookingCode || form.bookingCode || 'NON_SPÉCIFIÉ',
      nom: updatedForm.nom,
      courriel: updatedForm.courriel,
      telephone: updatedForm.telephone || 'Non renseigné',
      dateSouhaitee: form.dateSouhaitee,
      playlistPartagee: form.playlistPartagee,
      ceremonieActive: form.tempsRequis.ceremonie ? 'OUI' : 'NON',
      heureCeremonie: form.ceremonieDetails.heureCeremonie,
      chansonEntreeCortege: form.ceremonieDetails.chansonEntreeCortege,
      chansonEntreeMarie: form.ceremonieDetails.chansonEntreeMarie,
      chansonEntreeMariee: form.ceremonieDetails.chansonEntreeMariee,
      chansonSignature: form.ceremonieDetails.chansonSignature,
      autreMusiqueCeremonie: form.ceremonieDetails.autreMusiqueCeremonie,
      heureSouper: form.horairesLogistique.heureSouper,
      premiereDanseTitre: form.horairesLogistique.premiereDanseTitre,
      jeu1: `${form.horairesLogistique.heureJeu1} - ${form.horairesLogistique.descJeu1}`,
      jeu2: `${form.horairesLogistique.heureJeu2} - ${form.horairesLogistique.descJeu2}`,
      jeu3: `${form.horairesLogistique.heureJeu3} - ${form.horairesLogistique.descJeu3}`,
      notesLogistique: form.notesLogistique
    };

    try {
      if (EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_LOGISTIQUE) {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_LOGISTIQUE,
          emailParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );
      } else {
        console.warn("Variables EmailJS manquantes. Données simulées :", emailParams);
        await new Promise((r) => setTimeout(r, 800));
      }

      if (activeBookingCode) {
        localStorage.setItem(`djt1mman_${activeBookingCode}`, JSON.stringify(form));
      }
      setLogistiqueSentSuccess(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi logistique :", err);
      alert("Une erreur est survenue lors de l'envoi de la feuille de route.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* En-tête avec Logo DJ */}
        <div style={styles.headerContainer}>
          <div style={styles.logoWrapper}>
            <img
              src="./MicHoldingYellow.png"
              alt="Dj T1mMan Logo"
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span style={styles.badge}>PORTAIL DJ & ÉVÉNEMENTIEL</span>
          <h1 style={styles.brandTitle}>Dj T1mMan</h1>

          {activeBookingCode && (
            <div style={{ marginTop: '10px' }}>
              <span style={{ ...styles.badge, backgroundColor: 'rgba(255, 230, 0, 0.25)', color: '#fff' }}>
                DOSSIER : <strong>{activeBookingCode}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Navigation entre les deux onglets */}
        <div style={styles.navBar}>
          <button
            type="button"
            onClick={() => setCurrentPage('soumission')}
            style={{
              ...styles.navTab,
              borderBottomColor: currentPage === 'soumission' ? '#FFE600' : 'transparent',
              color: currentPage === 'soumission' ? '#FFE600' : '#94a3b8'
            }}
          >
            1. Soumission & Éléments de Prix
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('logistique')}
            style={{
              ...styles.navTab,
              borderBottomColor: currentPage === 'logistique' ? '#FFE600' : 'transparent',
              color: currentPage === 'logistique' ? '#FFE600' : '#94a3b8'
            }}
          >
            2. Logistique & Déroulement
          </button>
        </div>

        {/* ============================================================== */}
        {/* PAGE 1 : SOUMISSION & CALCUL DU PRIX                           */}
        {/* ============================================================== */}
        {currentPage === 'soumission' && (
          <div>
            {soumissionSentSuccess ? (
              <div style={styles.successBox}>
                <div style={styles.checkIcon}>✓</div>
                <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '8px' }}>
                  Soumission Envoyée avec Succès !
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  Votre demande a bien été transmise. Votre numéro de dossier unique est :
                </p>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  color: '#FFE600',
                  margin: '16px 0',
                  letterSpacing: '1px'
                }}>
                  {activeBookingCode}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Vos choix sont enregistrés. Vous pouvez maintenant configurer le déroulement et les choix musicaux.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    style={styles.btnSecondary}
                    onClick={() => setSoumissionSentSuccess(false)}
                  >
                    Modifier ma soumission
                  </button>
                  <button
                    type="button"
                    style={styles.btnPrimary}
                    onClick={() => {
                      setSoumissionSentSuccess(false);
                      setCurrentPage('logistique');
                    }}
                  >
                    Compléter la Logistique maintenant →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendSoumission}>
                <h2 style={styles.pageTitle}>Demande de Soumission</h2>
                <p style={styles.pageSubtitle}>
                  Veuillez spécifier la logistique, la distance et les options requises pour l'établissement du prix.
                </p>

                {/* 1. Informations client */}
                <div style={styles.section}>
                <h3 style={styles.sectionHeading}>Coordonnées du client</h3>
                <div style={styles.grid2}>
                    <div>
                    <label style={styles.label}>Nom complet / Responsable *</label>
                    <input
                        type="text"
                        required
                        placeholder="ex: Jean Tremblay"
                        style={styles.input}
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    />
                    </div>

                    <div>
                    <label style={styles.label}>Adresse courriel *</label>
                    <input
                        type="email"
                        required
                        placeholder="nom@exemple.com"
                        style={styles.input}
                        value={form.courriel}
                        onChange={(e) => setForm({ ...form, courriel: e.target.value })}
                    />
                    </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                    <label style={styles.label}>Numéro de téléphone</label>
                    <input
                    type="tel"
                    placeholder="(418) 555-0199"
                    style={styles.input}
                    value={form.telephone}
                    onChange={handlePhoneChange}
                    />
                </div>
                </div>

                {/* 2. Événement & Horaires */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>L'Événement & Temps prévu</h3>
                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Type d'événement</label>
                      <select
                        style={styles.select}
                        value={form.typeEvenement}
                        onChange={(e) => setForm({ ...form, typeEvenement: e.target.value })}
                      >
                        <option value="mariage">Mariage</option>
                        <option value="corpo">Événement Corporatif / Gala</option>
                        <option value="party-prive">Party privé</option>
                        <option value="anniversaire">Anniversaire</option>
                        <option value="bal-scolaire">Bal / Soirée scolaire</option>
                        <option value="autre">Autre événement</option>
                      </select>
                    </div>

                    <div>
                      <label style={styles.label}>Nombre de personnes</label>
                      <select
                        style={styles.select}
                        value={form.nbPersonnes}
                        onChange={(e) => setForm({ ...form, nbPersonnes: e.target.value })}
                      >
                        <option value="moins-50">Moins de 50</option>
                        <option value="50-100">50 - 100 personnes (Défaut)</option>
                        <option value="100-200">100 - 200 personnes</option>
                        <option value="200-350">200 - 350 personnes</option>
                        <option value="350+">350 personnes et plus</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.grid3}>
                    <div>
                      <label style={styles.label}>Date souhaitée</label>
                      <input
                        type="date"
                        required
                        style={styles.input}
                        value={form.dateSouhaitee}
                        onChange={(e) => setForm({ ...form, dateSouhaitee: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Heure de début</label>
                      <input
                        type="time"
                        style={styles.input}
                        value={form.heureDebut}
                        onChange={(e) => setForm({ ...form, heureDebut: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Durée prévue</label>
                      <select
                        style={styles.select}
                        value={form.dureePrevue}
                        onChange={(e) => setForm({ ...form, dureePrevue: e.target.value })}
                      >
                        <option value="4 heures">4 heures (Défaut)</option>
                        <option value="5 heures">5 heures</option>
                        <option value="6 heures">6 heures</option>
                        <option value="7 heures">7 heures</option>
                        <option value="8 heures">8 heures</option>
                        <option value="Journée complète">Journée complète (10h+)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Lieu & Accès / Étages */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Lieu & Manutention</h3>
                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Lieu / Ville (pour le calcul du déplacement)</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Manoir Montmorency, Québec"
                        style={styles.input}
                        value={form.lieuVille}
                        onChange={(e) => setForm({ ...form, lieuVille: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Accès de livraison / Emplacement de la salle</label>
                      <select
                        style={styles.select}
                        value={form.etageType}
                        onChange={(e) => setForm({ ...form, etageType: e.target.value })}
                      >
                        <option value="rdc">Rez-de-chaussée (Plain-pied / Accès facile)</option>
                        <option value="etage">Sur un étage (Présence d'escaliers)</option>
                      </select>
                    </div>
                  </div>

                  {form.etageType === 'etage' && (
                    <div style={styles.subOptionBox}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.ascenseurPresent}
                          onChange={(e) => setForm({ ...form, ascenseurPresent: e.target.checked })}
                          style={styles.checkbox}
                        />
                        <span>Ascenseur / Monte-charge accessible pour le transport du matériel</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* 4. Temps Requis */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Temps & Moments requis</h3>
                  <div style={styles.checkboxGroup}>
                    {[
                      { key: 'ceremonie', label: 'Cérémonie' },
                      { key: 'souper', label: 'Cocktail / Souper' },
                      { key: 'soireeUniquement', label: 'Soirée dansante uniquement' },
                      { key: 'autre', label: 'Autre bloc horaire' }
                    ].map(({ key, label }) => (
                      <label key={key} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.tempsRequis[key]}
                          onChange={() => handleCheckboxChange('tempsRequis', key)}
                          style={styles.checkbox}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  {form.tempsRequis.autre && (
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder="Précisez le temps ou le bloc horaire particulier..."
                        style={styles.input}
                        value={form.tempsRequisAutreDetail}
                        onChange={(e) => setForm({ ...form, tempsRequisAutreDetail: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* 5. Matériel requis */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Matériel requis</h3>
                  <div style={styles.checkboxGroup}>
                    {[
                      { key: 'audio', label: 'Audio (Système de son / Hauts-parleurs & Subs)' },
                      { key: 'eclairage', label: 'Éclairage (Piste de danse & Ambiance)' },
                      { key: 'microEtTrepie', label: 'Micro et trépieds' },
                      { key: 'affichage', label: 'Affichage (Écran, téléviseur ou projecteur)' },
                      { key: 'autre', label: 'Autre équipement' }
                    ].map(({ key, label }) => (
                      <label key={key} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.materiel[key]}
                          onChange={() => handleCheckboxChange('materiel', key)}
                          style={styles.checkbox}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  {form.materiel.autre && (
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder="Précisez le matériel particulier requis..."
                        style={styles.input}
                        value={form.materielAutreDetail}
                        onChange={(e) => setForm({ ...form, materielAutreDetail: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* 6. Services requis */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Services requis</h3>
                  <div style={styles.checkboxGroupGrid}>
                    {[
                      { key: 'dj', label: 'DJ' },
                      { key: 'animation', label: 'Animation' },
                      { key: 'karaoke', label: 'Karaoké' },
                      { key: 'affichageParoles', label: 'Affichage des paroles' },
                      { key: 'diapo', label: 'Diapo (Diaporama)' },
                      { key: 'effetsVisuels', label: 'Effets visuels' },
                      { key: 'jeuxInteractifs', label: 'Jeux interactifs' },
                      { key: 'quiz', label: 'Quiz' },
                      { key: 'presentation', label: 'Présentation' }
                    ].map(({ key, label }) => (
                      <label key={key} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.services[key]}
                          onChange={() => handleCheckboxChange('services', key)}
                          style={styles.checkbox}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. Styles Musicaux */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Styles musicaux souhaités</h3>

                  <div style={styles.tagGrid}>
                    {availableStyles.map((style) => {
                      const selected = form.stylesMusicaux.includes(style);
                      return (
                        <button
                          type="button"
                          key={style}
                          onClick={() => handleStyleToggle(style)}
                          style={{
                            ...styles.tagBtn,
                            borderColor: selected ? '#FFE600' : 'rgba(255,255,255,0.15)',
                            backgroundColor: selected ? 'rgba(255, 230, 0, 0.18)' : 'rgba(255,255,255,0.04)',
                            color: selected ? '#FFE600' : '#cbd5e1'
                          }}
                        >
                          {style} {selected && '✓'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Champ conditionnel si 'Autre' est sélectionné */}
                  {form.stylesMusicaux.includes('Autre') && (
                    <div style={{ marginTop: '12px' }}>
                      <label style={styles.label}>Précisez vos autres styles ou préférences :</label>
                      <input
                        type="text"
                        style={styles.input}
                        placeholder="ex: Trad, Métal symphonique, Afrobeat, Disco 70s..."
                        value={form.autreStyleMusical}
                        onChange={(e) => setForm({ ...form, autreStyleMusical: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div style={styles.btnRowRight}>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="dj-btn-submit"
                  >
                    {isSending ? 'Transmission en cours...' : 'Envoyer la soumission (Générer le code) ✓'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 2 : LOGISTIQUE DÉTAILLÉE                                  */}
        {/* ============================================================== */}
        {currentPage === 'logistique' && (
          <div>
            {logistiqueSentSuccess ? (
              <div style={styles.successBox}>
                <div style={styles.checkIcon}>✓</div>
                <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '8px' }}>
                  Feuille de Route Transmise !
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  Les détails logistiques pour le dossier <strong>{activeBookingCode || form.bookingCode}</strong> ont bien été envoyés.
                </p>
                <button
                  type="button"
                  style={{ ...styles.btnSecondary, marginTop: '20px' }}
                  onClick={() => setLogistiqueSentSuccess(false)}
                >
                  Modifier les détails
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendLogistique}>
                <h2 style={styles.pageTitle}>Logistique & Déroulement</h2>
                <p style={styles.pageSubtitle}>
                  Précisez le timing exact et les moments musicaux clés. Les éléments sélectionnés en soumission sont pré-remplis ci-dessous.
                </p>

                {/* Zone de chargement d'un code existant */}
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px dashed rgba(255,255,255,0.15)',
                  marginBottom: '26px'
                }}>
                  <label style={styles.label}>Entrez ici votre code de dossier DJ-########-#### </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="ex: DJ-20260907-1234"
                      value={codeSearchInput}
                      onChange={(e) => setCodeSearchInput(e.target.value)}
                    />
                    <button
                      type="button"
                      style={styles.btnSecondary}
                      onClick={handleLoadBookingCode}
                    >
                      Charger
                    </button>
                  </div>
                </div>

                {/* Playlist partagée */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Playlist Partagée & Inspiration</h3>
                  <label style={styles.label}>Lien vers une playlist (Spotify, Apple Music, YouTube)</label>
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/playlist/..."
                    style={styles.input}
                    value={form.playlistPartagee}
                    onChange={(e) => setForm({ ...form, playlistPartagee: e.target.value })}
                  />
                </div>

                {/* Bloc Cérémonie si coché en page 1 */}
                {form.tempsRequis.ceremonie && (
                  <div style={styles.ceremonieCard}>
                    <div style={styles.badgeCeremonie}>OPTION CÉRÉMONIE ACTIVE</div>
                    <h3 style={styles.sectionHeading}>Chansons de la Cérémonie</h3>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={styles.label}>Heure de début de la cérémonie</label>
                      <input
                        type="time"
                        style={styles.input}
                        value={form.ceremonieDetails.heureCeremonie}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            ceremonieDetails: { ...form.ceremonieDetails, heureCeremonie: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div style={styles.grid2}>
                      <div>
                        <label style={styles.label}>Entrée du cortège (Chanson / Artiste)</label>
                        <input
                          type="text"
                          placeholder="ex: Pachelbel - Canon in D"
                          style={styles.input}
                          value={form.ceremonieDetails.chansonEntreeCortege}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              ceremonieDetails: { ...form.ceremonieDetails, chansonEntreeCortege: e.target.value }
                            })
                          }
                        />
                      </div>
                      <div>
                        <label style={styles.label}>Entrée du marié (Chanson / Artiste)</label>
                        <input
                          type="text"
                          placeholder="ex: Titre spécifique ou cortège"
                          style={styles.input}
                          value={form.ceremonieDetails.chansonEntreeMarie}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              ceremonieDetails: { ...form.ceremonieDetails, chansonEntreeMarie: e.target.value }
                            })
                          }
                        />
                      </div>
                    </div>

                    <div style={styles.grid2}>
                      <div>
                        <label style={styles.label}>Entrée de la mariée (Chanson / Artiste)</label>
                        <input
                          type="text"
                          placeholder="ex: Can't Help Falling In Love"
                          style={styles.input}
                          value={form.ceremonieDetails.chansonEntreeMariee}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              ceremonieDetails: { ...form.ceremonieDetails, chansonEntreeMariee: e.target.value }
                            })
                          }
                        />
                      </div>
                      <div>
                        <label style={styles.label}>Signature / Sortie des mariés</label>
                        <input
                          type="text"
                          placeholder="ex: Stevie Wonder - Signed, Sealed, Delivered"
                          style={styles.input}
                          value={form.ceremonieDetails.chansonSignature}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              ceremonieDetails: { ...form.ceremonieDetails, chansonSignature: e.target.value }
                            })
                          }
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <label style={styles.label}>Autre moment ou musique de cérémonie</label>
                      <input
                        type="text"
                        placeholder="ex: Musique pendant le rituel du sable, lampion..."
                        style={styles.input}
                        value={form.ceremonieDetails.autreMusiqueCeremonie}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            ceremonieDetails: { ...form.ceremonieDetails, autreMusiqueCeremonie: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Déroulement et heures (Souper, Danse, Jeux 1, 2, 3) */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Heures des moments clés & Jeux</h3>

                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Heure du souper / Cocktail</label>
                      <input
                        type="time"
                        style={styles.input}
                        value={form.horairesLogistique.heureSouper}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            horairesLogistique: { ...form.horairesLogistique, heureSouper: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Première danse / Danse d'ouverture</label>
                      <input
                        type="text"
                        placeholder="ex: 21h15 - Ed Sheeran (Perfect)"
                        style={styles.input}
                        value={form.horairesLogistique.premiereDanseTitre}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            horairesLogistique: { ...form.horairesLogistique, premiereDanseTitre: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Blocs Jeux 1, 2, 3 (Affichés UNIQUEMENT si "Jeux interactifs" ou "Quiz" est coché en soumission) */}
                    {(form.services.jeuxInteractifs || form.services.quiz) && (
                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(255, 230, 0, 0.25)' }}>
                        <div style={styles.badgeCeremonie}>OPTION JEUX & ANIMATION ACTIVE</div>
                        <h4 style={{ color: '#FFE600', margin: '10px 0 14px 0', fontSize: '1.05rem' }}>
                        Animation des jeux & moments interactifs
                        </h4>
                        
                        <div style={styles.grid3}>
                        <div>
                            <label style={styles.label}>Jeu 1 (Heure)</label>
                            <input
                            type="time"
                            style={styles.input}
                            value={form.horairesLogistique.heureJeu1}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                horairesLogistique: { ...form.horairesLogistique, heureJeu1: e.target.value }
                                })
                            }
                            />
                            <input
                            type="text"
                            placeholder="Nom/Description (ex: Jeu des souliers)"
                            style={{ ...styles.input, marginTop: '6px' }}
                            value={form.horairesLogistique.descJeu1}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                horairesLogistique: { ...form.horairesLogistique, descJeu1: e.target.value }
                                })
                            }
                            />
                        </div>

                        <div>
                            <label style={styles.label}>Jeu 2 (Heure)</label>
                            <input
                            type="time"
                            style={styles.input}
                            value={form.horairesLogistique.heureJeu2}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                horairesLogistique: { ...form.horairesLogistique, heureJeu2: e.target.value }
                                })
                            }
                            />
                            <input
                            type="text"
                            placeholder="Nom/Description (ex: Quiz musical)"
                            style={{ ...styles.input, marginTop: '6px' }}
                            value={form.horairesLogistique.descJeu2}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                horairesLogistique: { ...form.horairesLogistique, descJeu2: e.target.value }
                                })
                            }
                            />
                        </div>

                        <div>
                            <label style={styles.label}>Jeu 3 (Heure)</label>
                            <input
                            type="time"
                            style={styles.input}
                            value={form.horairesLogistique.heureJeu3}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                horairesLogistique: { ...form.horairesLogistique, heureJeu3: e.target.value }
                                })
                            }
                            />
                            <input
                            type="text"
                            placeholder="Nom/Description (ex: Bouquet / Jarretière)"
                            style={{ ...styles.input, marginTop: '6px' }}
                            value={form.horairesLogistique.descJeu3}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                horairesLogistique: { ...form.horairesLogistique, descJeu3: e.target.value }
                                })
                            }
                            />
                        </div>
                        </div>
                    </div>
                    )}
                  </div>

                {/* Notes logistiques additionnelles */}
                <div style={styles.section}>
                  <label style={styles.label}>Instructions particulières ou logistique additionnelle</label>
                  <textarea
                    rows={4}
                    placeholder="Accès débarcadère, particularités électriques, personnes à contacter sur place, etc."
                    style={styles.textarea}
                    value={form.notesLogistique}
                    onChange={(e) => setForm({ ...form, notesLogistique: e.target.value })}
                  />
                </div>

                <div style={styles.btnRow}>
                  <button
                    type="button"
                    style={styles.btnSecondary}
                    onClick={() => setCurrentPage('soumission')}
                  >
                    ← Revenir à la Soumission
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="dj-btn-submit"
                  >
                    {isSending ? 'Transmission en cours...' : 'Envoyer ma Soumission & Logistique ✓'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles complets
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0d14',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 230, 0, 0.08) 0%, transparent 70%)',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '820px',
    backgroundColor: 'rgba(15, 20, 31, 0.88)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '36px',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '26px',
    textAlign: 'center'
  },
  logoWrapper: {
    width: '115px',
    height: '115px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #FFE600',
    boxShadow: '0 0 25px rgba(255, 230, 0, 0.35)',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: '900',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: '8px 0 0 0',
    textShadow: '0 0 16px rgba(255, 230, 0, 0.3)'
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: '800',
    letterSpacing: '1.5px',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 230, 0, 0.12)',
    color: '#FFE600',
    border: '1px solid rgba(255, 230, 0, 0.35)'
  },
  navBar: {
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '28px'
  },
  navTab: {
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    padding: '12px 18px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  pageTitle: {
    color: '#f8fafc',
    fontSize: '1.65rem',
    fontWeight: '800',
    margin: '0 0 6px 0'
  },
  pageSubtitle: {
    color: '#94a3b8',
    fontSize: '0.92rem',
    margin: '0 0 24px 0',
    lineHeight: '1.5'
  },
  section: {
    marginBottom: '26px'
  },
  sectionHeading: {
    color: '#e2e8f0',
    fontSize: '1.15rem',
    fontWeight: '700',
    margin: '0 0 14px 0',
    borderLeft: '3px solid #FFE600',
    paddingLeft: '10px'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '12px'
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '12px'
  },
  label: {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#fff',
    fontSize: '0.92rem',
    outline: 'none'
  },
  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    borderRadius: '8px',
    backgroundColor: '#0c121e',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#fff',
    fontSize: '0.92rem',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#fff',
    fontSize: '0.92rem',
    outline: 'none',
    resize: 'vertical'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  checkboxGroupGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#cbd5e1',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  checkbox: {
    accentColor: '#FFE600',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  subOptionBox: {
    marginTop: '10px',
    padding: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '6px',
    border: '1px dashed rgba(255, 255, 255, 0.15)'
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tagBtn: {
    padding: '7px 13px',
    borderRadius: '18px',
    border: '1px solid',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  ceremonieCard: {
    backgroundColor: 'rgba(255, 230, 0, 0.04)',
    border: '1px solid rgba(255, 230, 0, 0.25)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '26px'
  },
  badgeCeremonie: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '1px',
    padding: '3px 9px',
    borderRadius: '12px',
    backgroundColor: '#FFE600',
    color: '#000000',
    marginBottom: '10px'
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '28px'
  },
  btnRowRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '28px'
  },
  btnPrimary: {
    backgroundColor: '#FFE600',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '0.95rem',
    boxShadow: '0 4px 15px rgba(255, 230, 0, 0.25)'
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '12px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem'
  },
  btnSubmit: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 28px',
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '0.95rem',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
  },
  successBox: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  checkIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '2px solid #10b981',
    color: '#10b981',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto'
  }
};