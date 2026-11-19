import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const mascotSrc = `${import.meta.env.BASE_URL}mascot-v2.png`;

const chapters = [
  { id: 'signs', number: '01', name: 'Signalisation routière', short: 'Les panneaux et marquages', icon: '△', color: 'teal', goal: 'Lire la route en un coup d’œil' },
  { id: 'rules', number: '02', name: 'Réglementation routière', short: 'Les règles au Bénin', icon: '◎', color: 'orange', goal: 'Connaître ses obligations' },
  { id: 'priorities', number: '03', name: 'Priorités & intersections', short: 'Croisements et carrefours', icon: '✣', color: 'blue', goal: 'Anticiper chaque croisement' },
  { id: 'vehicle', number: '04', name: 'Conducteur & véhicule', short: 'Le véhicule en bon état', icon: '▣', color: 'purple', goal: 'Partir bien équipé' },
  { id: 'safety', number: '05', name: 'Conduite en toute sécurité', short: 'Les bons réflexes', icon: '✦', color: 'green', goal: 'Garder une longueur d’avance' },
  { id: 'civic', number: '06', name: 'Environnement & citoyenneté', short: 'Partager la route', icon: '◌', color: 'pink', goal: 'Conduire avec respect' },
];

const q = (id, chapter, question, options, answer, explanation, sign = null) => ({ id, chapter, question, options, answer, explanation, sign });

const questions = [
  q('s01', 'signs', 'Que signifie ce panneau triangulaire bordé de rouge avec un enfant ?', ['Une aire de jeux obligatoire', 'Un danger : présence possible d’enfants', 'Une école réservée aux véhicules', 'Une zone où klaxonner'], 1, 'C’est un panneau de danger. Il invite à ralentir et à être particulièrement attentif aux enfants.', 'school'),
  q('s02', 'signs', 'À un panneau STOP, que devez-vous faire ?', ['Ralentir seulement si un véhicule arrive', 'Marquer un arrêt complet puis céder la priorité', 'Accélérer pour passer avant les autres', 'Allumer les feux de détresse'], 1, 'Le STOP impose un arrêt complet à la ligne prévue, même si la route semble libre.', 'stop'),
  q('s03', 'signs', 'Le panneau « cédez le passage » vous demande de…', ['Vous arrêter systématiquement 10 secondes', 'Laisser passer les usagers prioritaires et vous engager prudemment', 'Passer en premier si vous êtes à droite', 'Faire demi-tour'], 1, 'Vous ralentissez, vérifiez et cédez aux usagers prioritaires. L’arrêt n’est nécessaire que si la situation l’impose.', 'yield'),
  q('s04', 'signs', 'Un panneau rond blanc bordé de rouge affiche « 50 ». Quelle est sa signification ?', ['Vitesse conseillée de 50 km/h minimum', 'Vitesse maximale autorisée de 50 km/h', 'Distance de 50 mètres avant le danger', 'Fin de limitation à 50 km/h'], 1, 'Ce panneau fixe une vitesse maximale. Les conditions de circulation peuvent imposer de rouler encore moins vite.', 'speed50'),
  q('s05', 'signs', 'Que signifie le panneau rond blanc bordé de rouge avec une barre horizontale ?', ['Sens interdit à tous les véhicules dans cette direction', 'Route réservée aux motos', 'Fin de toutes les interdictions', 'Stationnement conseillé'], 0, 'Le sens interdit interdit l’entrée par cette extrémité de la voie.', 'noentry'),
  q('s06', 'signs', 'À l’approche de ce passage pour piétons, le bon réflexe est de…', ['Accélérer pour ne pas gêner', 'Ralentir et laisser traverser les piétons engagés', 'Klaxonner jusqu’à ce qu’ils reculent', 'Stationner sur le passage'], 1, 'Ralentissez, observez les deux côtés et laissez traverser les piétons engagés ou sur le point de s’engager.', 'crosswalk'),
  q('s07', 'signs', 'Ce panneau avec des hommes au travail annonce…', ['Une station-service', 'Des travaux ou un danger temporaire', 'Une route prioritaire', 'Une zone de contrôle obligatoire'], 1, 'La signalisation temporaire de travaux appelle à réduire l’allure et à suivre les indications mises en place.', 'roadworks'),
  q('s08', 'signs', 'Face à un feu rouge, vous devez…', ['Vous arrêter avant la ligne d’arrêt', 'Passer si personne ne regarde', 'Vous arrêter après le carrefour', 'Mettre les feux de route'], 0, 'Le feu rouge interdit le franchissement. Arrêtez-vous avant la ligne ou avant le passage protégé.', 'redlight'),
  q('s09', 'signs', 'Un panneau rond bleu avec une flèche blanche vers la droite indique…', ['Une direction obligatoire vers la droite', 'Une interdiction de tourner à droite', 'Une vitesse minimale de 30 km/h', 'Une place de parking'], 0, 'Le disque bleu à flèche blanche impose la direction indiquée.', 'right'),
  q('s10', 'signs', 'Un panneau « stationnement interdit » signifie que…', ['Vous pouvez stationner avec les feux de détresse', 'Vous ne devez pas laisser le véhicule stationné à cet endroit', 'L’arrêt est toujours interdit, même pour déposer un passager', 'Le stationnement est réservé aux motos'], 1, 'Le stationnement est interdit. Pour un arrêt bref, vérifiez toujours la signalisation et ne gênez jamais la circulation.', 'noparking'),

  q('r01', 'rules', 'Au Bénin, le permis de conduire est…', ['Un simple reçu de l’auto-école', 'Une autorisation administrative pour conduire sur une voie ouverte à la circulation publique', 'Une assurance du véhicule', 'Une carte d’identité spéciale'], 1, 'Le permis autorise son titulaire à conduire un véhicule de la catégorie obtenue sur la voie publique.', null),
  q('r02', 'rules', 'Selon la fiche de service public consultée, quelle catégorie concerne notamment les véhicules de moins de 10 places et jusqu’à 3 500 kg ?', ['A1', 'A2', 'B', 'C'], 2, 'La catégorie B concerne les véhicules de moins de 10 places dont le PTAC ne dépasse pas 3 500 kg.', null),
  q('r03', 'rules', 'D’après la fiche officielle du service public, l’âge indiqué pour la catégorie A1 est de…', ['14 ans', '16 ans', '18 ans', '21 ans'], 1, 'La fiche béninoise indique 16 ans pour A1, qui concerne notamment les vélomoteurs et cyclomoteurs jusqu’à 75 cm³.', null),
  q('r04', 'rules', 'Dans la fiche de service public utilisée comme repère, la note annoncée pour réussir l’épreuve écrite du code est de…', ['10/20', '12/20', '14/20', '18/20'], 2, 'La fiche indique 14/20 pour l’épreuve écrite du code et 12/20 pour la conduite. L’auto-école doit confirmer les modalités en vigueur.', null),
  q('r05', 'rules', 'Au Bénin, le non-port du casque concerne…', ['Uniquement le passager', 'Le conducteur et son passager à moto', 'Uniquement les conducteurs de taxi', 'Personne en agglomération'], 1, 'La Police républicaine rappelle que le conducteur et le passager d’une motocyclette sont exposés et doivent être protégés.', null),
  q('r06', 'rules', 'Le téléphone tenu en main au volant est…', ['Un geste sans conséquence', 'Une infraction liée au conducteur', 'Obligatoire dans les bouchons', 'Autorisé à moins de 20 km/h'], 1, 'Le téléphone au volant détourne l’attention et figure parmi les infractions rappelées par les autorités béninoises.', null),
  q('r07', 'rules', 'Pour renouveler une assurance de véhicule au Bénin, la communication officielle de 2024 rappelle notamment l’importance de…', ['La couleur du véhicule', 'L’attestation de contrôle technique à jour et la preuve du paiement de la TVM', 'La marque du casque', 'La présence d’un GPS'], 1, 'La communication officielle cite le contrôle technique à jour et la TVM parmi les éléments demandés pour l’assurance.', null),
  q('r08', 'rules', 'Circuler sans permis de conduire valide expose le conducteur à…', ['Aucune conséquence si le véhicule est assuré', 'Une infraction', 'Une prime de carburant', 'Une priorité automatique'], 1, 'Le défaut de permis est une infraction liée au conducteur. Conduisez uniquement dans la catégorie autorisée.', null),
  q('r09', 'rules', 'La plaque d’immatriculation d’une motocyclette sert notamment à…', ['Décorer le garde-boue', 'Identifier le véhicule et faciliter les contrôles', 'Indiquer la vitesse maximale', 'Remplacer l’assurance'], 1, 'Les autorités béninoises rappellent l’importance de la plaque pour identifier les motocyclettes.', null),
  q('r10', 'rules', 'Une auto-école qui prépare à l’examen du permis au Bénin doit être…', ['Choisie uniquement sur les réseaux sociaux', 'Un établissement de formation agréé par le ministère compétent', 'Remplacée par un ami expérimenté', 'Réservée aux conducteurs professionnels'], 1, 'La fiche officielle recommande de s’inscrire dans une auto-école agréée par le Ministère des Infrastructures et des Transports.', null),

  q('p01', 'priorities', 'À une intersection sans panneau ni feu, la règle générale à retenir est…', ['La priorité à gauche', 'La priorité à droite, sauf indication contraire', 'La priorité au véhicule le plus rapide', 'La priorité au véhicule le plus gros'], 1, 'En l’absence d’indication, ralentissez et appliquez la règle de priorité à droite, en restant prêt à céder.', null),
  q('p02', 'priorities', 'En quittant une cour, une station-service ou un parking pour entrer sur la route, vous devez…', ['Être prioritaire car vous arrivez de droite', 'Céder le passage aux usagers de la route', 'Mettre les feux de route', 'Rouler sur le trottoir'], 1, 'Vous vous insérez dans la circulation : vous devez céder le passage et vérifier les usagers vulnérables.', null),
  q('p03', 'priorities', 'Un véhicule d’intervention avec avertisseurs actifs arrive derrière vous. Vous devez…', ['Bloquer la voie', 'Faciliter son passage sans créer un nouveau danger', 'Accélérer pour le suivre', 'Vous arrêter au milieu du carrefour'], 1, 'Écartez-vous dès que possible et restez prévisible. Ne franchissez pas un feu rouge ou un trottoir de façon dangereuse.', null),
  q('p04', 'priorities', 'Pour tourner à gauche dans une intersection, vous devez notamment…', ['Couper la trajectoire des véhicules venant en face', 'Contrôler les rétroviseurs, signaler et céder aux usagers prioritaires', 'Tourner sans ralentir', 'Vous placer sur le trottoir'], 1, 'Le clignotant informe, mais ne donne pas la priorité. Vérifiez en face, derrière et dans l’angle mort.', null),
  q('p05', 'priorities', 'À un passage pour piétons, votre vitesse doit vous permettre de…', ['Vous arrêter si un piéton s’engage', 'Passer avant le piéton dans tous les cas', 'Ne regarder que le côté droit', 'Klaxonner pour obtenir la priorité'], 0, 'Vous devez pouvoir vous arrêter et laisser traverser les piétons engagés ou manifestement sur le point de traverser.', null),
  q('p06', 'priorities', 'Dans un carrefour giratoire, l’ordre de passage dépend en priorité…', ['Des panneaux et marquages présents', 'De la couleur du véhicule', 'Du nombre de passagers', 'De la puissance du moteur'], 0, 'Observez la signalisation à l’entrée et dans l’anneau. Ne présumez jamais de la priorité.', null),
  q('p07', 'priorities', 'Avant de changer de voie, la séquence la plus sûre est…', ['Clignotant, accélération, regard', 'Rétroviseurs, angle mort, clignotant puis déplacement si possible', 'Klaxon, volant, frein à main', 'Changement immédiat sans signaler'], 1, 'Contrôlez d’abord, signalez ensuite et déplacez-vous seulement si l’espace est libre.', null),
  q('p08', 'priorities', 'Une ligne d’arrêt devant un feu ou un STOP sert à…', ['Indiquer où arrêter le véhicule', 'Mesurer la longueur du véhicule', 'Réserver la chaussée aux motos', 'Marquer la fin de la route'], 0, 'Arrêtez-vous avant la ligne pour conserver la visibilité et protéger les usagers qui traversent.', null),
  q('p09', 'priorities', 'À l’approche d’un passage à niveau, le conducteur doit…', ['Accélérer pour passer avant le train', 'Ralentir, regarder et s’arrêter si les signaux l’imposent', 'Suivre le véhicule devant sans regarder', 'Stationner sur les rails'], 1, 'Un passage à niveau exige une observation des deux côtés et un arrêt si une barrière, un feu ou un signal l’impose.', null),
  q('p10', 'priorities', 'Le feu passe au vert. Vous devez…', ['Démarrer sans regarder', 'Vérifier que le carrefour est dégagé et avancer prudemment', 'Klaxonner jusqu’au prochain feu', 'Faire demi-tour'], 1, 'Le vert autorise le passage, mais ne permet pas d’entrer dans un carrefour bouché ou de mettre quelqu’un en danger.', null),

  q('v01', 'vehicle', 'Avant de prendre la route, le conducteur doit vérifier en priorité…', ['Les freins, les pneus, l’éclairage et les rétroviseurs', 'La musique et la climatisation uniquement', 'La couleur du tableau de bord', 'La vitesse maximale du véhicule voisin'], 0, 'Un contrôle simple des organes de sécurité évite de partir avec un défaut dangereux.', null),
  q('v02', 'vehicle', 'Des pneus très usés peuvent…', ['Améliorer l’adhérence sous la pluie', 'Augmenter le risque de perte d’adhérence et de crevaison', 'Réduire la distance de freinage', 'Remplacer les freins'], 1, 'L’usure des pneumatiques dégrade la tenue de route, surtout sur chaussée mouillée.', null),
  q('v03', 'vehicle', 'La ceinture de sécurité doit être portée…', ['Seulement sur autoroute', 'Par les occupants, avant le départ, quand le véhicule en est équipé', 'Uniquement par le conducteur', 'Après le premier contrôle'], 1, 'La ceinture protège dès les premiers mètres. Faites-la porter et ajustez-la correctement.', null),
  q('v04', 'vehicle', 'Un rétroviseur mal réglé augmente…', ['La visibilité des angles morts', 'Les zones non visibles autour du véhicule', 'La puissance du moteur', 'La durée de vie des pneus'], 1, 'Réglez les rétroviseurs avant de démarrer, puis contrôlez toujours l’angle mort avant une manœuvre.', null),
  q('v05', 'vehicle', 'Un chargement dans un véhicule doit être…', ['Libre de bouger dans l’habitacle', 'Réparti et fixé pour ne pas gêner la visibilité ou devenir un projectile', 'Posé sur le toit sans fixation', 'Placée devant les pédales'], 1, 'Un objet mal fixé peut blesser les occupants et perturber le comportement du véhicule.', null),
  q('v06', 'vehicle', 'Un défaut d’éclairage sur un véhicule est…', ['Sans importance le soir', 'Une infraction liée au véhicule et un risque pour voir et être vu', 'Une preuve de bonne visibilité', 'Une raison d’allumer les feux de détresse en permanence'], 1, 'Les feux permettent de voir et d’être vu. Vérifiez-les et faites réparer tout défaut.', null),
  q('v07', 'vehicle', 'Le contrôle technique sert principalement à…', ['Choisir la couleur de la plaque', 'Vérifier l’état et la conformité du véhicule', 'Remplacer le permis', 'Obtenir une priorité'], 1, 'Le contrôle technique participe à la sécurité et à la conformité du véhicule.', null),
  q('v08', 'vehicle', 'Un témoin rouge de frein s’allume pendant la conduite. Vous devez…', ['L’ignorer', 'Vous arrêter en sécurité et faire contrôler le véhicule', 'Accélérer', 'Désactiver tous les feux'], 1, 'Un témoin rouge peut signaler un danger sérieux. Arrêtez-vous sans créer de risque et demandez un contrôle.', null),
  q('v09', 'vehicle', 'Pour conduire une motocyclette, le casque doit être…', ['Porté et correctement attaché', 'Tenu à la main', 'Réservé au passager', 'Utile seulement sous la pluie'], 0, 'Un casque porté sur la tête mais non attaché peut être éjecté en cas de choc.', null),
  q('v10', 'vehicle', 'Une plaque d’immatriculation sale ou illisible peut…', ['Faciliter les contrôles', 'Rendre l’identification du véhicule difficile et exposer à une infraction', 'Remplacer le contrôle technique', 'Autoriser le stationnement'], 1, 'La plaque doit rester visible et lisible pour permettre l’identification du véhicule.', null),

  q('a01', 'safety', 'La fatigue au volant se combat le mieux en…', ['Ouvrant la fenêtre uniquement', 'Faisant une pause et en s’arrêtant pour dormir si nécessaire', 'Augmentant le volume de la musique', 'Rou­lant plus vite'], 1, 'La pause est la seule réponse fiable quand la vigilance baisse. Ne luttez pas contre le sommeil.', null),
  q('a02', 'safety', 'Après avoir consommé de l’alcool, la décision la plus sûre est de…', ['Conduire lentement', 'Ne pas conduire et prévoir une solution de retour', 'Boire du café puis partir', 'Rouler seulement sur une courte distance'], 1, 'L’alcool altère la perception et le temps de réaction. Prévoyez un conducteur sobre ou un autre moyen de transport.', null),
  q('a03', 'safety', 'La distance de sécurité sert à…', ['Garder du temps pour réagir et freiner', 'Empêcher les autres de dépasser', 'Rouler dans l’angle mort', 'Réduire la visibilité'], 0, 'Laissez un espace suffisant avec le véhicule devant, en l’augmentant sous la pluie ou de nuit.', null),
  q('a04', 'safety', 'Sous une forte pluie, il faut…', ['Réduire l’allure et augmenter les distances', 'Freiner brusquement dans les flaques', 'Couper tous les feux', 'Suivre de très près'], 0, 'La chaussée devient glissante et la visibilité baisse. Anticipez et évitez les gestes brusques.', null),
  q('a05', 'safety', 'Pour dépasser un autre usager, vous devez d’abord…', ['Vérifier la visibilité, la signalisation et l’espace disponible', 'Vous placer dans son angle mort', 'Klaxonner puis partir sans regarder', 'Dépasser juste avant un virage sans visibilité'], 0, 'Un dépassement demande une visibilité suffisante, une signalisation adaptée et une marge de sécurité.', null),
  q('a06', 'safety', 'Le téléphone au volant augmente le risque parce qu’il…', ['Améliore l’anticipation', 'Détourne les yeux, les mains et l’attention', 'Réduit le trafic', 'Raccourcit les distances'], 1, 'Même une courte distraction peut empêcher de voir un piéton, une moto ou un obstacle.', null),
  q('a07', 'safety', 'En cas de panne, la première priorité est de…', ['Se placer en sécurité et signaler le danger', 'Rester au milieu de la voie', 'Réparer immédiatement sans regarder la circulation', 'Laisser les enfants sortir côté chaussée'], 0, 'Mettez-vous hors de danger, rendez le véhicule visible et demandez de l’aide si besoin.', null),
  q('a08', 'safety', 'Quand la visibilité est mauvaise, le conducteur doit…', ['Adapter sa vitesse à ce qu’il peut réellement voir', 'Conserver la même vitesse', 'Éteindre les feux', 'Regarder seulement le véhicule devant'], 0, 'Vous devez pouvoir vous arrêter dans la distance visible et libre devant vous.', null),
  q('a09', 'safety', 'La vitesse doit être adaptée…', ['Uniquement à la puissance du véhicule', 'À la route, au trafic, à la météo et à la visibilité', 'Au véhicule qui suit', 'Au nombre de passagers seulement'], 1, 'Une vitesse légale peut rester dangereuse si les conditions sont difficiles.', null),
  q('a10', 'safety', 'Un conducteur prudent cherche d’abord à…', ['Être le premier', 'Anticiper les erreurs possibles des autres usagers', 'Rouler au centre de la route', 'Ne jamais ralentir'], 1, 'Anticiper laisse du temps pour agir et protège les usagers vulnérables.', null),

  q('c01', 'civic', 'Sur une route partagée, le bon comportement est de…', ['Respecter les couloirs de circulation et les usagers vulnérables', 'Utiliser le trottoir pour gagner du temps', 'Ignorer les motos', 'Bloquer les passages'], 0, 'La Police républicaine rappelle l’importance du respect des couloirs de circulation pour chaque usager.', null),
  q('c02', 'civic', 'À proximité d’une école ou d’un marché, vous devez…', ['Ralentir et vous préparer à un arrêt', 'Accélérer avant la foule', 'Klaxonner en continu', 'Stationner sur le passage piéton'], 0, 'Les déplacements y sont imprévisibles. Réduisez l’allure et laissez de l’espace aux piétons.', null),
  q('c03', 'civic', 'Respecter la signalisation horizontale signifie notamment…', ['Suivre les lignes et marquages qui organisent la chaussée', 'Rouler sur toutes les lignes', 'Effacer les marquages', 'Les ignorer la nuit'], 0, 'Les marquages au sol complètent les panneaux et organisent les mouvements sur la chaussée.', null),
  q('c04', 'civic', 'Un conducteur citoyen évite de…', ['Jeter des déchets sur la voie', 'Signaler un danger', 'Laisser passer un piéton', 'Entretenir son véhicule'], 0, 'Les déchets peuvent créer des obstacles et dégrader l’environnement. Gardez-les dans le véhicule jusqu’à une poubelle.', null),
  q('c05', 'civic', 'En cas d’accident avec des blessés, la conduite responsable est de…', ['Protéger, alerter les secours et porter assistance sans se mettre en danger', 'Déplacer tout le monde immédiatement', 'Filmer puis partir', 'Créer un attroupement sur la chaussée'], 0, 'Protégez la zone, alertez les secours et aidez selon vos capacités. Ne vous exposez pas à un suraccident.', null),
  q('c06', 'civic', 'Pour limiter la pollution et le bruit, il est préférable de…', ['Entretenir le véhicule et éviter les accélérations inutiles', 'Laisser tourner le moteur à l’arrêt', 'Klaxonner pour saluer', 'Retirer le silencieux'], 0, 'Un véhicule entretenu et une conduite souple réduisent la consommation, le bruit et les émissions.', null),
  q('c07', 'civic', 'Une moto et une voiture doivent…', ['Se partager la route avec vigilance et respecter les espaces prévus', 'Rouler côte à côte sans distance', 'Ignorer les angles morts', 'Se doubler dans chaque virage'], 0, 'Les différences de gabarit imposent de laisser de l’espace et de vérifier les angles morts.', null),
  q('c08', 'civic', 'Pour stationner près d’un passage piéton, vous devez…', ['Laisser le passage visible et libre', 'Masquer le passage avec le véhicule', 'Stationner sur les bandes', 'Allumer les feux de route'], 0, 'La visibilité et l’accès des piétons doivent rester dégagés.', null),
  q('c09', 'civic', 'Lors d’un contrôle routier, il faut…', ['Rester calme, s’arrêter dans un lieu sûr et présenter les documents demandés', 'Refuser tout échange', 'Repartir sans signaler', 'Bloquer la voie volontairement'], 0, 'Soyez prévisible et respectueux. En cas de problème, utilisez les canaux officiels plutôt que le conflit.', null),
  q('c10', 'civic', 'Le numéro vert rappelé par la Police républicaine pour signaler un acte de rançonnement est…', ['118', '166', '171', '999'], 1, 'La communication officielle de 2024 cite le 166, fonctionnel 24 h/24 et 7 j/7, pour les plaintes ou dénonciations concernées.', null),
];

const defaultProgress = { signs: 18, rules: 34, priorities: 12, vehicle: 26, safety: 48, civic: 22 };
const getStored = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

function SignIllustration({ type }) {
  const shapes = {
    school: <><polygon points="100,12 185,165 15,165" fill="#fff" stroke="#ef5350" strokeWidth="12"/><circle cx="82" cy="92" r="10" fill="#1f3c4a"/><circle cx="125" cy="92" r="10" fill="#1f3c4a"/><path d="M70 116 Q104 139 139 116" fill="none" stroke="#1f3c4a" strokeWidth="8" strokeLinecap="round"/><path d="M65 139 L105 113 L142 139" fill="none" stroke="#1f3c4a" strokeWidth="8"/></>,
    stop: <><polygon points="60,21 140,21 179,60 179,140 140,179 60,179 21,140 21,60" fill="#e63e47"/><text x="100" y="111" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="900" fontFamily="Arial">STOP</text></>,
    yield: <><polygon points="100,178 20,25 180,25" fill="#fff" stroke="#e63e47" strokeWidth="12"/><polygon points="100,151 45,45 155,45" fill="none" stroke="#e63e47" strokeWidth="6"/></>,
    speed50: <><circle cx="100" cy="100" r="78" fill="#fff" stroke="#e63e47" strokeWidth="12"/><text x="100" y="115" textAnchor="middle" fill="#1f3c4a" fontSize="54" fontWeight="900" fontFamily="Arial">50</text></>,
    noentry: <><circle cx="100" cy="100" r="78" fill="#e63e47"/><rect x="37" y="85" width="126" height="30" rx="12" fill="#fff"/></>,
    crosswalk: <><polygon points="100,13 185,165 15,165" fill="#fff" stroke="#eeb741" strokeWidth="12"/><path d="M64 132 L86 90 L106 112 L132 68 M82 96 L55 84 M103 111 L139 129" fill="none" stroke="#1f3c4a" strokeWidth="8" strokeLinecap="round"/></>,
    roadworks: <><polygon points="100,13 185,165 15,165" fill="#fff" stroke="#eeb741" strokeWidth="12"/><path d="M70 137 L94 66 L116 115 L139 65" fill="none" stroke="#1f3c4a" strokeWidth="10" strokeLinecap="round"/><circle cx="96" cy="49" r="8" fill="#1f3c4a"/></>,
    redlight: <><rect x="63" y="15" width="74" height="170" rx="32" fill="#263845"/><circle cx="100" cy="53" r="21" fill="#f05252"/><circle cx="100" cy="101" r="21" fill="#555"/><circle cx="100" cy="149" r="21" fill="#555"/></>,
    right: <><circle cx="100" cy="100" r="78" fill="#149c9d"/><path d="M73 135 L73 83 L129 83 M129 83 L106 60 M129 83 L106 106" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/></>,
    noparking: <><circle cx="100" cy="100" r="78" fill="#fff" stroke="#e63e47" strokeWidth="12"/><path d="M60 140 L140 60" stroke="#e63e47" strokeWidth="14" strokeLinecap="round"/><text x="100" y="117" textAnchor="middle" fill="#1f3c4a" fontSize="54" fontWeight="900" fontFamily="Arial">P</text></>,
  };
  return <div className="sign-illustration" aria-label="Illustration du panneau routier"><svg viewBox="0 0 200 200" role="img">{shapes[type]}</svg></div>;
}

function Mascot({ mood = 'happy', compact = false }) {
  return <div className={`mascot-wrap ${compact ? 'mascot-compact' : ''} mascot-${mood}`}>
    <img src={mascotSrc} alt="Mascotte DriveQuest" />
    <div className="mascot-fallback" aria-hidden="true">{mood === 'sad' ? '◕︵◕' : mood === 'excited' ? '◕‿◕' : '◕ᴗ◕'}</div>
  </div>;
}

function ProgressRing({ value, size = 72 }) {
  const radius = 29;
  const circumference = 2 * Math.PI * radius;
  return <div className="progress-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 72 72" aria-label={`${value}% de maîtrise`}><circle className="ring-track" cx="36" cy="36" r={radius} /><circle className="ring-value" cx="36" cy="36" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (circumference * value) / 100 }} /></svg>
    <strong>{value}%</strong>
  </div>;
}

function RadarChart({ values }) {
  const cx = 160, cy = 150, radius = 103;
  const angles = [-90, -30, 30, 90, 150, 210];
  const point = (value, angle, r = radius) => {
    const rad = (angle * Math.PI) / 180;
    const distance = r * value / 100;
    return `${cx + Math.cos(rad) * distance},${cy + Math.sin(rad) * distance}`;
  };
  const grid = [25, 50, 75, 100];
  return <div className="radar-box"><svg viewBox="0 0 320 300" role="img" aria-label="Graphique radar des performances par chapitre">
    {grid.map((level) => <polygon key={level} points={angles.map((angle) => point(level, angle)).join(' ')} className="radar-grid" />)}
    {angles.map((angle, i) => <line key={angle} x1={cx} y1={cy} x2={point(100, angle).split(',')[0]} y2={point(100, angle).split(',')[1]} className="radar-axis" />)}
    <polygon points={angles.map((angle, i) => point(values[i], angle)).join(' ')} className="radar-fill" />
    <polygon points={angles.map((angle, i) => point(values[i], angle)).join(' ')} className="radar-line" />
    {angles.map((angle, i) => { const [x, y] = point(values[i], angle, 117).split(','); return <circle key={`dot-${angle}`} cx={x} cy={y} r="4" className="radar-dot" />; })}
    {chapters.map((chapter, i) => { const [x, y] = point(100, angles[i], 140).split(','); return <text key={chapter.id} x={x} y={y} textAnchor="middle" className="radar-label">{chapter.number}</text>; })}
  </svg><div className="radar-legend">{chapters.map((chapter, i) => <span key={chapter.id}><i className={`dot dot-${chapter.color}`} />{chapter.short.split(' ')[0]} <b>{values[i]}%</b></span>)}</div></div>;
}

function App() {
  const [profile, setProfile] = useState(() => getStored('drivequest-profile', null));
  const [screen, setScreen] = useState(() => getStored('drivequest-profile', null) ? 'home' : 'signup');
  const [progress, setProgress] = useState(() => getStored('drivequest-progress', defaultProgress));
  const [reviewIds, setReviewIds] = useState(() => getStored('drivequest-review', ['r06', 'a04', 's02']));
  const [xp, setXp] = useState(() => getStored('drivequest-xp', 460));
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [mode, setMode] = useState('training');
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [examQueue, setExamQueue] = useState([]);
  const [examAnswers, setExamAnswers] = useState([]);
  const [examIndex, setExamIndex] = useState(0);
  const [examTime, setExamTime] = useState(45 * 60);
  const [examResult, setExamResult] = useState(null);

  useEffect(() => { localStorage.setItem('drivequest-progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('drivequest-review', JSON.stringify(reviewIds)); }, [reviewIds]);
  useEffect(() => { localStorage.setItem('drivequest-xp', JSON.stringify(xp)); }, [xp]);
  useEffect(() => {
    if (screen !== 'exam') return undefined;
    const timer = setInterval(() => setExamTime((value) => {
      if (value <= 1) { clearInterval(timer); finishExam(); return 0; }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [screen]);

  const currentQuestion = queue[currentIndex];
  const reviewQuestions = useMemo(() => questions.filter((item) => reviewIds.includes(item.id)), [reviewIds]);
  const masteryAverage = Math.round(Object.values(progress).reduce((sum, value) => sum + value, 0) / chapters.length);

  function updateMastery(chapterId, correct) {
    setProgress((previous) => ({ ...previous, [chapterId]: Math.max(0, Math.min(100, previous[chapterId] + (correct ? 7 : -3))) }));
  }

  function addToReview(questionId) {
    setReviewIds((previous) => previous.includes(questionId) ? previous : [...previous, questionId]);
  }

  function startTraining(chapterId = null, source = 'training') {
    const sourceQuestions = source === 'review' ? reviewQuestions : questions.filter((item) => !chapterId || item.chapter === chapterId);
    const shuffled = [...sourceQuestions].sort(() => Math.random() - 0.5);
    setQueue(shuffled.length ? shuffled : questions.slice(0, 1));
    setCurrentIndex(0); setSelectedOption(null); setShowFeedback(false); setSessionScore({ correct: 0, total: 0 });
    setSelectedChapter(chapterId); setMode(source); setScreen('training');
  }

  function chooseTrainingOption(index) {
    if (showFeedback || !currentQuestion) return;
    const correct = index === currentQuestion.answer;
    setSelectedOption(index); setShowFeedback(true);
    setSessionScore((score) => ({ correct: score.correct + (correct ? 1 : 0), total: score.total + 1 }));
    updateMastery(currentQuestion.chapter, correct);
    setXp((value) => value + (correct ? 10 : 2));
    if (!correct) addToReview(currentQuestion.id);
    else setReviewIds((previous) => previous.filter((id) => id !== currentQuestion.id));
  }

  function nextTraining() {
    if (currentIndex + 1 >= queue.length) { setScreen('home'); return; }
    setCurrentIndex((value) => value + 1); setSelectedOption(null); setShowFeedback(false);
  }

  function startExam() {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 50);
    setExamQueue(shuffled); setExamAnswers([]); setExamIndex(0); setExamTime(45 * 60); setExamResult(null); setScreen('exam');
  }

  function answerExam(index) {
    setExamAnswers((previous) => [...previous, { questionId: examQueue[examIndex].id, chapter: examQueue[examIndex].chapter, selected: index, correct: index === examQueue[examIndex].answer }]);
    if (examIndex + 1 >= examQueue.length) { finishExam([...examAnswers, { questionId: examQueue[examIndex].id, chapter: examQueue[examIndex].chapter, selected: index, correct: index === examQueue[examIndex].answer }]); return; }
    setExamIndex((value) => value + 1);
  }

  function finishExam(results = examAnswers) {
    const finalResults = results.length ? results : examAnswers;
    const byChapter = chapters.map((chapter) => {
      const list = finalResults.filter((result) => result.chapter === chapter.id);
      return list.length ? Math.round((list.filter((result) => result.correct).length / list.length) * 100) : 0;
    });
    finalResults.filter((result) => !result.correct).forEach((result) => addToReview(result.questionId));
    finalResults.forEach((result) => updateMastery(result.chapter, result.correct));
    const correct = finalResults.filter((result) => result.correct).length;
    setExamResult({ correct, total: finalResults.length, score: Math.round((correct / Math.max(1, finalResults.length)) * 100), byChapter });
    setScreen('results');
    setXp((value) => value + correct * 12);
  }

  function goHome() { setScreen('home'); setSelectedOption(null); setShowFeedback(false); }
  function completeSignup(nextProfile) {
    setProfile(nextProfile);
    localStorage.setItem('drivequest-profile', JSON.stringify(nextProfile));
    setScreen('home');
  }
  const timerLabel = `${String(Math.floor(examTime / 60)).padStart(2, '0')}:${String(examTime % 60).padStart(2, '0')}`;

  if (!profile) return <SignUp onComplete={completeSignup} />;

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={goHome} aria-label="Retour à l’accueil"><span className="brand-mark">D<span>Q</span></span><span>Drive<span>Quest</span></span></button>
      <div className="top-stats"><div className="xp-pill"><span className="bolt">✦</span><b>{xp}</b><small>XP</small></div><div className="streak-pill"><span>◔</span><b>7</b><small>jours</small></div><button className="avatar-button" onClick={goHome}>A</button></div>
    </header>

    <main className="main-content">
      {screen === 'home' && <Home progress={progress} masteryAverage={masteryAverage} reviewQuestions={reviewQuestions} onChapter={startTraining} onExam={startExam} onReview={() => setScreen('review')} />}
      {screen === 'training' && <Training question={currentQuestion} index={currentIndex} total={queue.length} selectedOption={selectedOption} showFeedback={showFeedback} score={sessionScore} mode={mode} onChoose={chooseTrainingOption} onNext={nextTraining} onQuit={goHome} />}
      {screen === 'exam' && <Exam question={examQueue[examIndex]} index={examIndex} total={examQueue.length} timer={timerLabel} onAnswer={answerExam} onQuit={goHome} />}
      {screen === 'results' && <Results result={examResult} onHome={goHome} onRetry={startExam} />}
      {screen === 'review' && <ReviewList questions={reviewQuestions} onBack={goHome} onStart={() => startTraining(null, 'review')} />}
    </main>

    {screen !== 'exam' && screen !== 'training' && <nav className="bottom-nav"><button className={screen === 'home' ? 'active' : ''} onClick={goHome}><span>⌂</span>Parcours</button><button className={screen === 'results' ? 'active' : ''} onClick={() => setScreen('results')}><span>◈</span>Résultats</button><button className={screen === 'review' ? 'active' : ''} onClick={() => setScreen('review')}><span>↺</span>Révision{reviewQuestions.length > 0 && <b>{reviewQuestions.length}</b>}</button></nav>}
  </div>;
}

function SignUp({ onComplete }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [error, setError] = useState('');
  function update(field, value) { setForm((previous) => ({ ...previous, [field]: value })); }
  function submit(event) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Tous les champs sont nécessaires pour créer ton profil.');
      return;
    }
    if (!form.email.trim().includes('@')) {
      setError('Indique une adresse e-mail avec le symbole @.');
      return;
    }
    onComplete({ ...form, createdAt: new Date().toISOString() });
  }
  return <div className="signup-shell"><div className="signup-visual"><button className="brand signup-brand" onClick={() => window.location.reload()} aria-label="Recharger DriveQuest"><span className="brand-mark">D<span>Q</span></span><span>Drive<span>Quest</span></span></button><div className="signup-orbit signup-orbit-one" /><div className="signup-orbit signup-orbit-two" /><Mascot mood="excited" /><div className="signup-quote"><span>TON PERMIS.</span><strong>TON AVENTURE.</strong><p>Apprends à ton rythme, progresse à chaque réponse.</p></div></div><div className="signup-panel"><div className="signup-panel-inner"><span className="eyebrow">PREMIÈRE ÉTAPE</span><h1>Créons ton<br /><em>profil pilote.</em></h1><p className="signup-intro">Quelques informations pour personnaliser ton parcours DriveQuest.</p><form onSubmit={submit} className="signup-form"><div className="field-row"><label><span>Prénom</span><input value={form.firstName} onChange={(event) => update('firstName', event.target.value)} placeholder="Ex. Aïcha" autoComplete="given-name" /></label><label><span>Nom</span><input value={form.lastName} onChange={(event) => update('lastName', event.target.value)} placeholder="Ex. Houngbédji" autoComplete="family-name" /></label></div><label><span>Numéro de téléphone</span><input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Ex. +229 97 00 00 00" autoComplete="tel" /></label><label><span>Adresse e-mail</span><input type="text" inputMode="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="toi@exemple.com" autoComplete="email" /></label>{error && <p className="signup-error" role="alert">{error}</p>}<button className="primary-btn signup-submit" type="submit">Commencer mon parcours <span>→</span></button></form><p className="privacy-note"><span>i</span> Tes informations sont enregistrées uniquement sur cet appareil dans cette version de démonstration. Aucun compte serveur ni envoi d’e-mail n’est encore activé.</p></div></div></div>;
}

function Home({ progress, masteryAverage, reviewQuestions, onChapter, onExam, onReview }) {
  return <div className="home-page">
    <div className="hero-card">
      <div className="hero-copy"><div className="eyebrow">TON PARCOURS • JOUR 7</div><h1>Prêt à prendre<br /><em>la route ?</em></h1><p>Chaque bonne réponse te rapproche de ton permis. On avance ensemble, un panneau à la fois.</p><div className="hero-actions"><button className="primary-btn" onClick={() => onChapter(null)}>Continuer l’entraînement <span>→</span></button><button className="ghost-btn" onClick={onExam}>Passer un examen blanc</button></div></div><div className="hero-art"><div className="sun-orbit orbit-one" /><div className="sun-orbit orbit-two" /><Mascot mood="excited" /></div>
    </div>
    <div className="notice"><span className="notice-icon">i</span><p><b>Repère béninois</b> · Les notions suivent les repères du Code de la route et des services publics béninois. Le contenu reste indicatif : valide toujours les modalités avec ton auto-école et les sources officielles.</p><a href="https://www.gouv.bj/download/174/jeudi-service-public-tout-savoir-permis-conduire-benin_.pdf/" target="_blank" rel="noreferrer">Voir la fiche officielle ↗</a></div>
    <section className="section-heading"><div><span className="eyebrow">TON AVANCÉE</span><h2>La carte de ton permis</h2></div><div className="average-progress"><ProgressRing value={masteryAverage} size={58} /><span>maîtrise<br /><b>globale</b></span></div></section>
    <div className="chapter-map">{chapters.map((chapter, index) => <button className={`chapter-card chapter-${chapter.color} ${index % 2 ? 'offset' : ''}`} key={chapter.id} onClick={() => onChapter(chapter.id)}><div className="chapter-top"><span className="chapter-number">{chapter.number}</span><span className="chapter-icon">{chapter.icon}</span><ProgressRing value={progress[chapter.id]} size={56} /></div><h3>{chapter.name}</h3><p>{chapter.short}</p><div className="chapter-foot"><span>{progress[chapter.id] >= 70 ? 'Maîtrisé' : progress[chapter.id] >= 35 ? 'En cours' : 'À découvrir'}</span><span>→</span></div></button>)}</div>
    <section className="practice-strip"><div className="practice-icon">⌁</div><div><span className="eyebrow">MODE RAPIDE</span><h3>Révise tes erreurs</h3><p>{reviewQuestions.length ? `${reviewQuestions.length} notion${reviewQuestions.length > 1 ? 's' : ''} attend${reviewQuestions.length > 1 ? 'ent' : ''} ton attention.` : 'Ta liste est vide. Bravo !'}</p></div><button className="secondary-btn" onClick={onReview}>Ouvrir la révision <span>→</span></button></section>
    <section className="exam-banner"><div><span className="eyebrow">DÉFI DU JOUR</span><h2>50 questions · 45 minutes</h2><p>Objectif de réussite : <strong>90 / 100</strong>. Prends le volant et teste-toi dans les conditions de l’épreuve.</p></div><button className="dark-btn" onClick={onExam}>Commencer <span>↗</span></button></section>
  </div>;
}

function Training({ question, index, total, selectedOption, showFeedback, score, mode, onChoose, onNext, onQuit }) {
  if (!question) return null;
  const correct = selectedOption === question.answer;
  return <div className="training-page"><div className="training-head"><button className="back-btn" onClick={onQuit}>← <span>Quitter</span></button><div className="question-progress"><span>{mode === 'review' ? 'RÉVISION' : 'ENTRAÎNEMENT'}</span><div><i style={{ width: `${((index + (showFeedback ? 1 : 0)) / total) * 100}%` }} /></div><b>{index + 1} <small>/ {total}</small></b></div><div className="mini-score">{score.correct}<small> bonnes</small></div></div><div className={`question-card ${showFeedback ? (correct ? 'is-correct' : 'is-wrong') : ''}`}><div className="question-meta"><span className="tag">{chapters.find((item) => item.id === question.chapter)?.short}</span><span className="question-id">Question {String(index + 1).padStart(2, '0')}</span></div>{question.sign && <SignIllustration type={question.sign} />}<h1>{question.question}</h1><div className="answer-grid">{question.options.map((option, optionIndex) => <button key={option} disabled={showFeedback} onClick={() => onChoose(optionIndex)} className={`answer-btn ${selectedOption === optionIndex ? (correct ? 'selected-correct' : 'selected-wrong') : ''} ${showFeedback && optionIndex === question.answer ? 'reveal-correct' : ''}`}><span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{showFeedback && optionIndex === question.answer && <span className="answer-check">✓</span>}{showFeedback && selectedOption === optionIndex && !correct && <span className="answer-cross">×</span>}</button>)}</div>{showFeedback && <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}`}><div className="feedback-mascot"><Mascot mood={correct ? 'happy' : 'sad'} compact /></div><div><strong>{correct ? 'Bien joué !' : 'Pas cette fois…'}</strong><p>{question.explanation}</p></div></div>}</div>{showFeedback && <div className="next-row"><span>{correct ? '+10 XP · Ta maîtrise progresse' : 'Ajouté automatiquement à ta révision'}</span><button className="primary-btn" onClick={onNext}>{index + 1 >= total ? 'Terminer la session' : 'Question suivante'} <span>→</span></button></div>}</div>;
}

function ReviewList({ questions: reviewQuestions, onBack, onStart }) {
  return <div className="review-page"><div className="review-heading"><button className="back-btn" onClick={onBack}>← <span>Retour au parcours</span></button><span className="eyebrow">TON CARNET DE BORD</span><h1>Révision ciblée</h1><p>Les questions que tu as ratées sont conservées ici pour transformer chaque erreur en réflexe.</p></div>{reviewQuestions.length ? <><div className="review-list">{reviewQuestions.map((question, index) => <div className="review-item" key={question.id}><div className="review-index">{String(index + 1).padStart(2, '0')}</div><div className="review-item-copy"><span className="tag">{chapters.find((chapter) => chapter.id === question.chapter)?.short}</span><h3>{question.question}</h3><p>{question.explanation}</p></div><span className="review-arrow">→</span></div>)}</div><button className="primary-btn review-start" onClick={onStart}>Réviser ces notions <span>→</span></button></> : <div className="empty-review"><Mascot mood="excited" compact /><h2>Tout est à jour !</h2><p>Réponds à quelques questions pour alimenter ton carnet de bord.</p><button className="secondary-btn" onClick={onBack}>Retourner au parcours</button></div>}</div>;
}

function Exam({ question, index, total, timer, onAnswer, onQuit }) {
  if (!question) return null;
  return <div className="exam-page"><div className="exam-top"><button className="back-btn" onClick={onQuit}>× <span>Quitter l’examen</span></button><div className={`timer ${timer.startsWith('00:') ? 'timer-alert' : ''}`}><span>◷</span>{timer}</div><span className="exam-count">{index + 1} / {total}</span></div><div className="exam-progress"><i style={{ width: `${(index / total) * 100}%` }} /></div><div className="exam-intro"><span className="eyebrow">EXAMEN BLANC · CONDITIONS RÉELLES</span><h1>Choisis la meilleure réponse.</h1><p>Pas d’explication pendant l’examen. Tu découvriras ton score et ton radar à la fin.</p></div><div className="exam-question-card">{question.sign && <SignIllustration type={question.sign} />}<div className="exam-question-number">Q{String(index + 1).padStart(2, '0')}</div><h2>{question.question}</h2><div className="answer-grid">{question.options.map((option, optionIndex) => <button key={option} className="answer-btn" onClick={() => onAnswer(optionIndex)}><span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span><span className="answer-arrow">→</span></button>)}</div></div></div>;
}

function Results({ result, onHome, onRetry }) {
  if (!result) return <div className="empty-results"><Mascot /><h1>Pas encore de résultat</h1><p>Ton prochain examen blanc apparaîtra ici.</p><button className="primary-btn" onClick={onRetry}>Lancer un examen <span>→</span></button></div>;
  const passed = result.score >= 90;
  return <div className="results-page"><div className="results-hero"><div className="result-burst">{passed ? '✦' : '·'}</div><div className="result-mascot"><Mascot mood={passed ? 'excited' : 'sad'} /></div><span className="eyebrow">EXAMEN BLANC TERMINÉ</span><h1>{passed ? 'Tu es sur la bonne voie !' : 'Encore quelques tours de piste.'}</h1><p>{passed ? 'Ton résultat dépasse le seuil annoncé. Continue à consolider tes chapitres les plus fragiles.' : 'Chaque erreur est une indication utile. Rejoue les notions ajoutées à ta révision.'}</p><div className="score-reveal"><strong>{result.score}</strong><span>/ 100</span></div><div className={`result-status ${passed ? 'passed' : 'failed'}`}>{passed ? '✓ ADMIS · SEUIL 90 / 100' : '↺ À REFAIRE · OBJECTIF 90 / 100'}</div></div><div className="results-grid"><section className="result-panel"><div className="panel-title"><div><span className="eyebrow">VUE D’ENSEMBLE</span><h2>Ton radar de conduite</h2></div><span className="muted">{result.correct} / {result.total} bonnes réponses</span></div><RadarChart values={result.byChapter} /></section><section className="result-panel chapter-results"><div className="panel-title"><div><span className="eyebrow">À RETENIR</span><h2>Chapitre par chapitre</h2></div></div>{chapters.map((chapter, index) => <div className="result-line" key={chapter.id}><span className={`dot dot-${chapter.color}`} /><span>{chapter.name}</span><b>{result.byChapter[index]}%</b><div><i style={{ width: `${result.byChapter[index]}%` }} /></div></div>)}</section></div><div className="results-actions"><button className="ghost-btn" onClick={onHome}>Retour au parcours</button><button className="primary-btn" onClick={onRetry}>Rejouer l’examen <span>→</span></button></div><p className="source-note">Repère pédagogique indicatif. Le seuil et les modalités doivent être confirmés avec l’auto-école et les sources officielles béninoises.</p></div>;
}

createRoot(document.getElementById('root')).render(<App />);
