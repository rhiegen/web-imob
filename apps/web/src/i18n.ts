import type { AreaGourmetTipo, PapelPessoa, TipoCozinha, TipoImovel, TipoLavanderia, TipoQuarto } from '@imob/shared';

export type Locale = 'pt-BR' | 'en' | 'es-PY' | 'gn' | 'de';

export const locales: Locale[] = ['pt-BR', 'en', 'es-PY', 'gn', 'de'];

export const localeNames: Record<Locale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
  'es-PY': 'ES-PY',
  gn: 'GN',
  de: 'DE',
};

type Dictionary = {
  appTag: string;
  appTitle: string;
  fakeDataNotice: string;
  heroTag: string;
  heroTitle: string;
  stackReady: string;
  accessibilityBar: string;
  fontSize: string;
  decreaseFont: string;
  resetFont: string;
  increaseFont: string;
  language: string;
  skipToContent: string;
  dashboard: string;
  people: string;
  properties: string;
  rentals: string;
  peopleCount: string;
  propertiesCount: string;
  rentalsCount: string;
  averageIncome: string;
  mvpScope: string;
  dashboardItems: string[];
  unifiedRegistry: string;
  demoPropertyRegistry: string;
  rentalDemo: string;
  newRegistry: string;
  newProperty: string;
  newRental: string;
  code: string;
  name: string;
  roles: string;
  document: string;
  profession: string;
  income: string;
  rent: string;
  rooms: string;
  area: string;
  kitchen: string;
  owners: string;
  landlord: string;
  tenant: string;
  start: string;
  end: string;
  extensionClause: string;
  period: string;
  index: string;
  percentage: string;
  value: string;
  focusStatus: string;
  themeNote: string;
  roleLabels: Record<PapelPessoa, string>;
  propertyTypeLabels: Record<TipoImovel, string>;
  kitchenLabels: Record<TipoCozinha, string>;
  laundryLabels: Record<TipoLavanderia, string>;
  roomTypeLabels: Record<TipoQuarto, string>;
  gourmetLabels: Record<AreaGourmetTipo, string>;
  propertyBriefs: Record<string, string>;
  propertyDetails: Record<string, string>;
  rentalClauses: Record<string, string>;
};

export const dictionaries: Record<Locale, Dictionary> = {
  'pt-BR': {
    appTag: 'MVP demonstrativo',
    appTitle: 'Imob Admin',
    fakeDataNotice: 'Dados fake apenas para demonstracao. Nenhuma persistencia real foi implementada.',
    heroTag: 'Planejado para React + TypeScript',
    heroTitle: 'Painel administrativo imobiliario',
    stackReady: 'Preparado para SQLite, PostgreSQL ou Oracle',
    accessibilityBar: 'Barra de acessibilidade',
    fontSize: 'Tamanho da fonte',
    decreaseFont: 'Diminuir fonte',
    resetFont: 'Fonte padrao',
    increaseFont: 'Aumentar fonte',
    language: 'Idioma',
    skipToContent: 'Ir para o conteudo principal',
    dashboard: 'Dashboard',
    people: 'Pessoas',
    properties: 'Imoveis',
    rentals: 'Alugueis',
    peopleCount: 'Pessoas',
    propertiesCount: 'Imoveis',
    rentalsCount: 'Alugueis',
    averageIncome: 'Renda media',
    mvpScope: 'Escopo do MVP',
    dashboardItems: [
      'Simular cadastro de pessoas com papeis de locador, locatario e proprietario',
      'Exibir imoveis e vinculacoes principais',
      'Demonstrar contratos de aluguel e periodos anuais',
      'Preparar a base para implementacao real futura sem duplicar modelagem',
    ],
    unifiedRegistry: 'Cadastro unificado para locador, locatario e proprietario.',
    demoPropertyRegistry: 'Cadastro demonstrativo com relacionamento de proprietario desacoplado.',
    rentalDemo: 'Demonstracao de contrato com periodos anuais e reajuste.',
    newRegistry: 'Novo cadastro',
    newProperty: 'Novo imovel',
    newRental: 'Novo aluguel',
    code: 'Codigo',
    name: 'Nome',
    roles: 'Papeis',
    document: 'Documento',
    profession: 'Profissao',
    income: 'Renda',
    rent: 'Aluguel',
    rooms: 'Quartos',
    area: 'Area',
    kitchen: 'Cozinha',
    owners: 'Proprietarios',
    landlord: 'Locador',
    tenant: 'Locatario',
    start: 'Inicio',
    end: 'Fim',
    extensionClause: 'Clausula de extensao',
    period: 'Periodo',
    index: 'Indice',
    percentage: 'Percentual',
    value: 'Valor',
    focusStatus: 'Tema dark, alto contraste e navegacao por teclado ativos no MVP.',
    themeNote: 'Tema dark com alto contraste e atalhos visuais de acessibilidade.',
    roleLabels: {
      locador: 'locador',
      locatario: 'locatario',
      proprietario: 'proprietario',
    },
    propertyTypeLabels: {
      'casa terrea': 'casa terrea',
      'casa geminada': 'casa geminada',
      apartamento: 'apartamento',
      'casa duplex': 'casa duplex',
      'apartamento duplex': 'apartamento duplex',
      'apartamento triplex': 'apartamento triplex',
      cobertura: 'cobertura',
      'casa tipo sobrado': 'casa tipo sobrado',
    },
    kitchenLabels: { americana: 'americana', comum: 'comum' },
    laundryLabels: { ampla: 'ampla', 'anexa a cozinha': 'anexa a cozinha' },
    roomTypeLabels: { suite: 'suite', solteiro: 'solteiro', casal: 'casal', 'casal suite': 'casal suite' },
    gourmetLabels: { simples: 'simples', 'na varanda': 'na varanda', 'ampla com churrasqueira': 'ampla com churrasqueira' },
    propertyBriefs: {
      IM001: 'Apartamento alto padrao mobiliado',
      IM002: 'Casa duplex com area gourmet ampla',
    },
    propertyDetails: {
      IM001: 'Unidade com varanda gourmet, cozinha americana e acabamento contemporaneo.',
      IM002: 'Imovel com quintal, churrasqueira e configuracao ideal para familia.',
    },
    rentalClauses: {
      AL001: 'Renovacao automatica mediante anuencia das partes e revisao contratual.',
    },
  },
  en: {
    appTag: 'Demonstration MVP',
    appTitle: 'Imob Admin',
    fakeDataNotice: 'Fake data for demonstration only. No real persistence has been implemented.',
    heroTag: 'Planned for React + TypeScript',
    heroTitle: 'Real estate administrative dashboard',
    stackReady: 'Prepared for SQLite, PostgreSQL, or Oracle',
    accessibilityBar: 'Accessibility bar',
    fontSize: 'Font size',
    decreaseFont: 'Decrease font',
    resetFont: 'Default font',
    increaseFont: 'Increase font',
    language: 'Language',
    skipToContent: 'Skip to main content',
    dashboard: 'Dashboard',
    people: 'People',
    properties: 'Properties',
    rentals: 'Rentals',
    peopleCount: 'People',
    propertiesCount: 'Properties',
    rentalsCount: 'Rentals',
    averageIncome: 'Average income',
    mvpScope: 'MVP scope',
    dashboardItems: [
      'Simulate a unified people registry for landlord, tenant, and owner roles',
      'Display properties and their main relationships',
      'Demonstrate rental contracts and yearly terms',
      'Prepare the base for future real implementation without duplicated modeling',
    ],
    unifiedRegistry: 'Unified registry for landlord, tenant, and owner.',
    demoPropertyRegistry: 'Demonstration registry with decoupled owner relationship.',
    rentalDemo: 'Contract demonstration with yearly terms and adjustment rate.',
    newRegistry: 'New record',
    newProperty: 'New property',
    newRental: 'New rental',
    code: 'Code',
    name: 'Name',
    roles: 'Roles',
    document: 'Document',
    profession: 'Profession',
    income: 'Income',
    rent: 'Rent',
    rooms: 'Rooms',
    area: 'Area',
    kitchen: 'Kitchen',
    owners: 'Owners',
    landlord: 'Landlord',
    tenant: 'Tenant',
    start: 'Start',
    end: 'End',
    extensionClause: 'Extension clause',
    period: 'Term',
    index: 'Index',
    percentage: 'Percentage',
    value: 'Value',
    focusStatus: 'Dark theme, high contrast, and keyboard navigation are active in the MVP.',
    themeNote: 'Dark theme with high contrast and visible accessibility controls.',
    roleLabels: { locador: 'landlord', locatario: 'tenant', proprietario: 'owner' },
    propertyTypeLabels: {
      'casa terrea': 'single-story house',
      'casa geminada': 'semi-detached house',
      apartamento: 'apartment',
      'casa duplex': 'duplex house',
      'apartamento duplex': 'duplex apartment',
      'apartamento triplex': 'triplex apartment',
      cobertura: 'penthouse',
      'casa tipo sobrado': 'townhouse',
    },
    kitchenLabels: { americana: 'open kitchen', comum: 'standard kitchen' },
    laundryLabels: { ampla: 'large', 'anexa a cozinha': 'attached to kitchen' },
    roomTypeLabels: { suite: 'suite', solteiro: 'single', casal: 'double', 'casal suite': 'double suite' },
    gourmetLabels: { simples: 'simple', 'na varanda': 'on the balcony', 'ampla com churrasqueira': 'large with grill' },
    propertyBriefs: {
      IM001: 'Furnished premium apartment',
      IM002: 'Duplex house with a large gourmet area',
    },
    propertyDetails: {
      IM001: 'Unit with a gourmet balcony, open kitchen, and contemporary finish.',
      IM002: 'Property with backyard, grill, and an ideal layout for a family.',
    },
    rentalClauses: {
      AL001: 'Automatic renewal upon both parties approval and contract review.',
    },
  },
  'es-PY': {
    appTag: 'MVP demostrativo',
    appTitle: 'Imob Admin',
    fakeDataNotice: 'Datos simulados solo para demostracion. No se implemento persistencia real.',
    heroTag: 'Planificado para React + TypeScript',
    heroTitle: 'Panel administrativo inmobiliario',
    stackReady: 'Preparado para SQLite, PostgreSQL u Oracle',
    accessibilityBar: 'Barra de accesibilidad',
    fontSize: 'Tamano de fuente',
    decreaseFont: 'Disminuir fuente',
    resetFont: 'Fuente por defecto',
    increaseFont: 'Aumentar fuente',
    language: 'Idioma',
    skipToContent: 'Ir al contenido principal',
    dashboard: 'Panel',
    people: 'Personas',
    properties: 'Inmuebles',
    rentals: 'Alquileres',
    peopleCount: 'Personas',
    propertiesCount: 'Inmuebles',
    rentalsCount: 'Alquileres',
    averageIncome: 'Ingreso promedio',
    mvpScope: 'Alcance del MVP',
    dashboardItems: [
      'Simular registro de personas con roles de locador, locatario y propietario',
      'Exhibir inmuebles y sus relaciones principales',
      'Demostrar contratos de alquiler y periodos anuales',
      'Preparar la base para una implementacion real futura sin duplicar modelado',
    ],
    unifiedRegistry: 'Registro unificado para locador, locatario y propietario.',
    demoPropertyRegistry: 'Registro demostrativo con relacion desacoplada de propietario.',
    rentalDemo: 'Demostracion de contrato con periodos anuales y reajuste.',
    newRegistry: 'Nuevo registro',
    newProperty: 'Nuevo inmueble',
    newRental: 'Nuevo alquiler',
    code: 'Codigo',
    name: 'Nombre',
    roles: 'Roles',
    document: 'Documento',
    profession: 'Profesion',
    income: 'Ingreso',
    rent: 'Alquiler',
    rooms: 'Habitaciones',
    area: 'Area',
    kitchen: 'Cocina',
    owners: 'Propietarios',
    landlord: 'Locador',
    tenant: 'Locatario',
    start: 'Inicio',
    end: 'Fin',
    extensionClause: 'Clausula de extension',
    period: 'Periodo',
    index: 'Indice',
    percentage: 'Porcentaje',
    value: 'Valor',
    focusStatus: 'Tema oscuro, alto contraste y navegacion por teclado activos en el MVP.',
    themeNote: 'Tema oscuro con alto contraste y controles visibles de accesibilidad.',
    roleLabels: { locador: 'locador', locatario: 'locatario', proprietario: 'propietario' },
    propertyTypeLabels: {
      'casa terrea': 'casa de una planta',
      'casa geminada': 'casa gemela',
      apartamento: 'apartamento',
      'casa duplex': 'casa duplex',
      'apartamento duplex': 'apartamento duplex',
      'apartamento triplex': 'apartamento triplex',
      cobertura: 'penthouse',
      'casa tipo sobrado': 'casa tipo sobrado',
    },
    kitchenLabels: { americana: 'americana', comum: 'comun' },
    laundryLabels: { ampla: 'amplia', 'anexa a cozinha': 'anexa a la cocina' },
    roomTypeLabels: { suite: 'suite', solteiro: 'individual', casal: 'doble', 'casal suite': 'doble suite' },
    gourmetLabels: { simples: 'simple', 'na varanda': 'en el balcon', 'ampla com churrasqueira': 'amplia con parrilla' },
    propertyBriefs: {
      IM001: 'Apartamento premium amoblado',
      IM002: 'Casa duplex con amplia area gourmet',
    },
    propertyDetails: {
      IM001: 'Unidad con balcon gourmet, cocina americana y terminacion contemporanea.',
      IM002: 'Propiedad con patio, parrilla y configuracion ideal para familia.',
    },
    rentalClauses: {
      AL001: 'Renovacion automatica mediante acuerdo de las partes y revision contractual.',
    },
  },
  gn: {
    appTag: 'MVP techaukaraha',
    appTitle: 'Imob Admin',
    fakeDataNotice: 'Marandu guau mante jehechaukaraha rupi. Ndaipori gueteri persistencia tee.',
    heroTag: 'Ojejapo hag̃uarã React + TypeScript reheve',
    heroTitle: 'Panel administrativo inmobiliario',
    stackReady: 'Oime hag̃uarã SQLite, PostgreSQL térã Oracle ndive',
    accessibilityBar: 'Jeike porã renda',
    fontSize: 'Tai tuichakue',
    decreaseFont: 'Michive tai',
    resetFont: 'Tai ypykue',
    increaseFont: 'Tuichave tai',
    language: 'Ñe e',
    skipToContent: 'Ehasa pe contenido principal-pe',
    dashboard: 'Panel',
    people: 'Tapicha',
    properties: 'Ogakuera',
    rentals: 'Alquilerkuera',
    peopleCount: 'Tapicha',
    propertiesCount: 'Ogakuera',
    rentalsCount: 'Alquilerkuera',
    averageIncome: 'Renda mbytegua',
    mvpScope: 'MVP rembiapo',
    dashboardItems: [
      'Ohechauka tapicha registro petei locador, locatario ha proprietario rolgui',
      'Ohechauka ogakuera ha ijoaju tenondegua',
      'Ohechauka contrato alquiler ha periodo ary rehegua',
      'Ombosako i base implementacion tee oútava upe rire ani haguã oñemoha e joa',
    ],
    unifiedRegistry: 'Registro petei locador, locatario ha proprietario-pe guarã.',
    demoPropertyRegistry: 'Jehechaukaraha registro propietario joaju ijehegui ojeipe a va ekue reheve.',
    rentalDemo: 'Jehechaukaraha contrato rehegua periodo ary ha reajuste ndive.',
    newRegistry: 'Registro pyahu',
    newProperty: 'Oga pyahu',
    newRental: 'Alquiler pyahu',
    code: 'Codigo',
    name: 'Tera',
    roles: 'Rolkuera',
    document: 'Documento',
    profession: 'Mba apo',
    income: 'Renda',
    rent: 'Alquiler',
    rooms: 'Kotykuera',
    area: 'Area',
    kitchen: 'Cocina',
    owners: 'Jara kuera',
    landlord: 'Locador',
    tenant: 'Locatario',
    start: 'Ñepyrũ',
    end: 'Paha',
    extensionClause: 'Clausula de extension',
    period: 'Periodo',
    index: 'Indice',
    percentage: 'Porcentaje',
    value: 'Valor',
    focusStatus: 'Tema pytũ, contraste yvate ha teclado rupive jeguata oĩma MVP-pe.',
    themeNote: 'Tema pytũ contraste yvatéva ha jeike porã control reheve.',
    roleLabels: { locador: 'locador', locatario: 'locatario', proprietario: 'jara' },
    propertyTypeLabels: {
      'casa terrea': 'oga yvýpe',
      'casa geminada': 'oga joaju',
      apartamento: 'apartamento',
      'casa duplex': 'oga duplex',
      'apartamento duplex': 'apartamento duplex',
      'apartamento triplex': 'apartamento triplex',
      cobertura: 'cobertura',
      'casa tipo sobrado': 'oga sobrado',
    },
    kitchenLabels: { americana: 'americana', comum: 'jepivegua' },
    laundryLabels: { ampla: 'tuicha', 'anexa a cozinha': 'cocina ykére' },
    roomTypeLabels: { suite: 'suite', solteiro: 'petei tapicha', casal: 'mokoi tapicha', 'casal suite': 'mokoi tapicha suite' },
    gourmetLabels: { simples: 'simple', 'na varanda': 'varandápe', 'ampla com churrasqueira': 'tuicha parrilla ndive' },
    propertyBriefs: {
      IM001: 'Apartamento porã meublado',
      IM002: 'Oga duplex area gourmet tuicháva reheve',
    },
    propertyDetails: {
      IM001: 'Oga oguereko varanda gourmet, cocina americana ha acabado moderno.',
      IM002: 'Oga oguereko patio, parrilla ha porã ogayguápe g̃uarã.',
    },
    rentalClauses: {
      AL001: 'Oñembopyahu hag̃uarã mokõive omoneĩ rire ha ojehecha jey contrato.',
    },
  },
  de: {
    appTag: 'Demo-MVP',
    appTitle: 'Imob Admin',
    fakeDataNotice: 'Nur Beispieldaten zur Demonstration. Es wurde noch keine echte Persistenz implementiert.',
    heroTag: 'Geplant mit React + TypeScript',
    heroTitle: 'Administratives Immobilien-Dashboard',
    stackReady: 'Vorbereitet fuer SQLite, PostgreSQL oder Oracle',
    accessibilityBar: 'Leiste fuer Barrierefreiheit',
    fontSize: 'Schriftgroesse',
    decreaseFont: 'Schrift verkleinern',
    resetFont: 'Standardschrift',
    increaseFont: 'Schrift vergroessern',
    language: 'Sprache',
    skipToContent: 'Zum Hauptinhalt springen',
    dashboard: 'Dashboard',
    people: 'Personen',
    properties: 'Immobilien',
    rentals: 'Mietvertraege',
    peopleCount: 'Personen',
    propertiesCount: 'Immobilien',
    rentalsCount: 'Mietvertraege',
    averageIncome: 'Durchschnittseinkommen',
    mvpScope: 'MVP-Umfang',
    dashboardItems: [
      'Ein gemeinsames Personenregister fuer Vermieter, Mieter und Eigentuemer simulieren',
      'Immobilien und ihre wichtigsten Beziehungen anzeigen',
      'Mietvertraege und Jahresperioden demonstrieren',
      'Die Basis fuer eine spaetere echte Implementierung ohne doppelte Modellierung vorbereiten',
    ],
    unifiedRegistry: 'Gemeinsames Register fuer Vermieter, Mieter und Eigentuemer.',
    demoPropertyRegistry: 'Demoregister mit entkoppelter Eigentuemerbeziehung.',
    rentalDemo: 'Vertragsdemo mit Jahresperioden und Anpassungsindex.',
    newRegistry: 'Neuer Eintrag',
    newProperty: 'Neue Immobilie',
    newRental: 'Neuer Mietvertrag',
    code: 'Code',
    name: 'Name',
    roles: 'Rollen',
    document: 'Dokument',
    profession: 'Beruf',
    income: 'Einkommen',
    rent: 'Miete',
    rooms: 'Zimmer',
    area: 'Flaeche',
    kitchen: 'Kueche',
    owners: 'Eigentuemer',
    landlord: 'Vermieter',
    tenant: 'Mieter',
    start: 'Beginn',
    end: 'Ende',
    extensionClause: 'Verlaengerungsklausel',
    period: 'Periode',
    index: 'Index',
    percentage: 'Prozentsatz',
    value: 'Wert',
    focusStatus: 'Dunkles Thema, hoher Kontrast und Tastaturnavigation sind im MVP aktiv.',
    themeNote: 'Dunkles Thema mit hohem Kontrast und sichtbaren Barrierefreiheits-Steuerelementen.',
    roleLabels: { locador: 'vermieter', locatario: 'mieter', proprietario: 'eigentuemer' },
    propertyTypeLabels: {
      'casa terrea': 'ebenerdiges Haus',
      'casa geminada': 'Doppelhaus',
      apartamento: 'Wohnung',
      'casa duplex': 'Duplexhaus',
      'apartamento duplex': 'Duplexwohnung',
      'apartamento triplex': 'Triplexwohnung',
      cobertura: 'Penthouse',
      'casa tipo sobrado': 'Stadthaus',
    },
    kitchenLabels: { americana: 'offene Kueche', comum: 'normale Kueche' },
    laundryLabels: { ampla: 'gross', 'anexa a cozinha': 'an die Kueche angebunden' },
    roomTypeLabels: { suite: 'Suite', solteiro: 'Einzelzimmer', casal: 'Doppelzimmer', 'casal suite': 'Doppelsuite' },
    gourmetLabels: { simples: 'einfach', 'na varanda': 'auf dem Balkon', 'ampla com churrasqueira': 'gross mit Grill' },
    propertyBriefs: {
      IM001: 'Moeblierte Premium-Wohnung',
      IM002: 'Duplexhaus mit grossem Gourmetbereich',
    },
    propertyDetails: {
      IM001: 'Einheit mit Gourmet-Balkon, offener Kueche und zeitgemaessem Finish.',
      IM002: 'Immobilie mit Hof, Grill und idealem Grundriss fuer eine Familie.',
    },
    rentalClauses: {
      AL001: 'Automatische Verlaengerung nach Zustimmung beider Parteien und Vertragspruefung.',
    },
  },
};
