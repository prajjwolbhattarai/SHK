
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Magazine from './pages/Magazine';
import { CMS } from './pages/CMS';
import Login from './pages/Login';
import ArticleReader from './pages/ArticleReader';
import Directory from './pages/Directory'; // Import new Directory page
import { Article, Business } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const INITIAL_CATEGORIES = [
  'Branchen-News',
  'Betriebs-Features',
  'Personal & Karriere',
  'Technologie',
  'Energie & Nachhaltigkeit',
  'Regional'
];

// Helper to generate realistic content
const generateContent = (title: string, topic: string, category: string, imageKeyword: string) => `
  <p class="lead">In der heutigen Ausgabe von SHK Rhein-Neckar widmen wir uns dem Thema <strong>${topic}</strong>. Ein Bereich, der für Fachhandwerker in der Region immer wichtiger wird.</p>
  
  <h2>Warum ${topic} jetzt relevant ist</h2>
  <p>Die Branche befindet sich im Wandel. Experten sind sich einig: Wer jetzt nicht handelt, verliert den Anschluss. In Mannheim und Heidelberg sehen wir bereits, wie führende Betriebe diese Entwicklung für sich nutzen.</p>
  
  <figure>
    <img src="https://images.unsplash.com/photo-${imageKeyword}?auto=format&fit=crop&q=80&w=1200" alt="${topic}" style="width: 100%; border-radius: 4px; margin: 32px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <figcaption style="text-align: center; font-size: 0.9em; color: #666; margin-top: -20px; margin-bottom: 32px; font-style: italic;">Praxisbeispiel: ${topic} im Einsatz.</figcaption>
  </figure>

  <h3>Herausforderungen in der Praxis</h3>
  <p>Natürlich ist die Umstellung nicht ohne Hürden. Materialengpässe, Fachkräftemangel und bürokratische Hürden bremsen oft die Euphorie. Doch die Zahlen sprechen eine klare Sprache: Die Investition lohnt sich langfristig.</p>
  
  <blockquote>"Wir haben unsere Prozesse komplett auf ${topic} ausgerichtet und konnten die Effizienz um 30% steigern." – Ein lokaler Handwerksmeister</blockquote>

  <h3>Fazit für Ihren Betrieb</h3>
  <p>Nutzen Sie die kommenden Monate, um sich in diesem Bereich weiterzubilden. Die Handwerkskammer und lokale Innungen bieten entsprechende Schulungen an.</p>

  <ul>
    <li>Prüfen Sie Ihre aktuelle Aufstellung bezüglich ${topic}.</li>
    <li>Sprechen Sie mit Ihren Lieferanten über neue Möglichkeiten.</li>
    <li>Schulen Sie Ihre Mitarbeiter frühzeitig.</li>
  </ul>
`;

// Data Definitions for 12 Articles per Category
const ARTICLE_DATA = {
  'Branchen-News': [
    { t: 'Neue Energieverordnungen 2025: Was gilt ab Januar?', img: '1497366216548-37526070297c' },
    { t: 'Rückblick ISH Messe Frankfurt: Die Highlights', img: '1542744173-8e7e53415bb0' },
    { t: 'Großhandelspreise stabilisieren sich endlich', img: '1586528116311-ad8dd3c8310d' },
    { t: 'Fusion von zwei großen Heizungs-Herstellern', img: '1507679721845-63bd00e6183b' },
    { t: 'Handwerkermangel erreicht neuen Höhepunkt', img: '1504328345606-18bbc8c9d7d1' },
    { t: 'Digitalisierungspflicht für Bauanträge kommt', img: '1454165804606-c3d57bc86b40' },
    { t: 'Neue DIN-Normen für Trinkwasserhygiene', img: '1532601224476-15c79f2f7a51' },
    { t: 'Förderstopp für reine Gasheizungen beschlossen', img: '1621905251189-08b45d6a269e' },
    { t: 'SHK-Konjunkturbarometer Q3: Stimmung gemischt', img: '1590283603385-17ffb3a7f29f' },
    { t: 'Lieferengpässe bei Wärmepumpen beendet', img: '1513828583688-601bf3925e2e' },
    { t: 'Tarifverhandlungen im Handwerk: Einigung erzielt', img: '1521791136064-7986c2920216' },
    { t: 'Smart-Home Standards endlich vereinheitlicht', img: '1558002038-1091a1661116' }
  ],
  'Betriebs-Features': [
    { t: 'Wie Müller & Söhne komplett papierlos wurden', img: '1516321318423-f06f85e504b3' },
    { t: 'Erfolgsgeschichte: Vom Ein-Mann-Betrieb zur GmbH', img: '1556761175-5973dc0f32e7' },
    { t: 'Nachfolgeplanung: Wenn der Junior übernimmt', img: '1519389950476-295375a3c876' },
    { t: 'Werkstatt-Optimierung nach Lean-Prinzipien', img: '1581091226825-a6a2a5aee158' },
    { t: 'Kundenbindung durch digitale Wartungsverträge', img: '1551288049-bebda4e38f71' },
    { t: 'Fuhrpark-Management: E-Mobilität im Handwerk', img: '1593941707882-a5bba14938c7' },
    { t: 'Büro-Organisation: Tools die Zeit sparen', img: '1497215728101-856f4ea42174' },
    { t: 'Marketing für Handwerker: Instagram & Co', img: '1611162617474-5b21e879e113' },
    { t: 'Die perfekte Baustellen-Dokumentation', img: '1503387762-592deb58ef4e' },
    { t: 'Effiziente Lagerhaltung: Nie wieder Suchen', img: '1586528116311-ad8dd3c8310d' },
    { t: 'Mitarbeitermotivation im stressigen Alltag', img: '1522071820081-009f0129c71c' },
    { t: 'Finanzierung von Großprojekten sicherstellen', img: '1554224155-8d04cb21cd6c' }
  ],
  'Personal & Karriere': [
    { t: 'Azubi-Recruiting auf TikTok: Ein Leitfaden', img: '1611162616305-c69b3fa7fbe0' },
    { t: 'Frauen im SHK-Handwerk: Ein Porträt', img: '1573496359142-b8d87734a5a2' },
    { t: 'Gehaltsreport 2025: Was verdient ein Meister?', img: '1554224155-8d04cb21cd6c' },
    { t: 'Weiterbildung zum Gebäude-Energieberater', img: '1517048696773-61f6231e4c03' },
    { t: 'Work-Life-Balance auf Montage: Geht das?', img: '1501504905252-473c47e087f8' },
    { t: 'Führungskräfte-Training für Jungmeister', img: '1519389950476-295375a3c876' },
    { t: 'Quereinsteiger erfolgreich ins Team integrieren', img: '1521791136064-7986c2920216' },
    { t: 'Gesundheitsmanagement: Rücken schonen', img: '1571019614242-c5c5dee9f50b' },
    { t: 'Die 4-Tage-Woche im Praxistest', img: '1454165804606-c3d57bc86b40' },
    { t: 'Azubi-Austauschprogramme in Europa', img: '1523240795612-9a054b0db644' },
    { t: 'Benefits, die Fachkräfte wirklich wollen', img: '1556761175-5973dc0f32e7' },
    { t: 'Karrierewege nach der Ausbildung', img: '1486312338219-ce68d2c6f44d' }
  ],
  'Technologie': [
    { t: 'KI in der Heizungswartung: Predictive Maintenance', img: '1518770660439-4636190af475' },
    { t: 'Drohnen für Dach- und Kamininspektionen', img: '1506947411449-b64ff92201ed' },
    { t: '3D-Badplanung mit der VR-Brille erleben', img: '1592478411213-61532f94c038' },
    { t: 'Der vernetzte Heizungskeller der Zukunft', img: '1558002038-1091a1661116' },
    { t: 'Wasserstoff-Ready Kessel: Stand der Technik', img: '1532601224476-15c79f2f7a51' },
    { t: 'Die besten Apps für das digitale Aufmaß', img: '1551288049-bebda4e38f71' },
    { t: 'Smarte Thermostate im großen Vergleich', img: '1563770099-43e98d63375a' },
    { t: 'Robotik bei der Rohrsanierung', img: '1485827404703-89b55fcc595e' },
    { t: 'IoT-Sensoren zur Leckageortung', img: '1550751827-4bd374c3f58b' },
    { t: 'Exoskelette für schwere Lasten auf dem Bau', img: '1581091226825-a6a2a5aee158' },
    { t: 'Software für die effiziente Einsatzplanung', img: '1460925895917-afdab827c52f' },
    { t: 'Cyber-Security für Smart Home Installationen', img: '1563986768609-322da13575f3' }
  ],
  'Energie & Nachhaltigkeit': [
    { t: 'Wärmepumpen im Altbau: Was ist möglich?', img: '1592833159057-65a2d0856048' },
    { t: 'Solarthermie vs. Photovoltaik: Der Vergleich', img: '1509391366360-2e959784a276' },
    { t: 'Grauwassernutzung im Einfamilienhaus', img: '1517478347898-1317d7b13998' },
    { t: 'Holzpellets: Eine nachhaltige Alternative?', img: '1513828583688-601bf3925e2e' },
    { t: 'Geothermie in der Rhein-Neckar Region', img: '1466611653243-cae5f2460d85' },
    { t: 'Energieausweis richtig lesen und erstellen', img: '1450101499163-c8848c66ca85' },
    { t: 'Hydraulischer Abgleich einfach erklärt', img: '1621905252507-b35492cc74b4' },
    { t: 'Wohnraumlüftung mit Wärmerückgewinnung', img: '1513262334863-1492b45e771c' },
    { t: 'Grüne Kredite für energetische Sanierungen', img: '1554224155-8d04cb21cd6c' },
    { t: 'CO2-Bepreisung und ihre Folgen für Kunden', img: '1516937044662-5e3791418bfe' },
    { t: 'Passivhaus-Standards 2025', img: '1500336236962-42173167a57a' },
    { t: 'Recycling von alten Heizungsanlagen', img: '1532996126620-e918996f6428' }
  ],
  'Regional': [
    { t: 'Großprojekt: Sanierung Mannheim Klinikum', img: '1504917595217-d4dc5ebe6122' },
    { t: 'Herausforderung: Heidelberger Schloss', img: '1568632168969-92b425b04169' },
    { t: 'Neubaugebiet Ludwigshafen Süd: Ein Bericht', img: '1597217329598-a620b784a440' },
    { t: 'Interview mit der Handwerkskammer Mannheim', img: '1556761175-5973dc0f32e7' },
    { t: 'Lokale Förderprogramme Rhein-Neckar im Check', img: '1579621970568-a3aa04251b77' },
    { t: 'Kooperation mit Stadtwerken Heidelberg', img: '1473341304177-f26f84052f40' },
    { t: 'SHK-Innungsausflug in den Odenwald', img: '1501504905252-473c47e087f8' },
    { t: 'Firmenjubiläum Schmidt GmbH Weinheim', img: '1519389950476-295375a3c876' },
    { t: 'Berufsschule Mannheim modernisiert Werkstätten', img: '1581094794329-cd136ce4dad9' },
    { t: 'Hochwasserschutz am Neckar: Pumpen im Einsatz', img: '1583321500900-82807e458f3c' },
    { t: 'Fernwärmeausbau in der Metropolregion', img: '1513828742343-522d4a9713c2' },
    { t: 'Start-up Szene im Technologiepark Heidelberg', img: '1559136555-930d72f1d300' }
  ]
};

// Generate the flat list of articles
const GENERATED_ARTICLES: Article[] = [];
let idCounter = 1;

Object.entries(ARTICLE_DATA).forEach(([category, items]) => {
  items.forEach((item, index) => {
    GENERATED_ARTICLES.push({
      id: `art-${idCounter++}`,
      type: 'article',
      title: item.t,
      summary: `Ein umfassender Bericht über ${item.t.split(':')[0]}. Erfahren Sie, was dies für die Region Rhein-Neckar bedeutet.`,
      content: generateContent(item.t, item.t.split(':')[0], category, item.img),
      imageUrl: `https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&q=80&w=1200`,
      category: category,
      author: index % 3 === 0 ? 'Redaktion' : (index % 3 === 1 ? 'Markus Weber' : 'Julia Schmidt'),
      publishedAt: new Date(Date.now() - (index * 86400000) - (Math.random() * 1000000000)).toISOString(),
      featured: index === 0 && category === 'Branchen-News', // Only one main featured per cat logic if needed, or global
      views: Math.floor(Math.random() * 5000) + 500,
      shares: Math.floor(Math.random() * 300),
      readTime: Math.floor(Math.random() * 300) + 120,
      videoUrl: index === 3 ? 'https://www.youtube.com/watch?v=Fj0X1Wn6Eew' : undefined // Add some videos
    });
  });
});

// Add Static Pages
const STATIC_PAGES: Article[] = [
  {
    id: 'page-imprint',
    type: 'page',
    title: 'Impressum',
    summary: 'Rechtliche Informationen',
    content: `
      <h2>Impressum</h2>
      <p><strong>Angaben gemäß § 5 TMG</strong></p>
      <p>SHK Rhein-Neckar Magazin GmbH<br>Wasserturmstraße 12<br>68161 Mannheim<br>Deutschland</p>
      <p><strong>Vertreten durch:</strong><br>Max Mustermann</p>
      <p><strong>Kontakt:</strong><br>Telefon: +49 (0) 621 12345-0<br>E-Mail: kontakt@shk-rhein-neckar.de</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    category: 'Page',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: false,
    views: 0,
    shares: 0,
    readTime: 0
  },
  {
    id: 'page-privacy',
    type: 'page',
    title: 'Datenschutzerklärung',
    summary: 'Datenschutz',
    content: '<h2>Datenschutz</h2><p>Wir nehmen den Schutz Ihrer Daten ernst...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    category: 'Page',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: false,
    views: 0,
    shares: 0,
    readTime: 0
  },
  {
    id: 'page-terms',
    type: 'page',
    title: 'AGB',
    summary: 'Allgemeine Geschäftsbedingungen',
    content: '<h2>AGB</h2><p>Allgemeine Geschäftsbedingungen für die Nutzung...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200',
    category: 'Page',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    featured: false,
    views: 0,
    shares: 0,
    readTime: 0
  },
  {
    id: 'page-submit',
    type: 'page',
    title: 'Story einreichen',
    summary: 'Senden Sie uns Ihre Story',
    content: `
      <h2>Ihre Geschichte im Magazin</h2>
      <p>Senden Sie uns Ihre Projektberichte an <a href="mailto:redaktion@shk-rhein-neckar.de">redaktion@shk-rhein-neckar.de</a></p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=1200',
    category: 'Page',
    author: 'Redaktion',
    publishedAt: new Date().toISOString(),
    featured: false,
    views: 0,
    shares: 0,
    readTime: 0
  },
  {
    id: 'page-advertising',
    type: 'page',
    title: 'Werben & Partner',
    summary: 'Werbemöglichkeiten',
    content: `
      <h2>Media-Daten</h2>
      <p>Erreichen Sie 5000+ Fachkräfte. Kontakt: <a href="mailto:ads@shk-rhein-neckar.de">ads@shk-rhein-neckar.de</a></p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200',
    category: 'Page',
    author: 'Sales',
    publishedAt: new Date().toISOString(),
    featured: false,
    views: 0,
    shares: 0,
    readTime: 0
  },
  {
    id: 'page-jobs',
    type: 'page',
    title: 'Stellenmarkt',
    summary: 'Jobs in der Region',
    content: `
      <h2>SHK Jobs Rhein-Neckar</h2>
      <p>Inserieren Sie hier. Kontakt: <a href="mailto:jobs@shk-rhein-neckar.de">jobs@shk-rhein-neckar.de</a></p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
    category: 'Page',
    author: 'HR',
    publishedAt: new Date().toISOString(),
    featured: false,
    views: 0,
    shares: 0,
    readTime: 0
  }
];

// New Mock Data for Business Directory
const MOCK_DIRECTORY: Business[] = [
  { id: 'dir-1', name: 'Heizungstechnik Müller GmbH', category: 'Heizung', address: 'Hauptstraße 10', city: 'Mannheim', zip: '68159', phone: '0621 123456', website: 'https://heizung-mueller.de', description: 'Spezialist für moderne Heizsysteme und Wärmepumpen.', logoUrl: 'https://logo.clearbit.com/heizung-mueller.de' },
  { id: 'dir-2', name: 'Sanitär-Service Weber', category: 'Sanitär', address: 'Bergheimer Straße 58', city: 'Heidelberg', zip: '69115', phone: '06221 654321', website: 'https://sanitaer-weber.de', description: 'Komplettbäder aus einer Hand. Barrierefreie Umbauten.', logoUrl: 'https://logo.clearbit.com/sanitaer-weber.de' },
  { id: 'dir-3', name: 'Klima-Profis Rhein-Neckar', category: 'Klima', address: 'Industriestraße 35', city: 'Ludwigshafen', zip: '67063', phone: '0621 987654', website: 'https://klima-profis-rn.de', description: 'Installation und Wartung von Klimaanlagen für Gewerbe und Privat.', logoUrl: 'https://logo.clearbit.com/klima-profis-rn.de' },
  { id: 'dir-4', name: 'Lüftungsbau Schmidt', category: 'Lüftung', address: 'Mittelstraße 5', city: 'Weinheim', zip: '69469', phone: '06201 123789', website: 'https://lueftung-schmidt.de', description: 'Planung und Einbau von zentralen und dezentralen Lüftungsanlagen.', logoUrl: 'https://logo.clearbit.com/lueftung-schmidt.de' },
  { id: 'dir-5', name: 'Elektro-Technik Fischer', category: 'Elektro', address: 'Schulstraße 21', city: 'Schwetzingen', zip: '68723', phone: '06202 987123', website: 'https://elektro-fischer.com', description: 'Smart Home Installationen und Photovoltaik-Anlagen.', logoUrl: 'https://logo.clearbit.com/elektro-fischer.com' },
  { id: 'dir-6', name: 'Bade-Träume GmbH', category: 'Sanitär', address: 'Planken 4', city: 'Mannheim', zip: '68161', phone: '0621 555666', website: 'https://badetraeume-ma.de', description: 'Exklusive Badgestaltung und hochwertige Armaturen.', logoUrl: 'https://logo.clearbit.com/badetraeume-ma.de' },
  { id: 'dir-7', name: 'Wärme-Konzept Rhein-Neckar', category: 'Heizung', address: 'Kurfürsten-Anlage 1', city: 'Heidelberg', zip: '69115', phone: '06221 777888', website: 'https://waerme-konzept-hd.de', description: 'Energieberatung und hydraulischer Abgleich.', logoUrl: 'https://logo.clearbit.com/waerme-konzept-hd.de' },
  { id: 'dir-8', name: 'Frische Luft Systeme', category: 'Lüftung', address: 'Bürgermeister-Grünzweig-Straße 11', city: 'Ludwigshafen', zip: '67059', phone: '0621 333444', website: 'https://frischeluft-lu.de', description: 'Spezialist für Wohnraumlüftung mit Wärmerückgewinnung.', logoUrl: 'https://logo.clearbit.com/frischeluft-lu.de' },
  { id: 'dir-9', name: 'Solar & Strom Wagner', category: 'Elektro', address: 'Mannheimer Landstraße 2', city: 'Hockenheim', zip: '68766', phone: '06205 222333', website: 'https://solar-wagner.de', description: 'Installation von PV-Anlagen und Stromspeichern.', logoUrl: 'https://logo.clearbit.com/solar-wagner.de' },
  { id: 'dir-10', name: 'Haustechnik Klein', category: 'Heizung', address: 'Bahnhofstraße 40', city: 'Sinsheim', zip: '74889', phone: '07261 444555', website: 'https://haustechnik-klein.de', description: '24h Notdienst für Heizung und Sanitär.', logoUrl: 'https://logo.clearbit.com/haustechnik-klein.de' },
  { id: 'dir-11', name: 'Die Bad-Designer', category: 'Sanitär', address: 'Rohrbacher Str. 12', city: 'Heidelberg', zip: '69115', phone: '06221 666777', website: 'https://die-baddesigner.de', description: 'Individuelle Badplanung in 3D.', logoUrl: 'https://logo.clearbit.com/die-baddesigner.de' },
  { id: 'dir-12', name: 'Kühltechnik Becker', category: 'Klima', address: 'Friedrich-Ebert-Straße 1', city: 'Viernheim', zip: '68519', phone: '06204 888999', website: 'https://kuehltechnik-becker.de', description: 'Klimatisierung für Serverräume und Gewerbe.', logoUrl: 'https://logo.clearbit.com/kuehltechnik-becker.de' },
  { id: 'dir-13', name: 'Elektro Bauer & Söhne', category: 'Elektro', address: 'Marktplatz 9', city: 'Worms', zip: '67547', phone: '06241 111222', website: 'https://elektro-bauer.de', description: 'Traditionsbetrieb seit 1950.', logoUrl: 'https://logo.clearbit.com/elektro-bauer.de' },
  { id: 'dir-14', name: 'Pellet-Heizungen Frank', category: 'Heizung', address: 'Odenwaldstraße 22', city: 'Eberbach', zip: '69412', phone: '06271 333444', website: 'https://pellet-frank.de', description: 'Biomasse-Heizungen und Pelletlager.', logoUrl: 'https://logo.clearbit.com/pellet-frank.de' },
  { id: 'dir-15', name: 'Wasser-Welt Ludwigshafen', category: 'Sanitär', address: 'Rheinuferstraße 7', city: 'Ludwigshafen', zip: '67061', phone: '0621 555111', website: 'https://wasser-welt-lu.de', description: 'Wasseraufbereitung und Legionellenprüfung.', logoUrl: 'https://logo.clearbit.com/wasser-welt-lu.de' },
  { id: 'dir-16', name: 'Air-Control GmbH', category: 'Klima', address: 'Augustaanlage 30', city: 'Mannheim', zip: '68165', phone: '0621 222888', website: 'https://air-control-ma.de', description: 'Großanlagen für Bürogebäude und Industrie.', logoUrl: 'https://logo.clearbit.com/air-control-ma.de' },
  { id: 'dir-17', name: 'Licht & Kraft Elektroservice', category: 'Elektro', address: 'Hauptstraße 100', city: 'Wiesloch', zip: '69168', phone: '06222 777999', website: 'https://licht-kraft-wiesloch.de', description: 'E-Ladesäulen und Netzwerktechnik.', logoUrl: 'https://logo.clearbit.com/licht-kraft-wiesloch.de' },
  { id: 'dir-18', name: 'Heizungs-Notdienst 24/7', category: 'Heizung', address: 'Mobil in der Region', city: 'Rhein-Neckar', zip: '68159', phone: '0176 12345678', website: 'https://notdienst-shk-rn.de', description: 'Soforthilfe bei Heizungsausfall.', logoUrl: 'https://logo.clearbit.com/notdienst-shk-rn.de' },
  { id: 'dir-19', name: 'Bad & Fliese Lehmann', category: 'Sanitär', address: 'Industriestraße 8', city: 'Speyer', zip: '67346', phone: '06232 444333', website: 'https://bad-lehmann.de', description: 'Komplettsanierung inklusive Fliesenarbeiten.', logoUrl: 'https://logo.clearbit.com/bad-lehmann.de' },
  { id: 'dir-20', name: 'Energietechnik Vogel', category: 'Heizung', address: 'Schlossstraße 3', city: 'Bruchsal', zip: '76646', phone: '07251 222111', website: 'https://energietechnik-vogel.de', description: 'Experte für Solarthermie und Blockheizkraftwerke.', logoUrl: 'https://logo.clearbit.com/energietechnik-vogel.de' },
];


const App: React.FC = () => {
  // Combine generated articles with static pages
  const [articles, setArticles] = useState<Article[]>([...GENERATED_ARTICLES, ...STATIC_PAGES]);
  const [directory, setDirectory] = useState<Business[]>(MOCK_DIRECTORY);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Magazine articles={articles} categories={categories} />} />
          <Route path="/article/:id" element={<ArticleReader articles={articles} categories={categories} />} />
          <Route path="/directory" element={<Directory businesses={directory} categories={categories} />} />
          
          {/* Admin Login */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                  <Navigate to="/cms" replace />
              ) : (
                  <Login onLogin={() => setIsAuthenticated(true)} />
              )
            } 
          />
          
          {/* Protected CMS Routes */}
          <Route
            path="/cms"
            element={
              isAuthenticated ? (
                <CMS
                  articles={articles}
                  setArticles={setArticles}
                  categories={categories}
                  setCategories={setCategories}
                  directory={directory}
                  setDirectory={setDirectory}
                  onLogout={() => setIsAuthenticated(false)}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
