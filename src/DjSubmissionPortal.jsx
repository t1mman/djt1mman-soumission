import React, { useState } from 'react';

// Date du jour par défaut (format YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function DjSubmissionPortal() {
  const [currentPage, setCurrentPage] = useState('soumission'); // 'soumission' | 'logistique'
  const [isSubmitted, setIsSubmitted] = useState(false);

  // État global synchronisé entre la soumission et la logistique
  const [form, setForm] = useState({
    // --- PAGE 1 : SOUMISSION & PRIX ---
    // Contact client
    nom: '',
    contact: '', // Téléphone ou courriel
    
    // Événement de base
    typeEvenement: 'mariage',
    nbPersonnes: '50-100', // Par défaut 50-100
    dateSouhaitee: getTodayDate(), // Par défaut aujourd'hui
    heureDebut: '17:00',
    dureePrevue: '7 heures',

    // Lieu & Manutention
    lieuVille: '',
    etageType: 'rdc', // 'rdc' | 'etage'
    ascenseurPresent: false,

    // Matériel requis
    materiel: {
      audio: true,
      eclairage: true,
      microEtTrepie: true,
      affichage: false,
      autre: false
    },
    materielAutreDetail: '',

    // Services requis
    services: {
      dj: true,
      animation: true,
      karaoke: false,
      affichageParoles: false,
      diapo: false,
      effetsVisuels: false,
      jeuxInteractifs: false,
      quiz: false,
      presentation: false
    },

    // Temps requis (blocs horaires)
    tempsRequis: {
      ceremonie: true,
      souper: true,
      soireeUniquement: false,
      autre: false
    },
    tempsRequisAutreDetail: '',

    // Styles musicaux
    stylesMusicaux: ['Top 40 / Pop', 'Années 80 / 90 / 2000s', 'Rock'],

    // --- PAGE 2 : LOGISTIQUE DÉTAILLÉE ---
    playlistPartagee: '',
    
    // Musiques Cérémonie (si cérémonie cochée)
    ceremonieDetails: {
      heureCeremonie: '15:30',
      chansonEntreeCortege: '',
      chansonEntreeMarie: '',
      chansonEntreeMariee: '',
      chansonSignature: '',
      chansonSortie: '',
      autreMusiqueCeremonie: ''
    },

    // Horaires & Activités spécifiques
    horairesLogistique: {
      heureArriveeSalle: '14:00',
      heureSouper: '18:30',
      heureJeu1: '19:30',
      descJeu1: '',
      heureJeu2: '20:15',
      descJeu2: '',
      heureJeu3: '21:00',
      descJeu3: '',
      heureOuverturePiste: '21:30',
      premiereDanseTitre: ''
    },

    notesLogistique: ''
  });

  // Gestion des checkboxes
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
    'Top 40 / Pop',
    'Rock / Classic Rock',
    'Dance / EDM / Club',
    'Hip-Hop & R&B',
    'Années 80 / 90 / 2000s',
    'Classiques Québécois',
    'Latino / Reggaeton',
    'Country / Folk',
    'Lounge / Cocktail / Jazz'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Soumission & Logistique prêtes pour envoi :', form);
    setIsSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Navigation entre les deux pages */}
        <div style={styles.navBar}>
          <button
            type="button"
            onClick={() => setCurrentPage('soumission')}
            style={{
              ...styles.navTab,
              borderColor: currentPage === 'soumission' ? '#00f2fe' : 'transparent',
              color: currentPage === 'soumission' ? '#00f2fe' : '#94a3b8'
            }}
          >
            1. Soumission & Éléments de Prix
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('logistique')}
            style={{
              ...styles.navTab,
              borderColor: currentPage === 'logistique' ? '#00f2fe' : 'transparent',
              color: currentPage === 'logistique' ? '#00f2fe' : '#94a3b8'
            }}
          >
            2. Logistique & Déroulement
          </button>
        </div>

        {isSubmitted ? (
          <div style={styles.successBox}>
            <div style={styles.checkIcon}>✓</div>
            <h2 style={{ color: '#fff' }}>Dossier transmis avec succès !</h2>
            <p style={{ color: '#94a3b8' }}>
              Merci <strong>{form.nom}</strong>. Les informations de soumission et la feuille de route logistique ont bien été enregistrées.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              style={{ ...styles.btnSecondary, marginTop: '20px' }}
            >
              Modifier la demande
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* ============================================================== */}
            {/* PAGE 1 : SOUMISSION & FIXATION DU PRIX                         */}
            {/* ============================================================== */}
            {currentPage === 'soumission' && (
              <div>
                <h2 style={styles.pageTitle}>Évaluation de la Soumission</h2>
                <p style={styles.pageSubtitle}>
                  Veuillez spécifier la distance, la logistique d'accès et les options requises pour l'estimation tarifaire.
                </p>

                {/* 1. Client & Contact */}
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
                      <label style={styles.label}>Contact (Téléphone / Courriel) *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: (418) 555-0199 ou jean@email.com"
                        style={styles.input}
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Type, Nombre, Date & Horaires */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>L'Événement & Temps</h3>
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
                        <option value="bal-scolaire">Bal / Fête scolaire</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label style={styles.label}>Nombre de personnes estimé</label>
                      <select
                        style={styles.select}
                        value={form.nbPersonnes}
                        onChange={(e) => setForm({ ...form, nbPersonnes: e.target.value })}
                      >
                        <option value="moins-50">Moins de 50</option>
                        <option value="50-100">50 - 100 (Standard)</option>
                        <option value="100-200">100 - 200</option>
                        <option value="200-350">200 - 350</option>
                        <option value="350+">350 et plus (Gros système)</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.grid3}>
                    <div>
                      <label style={styles.label}>Date souhaitée</label>
                      <input
                        type="date"
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
                        <option value="4 heures">4 heures</option>
                        <option value="5 heures">5 heures</option>
                        <option value="6 heures">6 heures</option>
                        <option value="7 heures">7 heures</option>
                        <option value="8 heures">8 heures</option>
                        <option value="Journee complete">Journée complète (10h+)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Lieu & Accès (Manutention / Étages) */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Lieu & Manutention</h3>
                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Lieu / Ville (pour calcul du déplacement)</label>
                      <input
                        type="text"
                        placeholder="ex: Hôtel Le Concorde, Québec"
                        style={styles.input}
                        value={form.lieuVille}
                        onChange={(e) => setForm({ ...form, lieuVille: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={styles.label}>Accès de livraison / Salle</label>
                      <select
                        style={styles.select}
                        value={form.etageType}
                        onChange={(e) => setForm({ ...form, etageType: e.target.value })}
                      >
                        <option value="rdc">Rez-de-chaussée (Plain-pied)</option>
                        <option value="etage">Sur un étage (escaliers requis)</option>
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
                        <span>Ascenseur ou monte-charge disponible pour le transport du matériel</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* 4. Temps Requis (Cérémonie, Souper, etc.) */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Temps & Moments Requis</h3>
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
                        placeholder="Précisez le temps ou le bloc requis..."
                        style={styles.input}
                        value={form.tempsRequisAutreDetail}
                        onChange={(e) => setForm({ ...form, tempsRequisAutreDetail: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* 5. Matériel Requis */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Matériel requis</h3>
                  <div style={styles.checkboxGroup}>
                    {[
                      { key: 'audio', label: 'Système Audio (Hauts-parleurs / Subwoofers)' },
                      { key: 'eclairage', label: 'Éclairage (Piste & Ambiance)' },
                      { key: 'microEtTrepie', label: 'Micros & Trépieds' },
                      { key: 'affichage', label: 'Affichage (Écran / Téléviseur / Projecteur)' },
                      { key: 'autre', label: 'Autre matériel' }
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
                        placeholder="Précisez les équipements spéciaux requis..."
                        style={styles.input}
                        value={form.materielAutreDetail}
                        onChange={(e) => setForm({ ...form, materielAutreDetail: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* 6. Services Requis */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Services requis</h3>
                  <div style={styles.checkboxGroupGrid}>
                    {[
                      { key: 'dj', label: 'DJ (Mix en direct)' },
                      { key: 'animation', label: 'Animation au micro' },
                      { key: 'karaoke', label: 'Karaoké' },
                      { key: 'affichageParoles', label: 'Affichage des paroles' },
                      { key: 'diapo', label: 'Diffusion Diaporama / Photos' },
                      { key: 'effetsVisuels', label: 'Effets visuels' },
                      { key: 'jeuxInteractifs', label: 'Jeux interactifs' },
                      { key: 'quiz', label: 'Quiz / Blind test' },
                      { key: 'presentation', label: 'Soutien présentations & discours' }
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
                  <h3 style={styles.sectionHeading}>Styles musicaux prioritaires</h3>
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
                            borderColor: selected ? '#00f2fe' : 'rgba(255,255,255,0.15)',
                            backgroundColor: selected ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255,255,255,0.04)',
                            color: selected ? '#00f2fe' : '#cbd5e1'
                          }}
                        >
                          {style} {selected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={styles.btnRowRight}>
                  <button
                    type="button"
                    style={styles.btnPrimary}
                    onClick={() => setCurrentPage('logistique')}
                  >
                    Passer à la Logistique & Déroulement →
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* PAGE 2 : LOGISTIQUE DÉTAILLÉE (FEUILLE DE ROUTE)               */}
            {/* ============================================================== */}
            {currentPage === 'logistique' && (
              <div>
                <h2 style={styles.pageTitle}>Logistique & Feuille de Route</h2>
                <p style={styles.pageSubtitle}>
                  Cette page prépare le déroulement exact de la journée. Les options cochées en soumission s'activent ici automatiquement.
                </p>

                {/* Playlist partagée */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Playlist & Inspiration Musicale</h3>
                  <label style={styles.label}>Lien vers une playlist partagée (Spotify, Apple Music, YouTube)</label>
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/playlist/..."
                    style={styles.input}
                    value={form.playlistPartagee}
                    onChange={(e) => setForm({ ...form, playlistPartagee: e.target.value })}
                  />
                </div>

                {/* Section Cérémonie conditionnelle (si cérémonie cochée en page 1) */}
                {form.tempsRequis.ceremonie && (
                  <div style={styles.specialCard}>
                    <div style={styles.badgeHighlight}>OPTION CÉRÉMONIE ACTIVE</div>
                    <h3 style={styles.sectionHeading}>Musiques & Entrées de Cérémonie</h3>
                    
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
                          placeholder="ex: Titre spécifique ou identique au cortège"
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
                          placeholder="ex: Elvis Presley - Can't Help Falling In Love"
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
                        <label style={styles.label}>Signature du registre & Sortie</label>
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
                      <label style={styles.label}>Autre musique / Note spécifique pour la cérémonie</label>
                      <input
                        type="text"
                        placeholder="ex: Allumage de lampion, chanson spéciale..."
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

                {/* Horaires et interventions (Souper, Jeux 1, 2, 3) */}
                <div style={styles.section}>
                  <h3 style={styles.sectionHeading}>Déroulement & Heures des temps forts</h3>
                  
                  <div style={styles.grid2}>
                    <div>
                      <label style={styles.label}>Heure estimée du souper / cocktail</label>
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
                      <label style={styles.label}>Première danse / Ouverture de piste</label>
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

                  {/* Blocs Jeux 1, 2, 3 */}
                  <h4 style={{ color: '#00f2fe', margin: '20px 0 10px 0', fontSize: '1rem' }}>
                    Animation & Blocs Jeux (si prévus)
                  </h4>
                  <div style={styles.grid3}>
                    <div>
                      <label style={styles.label}>Jeu 1 (Heure & Titre)</label>
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
                        placeholder="Description (ex: Jeu des souliers)"
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
                      <label style={styles.label}>Jeu 2 (Heure & Titre)</label>
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
                        placeholder="Description (ex: Quiz musical)"
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
                      <label style={styles.label}>Jeu 3 (Heure & Titre)</label>
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
                        placeholder="Description (ex: Jarretière / Bouquet)"
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

                {/* Notes et demandes supplémentaires */}
                <div style={styles.section}>
                  <label style={styles.label}>Notes de logistique ou instructions additionnelles</label>
                  <textarea
                    rows={4}
                    placeholder="Accès particulier pour le débarcadère, consignes de sécurité de la salle, personnes ressources..."
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

                  <button type="submit" style={styles.btnSubmit}>
                    Confirmer et Envoyer le Dossier Complet ✓
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// Styles Glassmorphism Pro
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e17',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '820px',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '36px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
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
    fontSize: '1.75rem',
    fontWeight: '800',
    margin: '0 0 6px 0'
  },
  pageSubtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
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
    borderLeft: '3px solid #00f2fe',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    backgroundColor: '#0f172a',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    accentColor: '#00f2fe',
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
  specialCard: {
    backgroundColor: 'rgba(0, 242, 254, 0.04)',
    border: '1px solid rgba(0, 242, 254, 0.25)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '26px'
  },
  badgeHighlight: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '1px',
    padding: '3px 9px',
    borderRadius: '12px',
    backgroundColor: '#00f2fe',
    color: '#090d16',
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
    backgroundColor: '#00f2fe',
    color: '#090d16',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.95rem'
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
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 28px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.95rem'
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