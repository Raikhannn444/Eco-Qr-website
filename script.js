/* ----------------------
  Общие переменные
------------------------*/
let map, directionsService, directionsRenderer;
let html5QrCodeInstance = null;
let currentPoints = []; // Для хранения текущего набора точек на карте
let currentMarkers = [];
let _demoInterval = null;

/* ----------------------
  MULTILANGUAGE DICTIONARY
------------------------*/
const translations = {
  ru: {
    allPoints: "Все пункты",
    route: "Маршрут",
    address: "Адрес",
    accepts: "Принимает",
    schedule: "График",
    yourLocation: "Ваше местоположение",
    geolocationUnsupported: "Ваш браузер не поддерживает геолокацию.",
    routeError: "Не удалось построить маршрут. Ошибка: ",
    scanning: "Сканирование...",
    done: "Готово!",
    thanks: "Спасибо!",
    savedCO2: "Вы помогли сэкономить",
    appPrompt: "Для получения своего бонуса перейдите в приложение <b>“Extra Zone”</b>.",
    openScanner: "Сдать бутылку (QR)",
    closeScanner: "Закрыть сканер",
    scanningProcess: "Идет сканирование...",
    permissionDenied: "🔒 Доступ заблокирован! Пожалуйста, разрешите браузеру использовать местоположение: проверьте настройки.",
    timeoutMsg: "⏳ Время ожидания истекло. Убедитесь, что GPS включен и попробуйте снова.",
    positionUnavailable: "🛰️ Позиция недоступна. Проблема с сигналом GPS.",
    noPoints: "На карте нет доступных пунктов для поиска.",
    locatingError: "Не удалось определить ваше местоположение."
  },
  en: {
    allPoints: "All points",
    route: "Route",
    address: "Address",
    accepts: "Accepts",
    schedule: "Schedule",
    yourLocation: "Your location",
    geolocationUnsupported: "Your browser does not support geolocation.",
    routeError: "Could not build route. Error: ",
    scanning: "Scanning...",
    done: "Done!",
    thanks: "Thank you!",
    savedCO2: "You helped save",
    appPrompt: "To receive your bonus, open the <b>“Extra Zone”</b> app.",
    openScanner: "Deposit bottle (QR)",
    closeScanner: "Close scanner",
    scanningProcess: "Scanning in progress...",
    permissionDenied: "🔒 Access denied! Please allow your browser to use location services: check your device settings.",
    timeoutMsg: "⏳ Timeout. Make sure GPS is on and try again.",
    positionUnavailable: "🛰️ Position unavailable. GPS signal issue.",
    noPoints: "There are no available points on the map.",
    locatingError: "Unable to determine your location."
  },
  kz: {
    allPoints: "Барлық пункттер",
    route: "Маршрут",
    address: "Мекенжай",
    accepts: "Қабылдайды",
    schedule: "Кесте",
    yourLocation: "Сіздің орналасуыңыз",
    geolocationUnsupported: "Браузер геолокацияны қолдамайды.",
    routeError: "Маршрут салынбады. Қате: ",
    scanning: "Сканерлеу...",
    done: "Дайын!",
    thanks: "Рақмет!",
    savedCO2: "Сіз үнемдедіңіз",
    appPrompt: "Бонусты алу үшін <b>“Extra Zone”</b> қолданбасына өтіңіз.",
    openScanner: "Бөтелке тапсыру (QR)",
    closeScanner: "Сканерді жабу",
    scanningProcess: "Сканерлеу жүріп жатыр...",
    permissionDenied: "🔒 Қол жетімділік жоқ! Құрылғы параметрлерінен орналасуды қосыңыз.",
    timeoutMsg: "⏳ Уақыт аяқталды. GPS қосылып тұрғанын тексеріңіз.",
    positionUnavailable: "🛰️ Орын анықталмады. GPS сигналына байланысты проблема.",
    noPoints: "Картта пункттер жоқ.",
    locatingError: "Орналасуыңызды анықтау мүмкін емес."
  },
  tr: {
    allPoints: "Tüm noktalar",
    route: "Rota",
    address: "Adres",
    accepts: "Kabul eder",
    schedule: "Çalışma saatleri",
    yourLocation: "Konumunuz",
    geolocationUnsupported: "Tarayıcınız konum servislerini desteklemiyor.",
    routeError: "Rota oluşturulamadı. Hata: ",
    scanning: "Tarama...",
    done: "Tamamlandı!",
    thanks: "Teşekkürler!",
    savedCO2: "Tasarruf ettiniz",
    appPrompt: "Bonusunuzu almak için <b>“Extra Zone”</b> uygulamasını açın.",
    openScanner: "Şişe teslimi (QR)",
    closeScanner: "Tarayıcıyı kapat",
    scanningProcess: "Tarama devam ediyor...",
    permissionDenied: "🔒 Erişim reddedildi! Tarayıcınızın konumu kullanmasına izin verin.",
    timeoutMsg: "⏳ Zaman aşımı. GPS'i açıp tekrar deneyin.",
    positionUnavailable: "🛰️ Konum alınamıyor. GPS sinyal sorunu.",
    noPoints: "Haritada uygun nokta yok.",
    locatingError: "Konumunuz belirlenemiyor."
  }
};

/* ----------------------
  Типы: ключи — русские строки, значения — переводы
------------------------*/
const TYPE_TRANSLATIONS = {
  "Бутылки (ПЭТ)": { ru: "Бутылки (ПЭТ)", en: "Bottles (PET)", kz: "Бөтелкелер (PET)", tr: "Şişeler (PET)" },
  "Алюминий": { ru: "Алюминий", en: "Aluminium", kz: "Алюминий", tr: "Alüminyum" },
  "Стекло": { ru: "Стекло", en: "Glass", kz: "Шыны", tr: "Cam" },
  "Бумага и Картон": { ru: "Бумага и Картон", en: "Paper & Cardboard", kz: "Қағаз және Картон", tr: "Kağıt & Karton" },
  "Смешанные отходы": { ru: "Смешанные отходы", en: "Mixed waste", kz: "Аралас қалдықтар", tr: "Karışık atıklar" }
};

/* ----------------------
  АКТУАЛЬНЫЕ ПУНКТЫ ПРИЕМА (Алматы и Астана)
  (все пункты имеют поля title_*, address_*, schedule_*)
------------------------*/
const allRecyclingPoints = [
    // --- Алматы ---
    {
      position:{lat:43.228507, lng:76.933076},
      title_ru:"Freedom (Маркова)",
      title_en:"Freedom (Markova)",
      title_kz:"Freedom (Маркова)",
      title_tr:"Freedom (Markova)",
      schedule_ru:"Пн-Пт: 09:00 - 18:00",
      schedule_en:"Mon-Fri: 09:00 - 18:00",
      schedule_kz:"Дс-Жм: 09:00 - 18:00",
      schedule_tr:"Pts-Cum: 09:00 - 18:00",
      type: ["Бутылки (ПЭТ)"],
      address_ru: "улица Маркова, 44",
      address_en: "Markova St., 44",
      address_kz: "Маркова к-сі, 44",
      address_tr: "Markova Sk., 44"
    },
    {
      position:{lat:43.219105, lng:76.929349},
      title_ru:"Sparklo (Esentai Tower)",
      title_en:"Sparklo (Esentai Tower)",
      title_kz:"Sparklo (Esentai Tower)",
      title_tr:"Sparklo (Esentai Tower)",
      schedule_ru:"Пн-Пт: 08:00 - 19:00",
      schedule_en:"Mon-Fri: 08:00 - 19:00",
      schedule_kz:"Дс-Жм: 08:00 - 19:00",
      schedule_tr:"Pts-Cum: 08:00 - 19:00",
      type: ["Бутылки (ПЭТ)"],
      address_ru: "Проспект Аль-Фараби, 77/7, БЦ Esentai Tower, B3 этаж",
      address_en: "Al-Farabi Ave, 77/7, Esentai Tower, B3 floor",
      address_kz: "Әл-Фараби даңғылы, 77/7, Esentai Tower, B3 қабат",
      address_tr: "Al-Farabi Blv, 77/7, Esentai Tower, B3 kat"
    },
    {
      position:{lat:43.204032, lng:76.893641},
      title_ru:"Алатауэковтор (Mega Center)",
      title_en:"AlatauEkovtor (Mega Center)",
      title_kz:"Алатауэковтор (Mega Center)",
      title_tr:"AlatauEkovtor (Mega Center)",
      schedule_ru:"Ср-Вс: 10:00 - 19:00",
      schedule_en:"Wed-Sun: 10:00 - 19:00",
      schedule_kz:"Ср-Жк: 10:00 - 19:00",
      schedule_tr:"Çar-Paz: 10:00 - 19:00",
      type: ["Бутылки (ПЭТ)", "Алюминий", "Стекло", "Бумага и Картон"],
      address_ru: "Улица Розыбакиева, 247/3 (ТРЦ Mega Center)",
      address_en: "Rozybakiev St., 247/3 (Mega Center)",
      address_kz: "Розыбакиев к-сі, 247/3 (Mega Center)",
      address_tr: "Rozybakiev Sk., 247/3 (Mega Center)"
    },
    {
      position:{lat:43.258295, lng:76.910458},
      title_ru:"Алатауэковтор (Байзакова)",
      title_en:"AlatauEkovtor (Bayzakova)",
      title_kz:"Алатауэковтор (Байзаков)",
      title_tr:"AlatauEkovtor (Bayzakova)",
      schedule_ru:"Ср-Вс: 10:00 - 19:00",
      schedule_en:"Wed-Sun: 10:00 - 19:00",
      schedule_kz:"Ср-Жк: 10:00 - 19:00",
      schedule_tr:"Çar-Paz: 10:00 - 19:00",
      type: ["Бутылки (ПЭТ)", "Алюминий", "Стекло", "Бумага и Картон"],
      address_ru: "Байзакова улица, 73/1",
      address_en: "Bayzakova St., 73/1",
      address_kz: "Байзаков к-сі, 73/1",
      address_tr: "Bayzakova Sk., 73/1"
    },
    {
      position:{lat:43.263823, lng:76.817545},
      title_ru:"Алатауэковтор (Almaty Arena)",
      title_en:"AlatauEkovtor (Almaty Arena)",
      title_kz:"Алатауэковтор (Almaty Arena)",
      title_tr:"AlatauEkovtor (Almaty Arena)",
      schedule_ru:"Ср-Вс: 10:00 - 19:00",
      schedule_en:"Wed-Sun: 10:00 - 19:00",
      schedule_kz:"Ср-Жк: 10:00 - 19:00",
      schedule_tr:"Çar-Paz: 10:00 - 19:00",
      type: ["Бутылки (ПЭТ)", "Алюминий", "Стекло", "Бумага и Картон"],
      address_ru: "Нуркент микрорайон, 7/1 (Almaty Arena)",
      address_en: "Nurkent microdistrict, 7/1 (Almaty Arena)",
      address_kz: "Нұркент микроауданы, 7/1 (Almaty Arena)",
      address_tr: "Nurkent mah., 7/1 (Almaty Arena)"
    },
    {
      position:{lat:43.225649, lng:76.873124},
      title_ru:"KWR (8-й микрорайон)",
      title_en:"KWR (8th microdistrict)",
      title_kz:"KWR (8-ші микроаудан)",
      title_tr:"KWR (8. mahalle)",
      schedule_ru:"Пн–Пт 10:00–17:00 (Перерыв 13:30–14:30), Сб 10:00–15:00 (Перерыв 13:00–13:30)",
      schedule_en:"Mon–Fri 10:00–17:00 (Break 13:30–14:30), Sat 10:00–15:00 (Break 13:00–13:30)",
      schedule_kz:"Дс–Жм 10:00–17:00 (Түскі үзіліс 13:30–14:30), Сб 10:00–15:00 (13:00–13:30)",
      schedule_tr:"Pts–Cum 10:00–17:00 (Ara 13:30–14:30), Cmt 10:00–15:00 (13:00–13:30)",
      type: ["Бутылки (ПЭТ)", "Алюминий", "Стекло", "Бумага и Картон"],
      address_ru: "8-й микрорайон, 57 киоск",
      address_en: "8th microdistrict, kiosk 57",
      address_kz: "8-ші микроаудан, 57 киоск",
      address_tr: "8. mahalle, 57 kiosk"
    },
    {
      position:{lat:43.405905, lng:76.889455},
      title_ru:"Компания «Технология А»",
      title_en:"Company 'Tekhnologiya A'",
      title_kz:"'Технология А' компаниясы",
      title_tr:"'Tekhnologiya A' şirketi",
      schedule_ru:"Пн-Сб: 09:00 - 18:00",
      schedule_en:"Mon-Sat: 09:00 - 18:00",
      schedule_kz:"Дс–Сб: 09:00 - 18:00",
      schedule_tr:"Pts–Cmt: 09:00 - 18:00",
      type: ["Бутылки (ПЭТ)", "Бумага и Картон"],
      address_ru: "Улица Шубаева, 149/1",
      address_en: "Shubaev St., 149/1",
      address_kz: "Шубаев к-сі, 149/1",
      address_tr: "Shubaev Sk., 149/1"
    },
    {
      position:{lat:43.354659, lng:76.968184},
      title_ru:"LS Almaty",
      title_en:"LS Almaty",
      title_kz:"LS Almaty",
      title_tr:"LS Almaty",
      schedule_ru:"Пн–Пт 09:00–18:00, Сб 09:00–16:00",
      schedule_en:"Mon–Fri 09:00–18:00, Sat 09:00–16:00",
      schedule_kz:"Дс–Жм 09:00–18:00, Сб 09:00–16:00",
      schedule_tr:"Pts–Cum 09:00–18:00, Cmt 09:00–16:00",
      type: ["Бутылки (ПЭТ)", "Алюминий", "Стекло", "Бумага и Картон"],
      address_ru: "Улица Бекмаханова, 94/3",
      address_en: "Bekmakhanov St., 94/3",
      address_kz: "Бекмаханов к-сі, 94/3",
      address_tr: "Bekmakhanov Sk., 94/3"
    },
    {
      position:{lat:43.238372, lng:76.913979},
      title_ru:"Freedom (БЦ Bayzak)",
      title_en:"Freedom (Bayzak Business Center)",
      title_kz:"Freedom (Bayzak бизнес орталығы)",
      title_tr:"Freedom (Bayzak İş Merkezi)",
      schedule_ru:"Ежедневно с 08:00 до 21:00",
      schedule_en:"Daily 08:00 - 21:00",
      schedule_kz:"Күнделікті 08:00 - 21:00",
      schedule_tr:"Her gün 08:00 - 21:00",
      type: ["Бутылки (ПЭТ)"],
      address_ru: "Абая проспект, 52в, БЦ Bayzak, 1 этаж; около лифта",
      address_en: "Abay Ave, 52v, Bayzak BC, 1st floor; near elevator",
      address_kz: "Абай даңғылы, 52в, Bayzak Бизнес орталығы, 1-қабат; лифтің қасы",
      address_tr: "Abay Blv, 52v, Bayzak İM, 1. kat; asansör yakınında"
    },
    {
      position:{lat:43.237097, lng:76.931424},
      title_ru:"Sparklo (КазНИТУ)",
      title_en:"Sparklo (KazNTU)",
      title_kz:"Sparklo (KazNTU)",
      title_tr:"Sparklo (KazNTU)",
      schedule_ru:"Ежедневно с 08:30 до 17:30",
      schedule_en:"Daily 08:30 - 17:30",
      schedule_kz:"Күнделікті 08:30 - 17:30",
      schedule_tr:"Her gün 08:30 - 17:30",
      type: ["Бутылки (ПЭТ)"],
      address_ru: "Улица Каныша Сатпаева, 22 (КазНИТУ)",
      address_en: "Kanysh Satpayev St., 22 (KazNTU)",
      address_kz: "Қаныш Сәтбаев к-сі, 22 (Қ. И. Сәтбаев атындағы Қазақ ұлттық техникалық зерттеу университеті)",
      address_tr: "Kanysh Satpayev Sk., 22 (KazNTU)"
    },
    {
      position:{lat:43.253397, lng:76.83862},
      title_ru:"КазМет",
      title_en:"KazMet",
      title_kz:"KazMet",
      title_tr:"KazMet",
      schedule_ru:"Ежедневно с 10:00 до 20:00",
      schedule_en:"Daily 10:00 - 20:00",
      schedule_kz:"Күнделікті 10:00 - 20:00",
      schedule_tr:"Her gün 10:00 - 20:00",
      type: ["Алюминий"],
      address_ru: "Проспект Турара Рыскулова, 143/5",
      address_en: "Turar Ryskulov Ave, 143/5",
      address_kz: "Тұрар Рысқұлов даңғылы, 143/5",
      address_tr: "Turar Ryskulov Blv, 143/5"
    },
    {
      position:{lat:43.29885, lng:76.931883},
      title_ru:"Aurum",
      title_en:"Aurum",
      title_kz:"Aurum",
      title_tr:"Aurum",
      schedule_ru:"Круглосуточно",
      schedule_en:"24/7",
      schedule_kz:"24/7",
      schedule_tr:"7/24",
      type: ["Алюминий"],
      address_ru: "Улица Иссык-Кульская, 53",
      address_en: "Issyk-Kul St., 53",
      address_kz: "Issyk-Kul к-сі, 53",
      address_tr: "Issyk-Kul Sk., 53"
    },
    {
      position:{lat:43.341587, lng:76.944845},
      title_ru:"Glass Trade",
      title_tr:"Glass Trade",
      title_en:"Glass Trade",
      title_kz:"Glass Trade",
      schedule_ru:"Пн–Сб 11:00–18:00",
      schedule_en:"Mon–Sat 11:00–18:00",
      schedule_kz:"Дс–Сб 11:00–18:00",
      schedule_tr:"Pts–Cmt 11:00–18:00",
      type: ["Стекло"],
      address_ru: "Улица Осипенко, 15/2",
      address_en: "Osipenko St., 15/2",
      address_kz: "Осипенко к-сі, 15/2",
      address_tr: "Osipenko Sk., 15/2"
    },
    {
      position:{lat:43.219388, lng:76.772647},
      title_ru:"Kz recycling (Алтын Орда)",
      title_en:"Kz recycling (Altyn Orda)",
      title_kz:"Kz recycling (Алтын Орда)",
      title_tr:"Kz recycling (Altyn Orda)",
      schedule_ru:"Пн–Пт 08:00–17:00 (Перерыв 12:00–13:00)",
      schedule_en:"Mon–Fri 08:00–17:00 (Break 12:00–13:00)",
      schedule_kz:"Дс–Жм 08:00–17:00 (12:00–13:00)",
      schedule_tr:"Pts–Cum 08:00–17:00 (12:00–13:00)",
      type: ["Бумага и Картон"],
      address_ru: "Улица Алтын Орда, 2",
      address_en: "Altyn Orda St., 2",
      address_kz: "Алтын Орда к-сі, 2",
      address_tr: "Altyn Orda Sk., 2"
    },
    {
      position:{lat:43.269403, lng:76.940246},
      title_ru:"Пункт приема макулатуры",
      title_en:"Paper collection point",
      title_kz:"Макулатура қабылдау орны",
      title_tr:"Atık kağıt teslim noktası",
      schedule_ru:"Круглосуточно",
      schedule_en:"24/7",
      schedule_kz:"24/7",
      schedule_tr:"7/24",
      type: ["Бумага и Картон"],
      address_ru: "Проспект Абылай хана, 20",
      address_en: "Abylay Khan Ave, 20",
      address_kz: "Абылай хан даңғылы, 20",
      address_tr: "Abylay Khan Blv, 20"
    },
    {
      position:{lat:43.283974, lng:76.920061},
      title_ru:"VOLTMAN",
      title_en:"VOLTMAN",
      title_kz:"VOLTMAN",
      title_tr:"VOLTMAN",
      schedule_ru:"Пн–Пт 09:00–18:00, Сб 09:00–15:00",
      schedule_en:"Mon–Fri 09:00–18:00, Sat 09:00–15:00",
      schedule_kz:"Дс–Жм 09:00–18:00, Сб 09:00–15:00",
      schedule_tr:"Pts–Cum 09:00–18:00, Cmt 09:00–15:00",
      type: ["Смешанные отходы"],
      address_ru: "Проспект Турара Рыскулова, 72а",
      address_en: "Turar Ryskulov Ave, 72a",
      address_kz: "Тұрар Рысқұлов даңғылы, 72a",
      address_tr: "Turar Ryskulov Blv, 72a"
    },
    {
      position:{lat:43.243665, lng:76.889922},
      title_ru:"Бокс для приёма просроченных лекарств",
      title_en:"Box for expired medicines",
      title_kz:"Мерзімі өткен дәрілерді қабылдау қорабы",
      title_tr:"Süresi geçmiş ilaç toplama kutusu",
      schedule_ru:"Пн–Пт 08:00–20:00, Сб 09:00–14:00",
      schedule_en:"Mon–Fri 08:00–20:00, Sat 09:00–14:00",
      schedule_kz:"Дс–Жм 08:00–20:00, Сб 09:00–14:00",
      schedule_tr:"Pts–Cum 08:00–20:00, Cmt 09:00–14:00",
      type: ["Смешанные отходы"],
      address_ru: "Улица Розыбакиева, 74",
      address_en: "Rozybakiev St., 74",
      address_kz: "Розыбакиев к-сі, 74",
      address_tr: "Rozybakiev Sk., 74"
    },
    // --- Астана ---
    {
      position:{lat:51.12802, lng:71.425381},
      title_ru:"Sparklo (Достык, Астана)",
      title_en:"Sparklo (Dostyk, Astana)",
      title_kz:"Sparklo (Достық, Астана)",
      title_tr:"Sparklo (Dostyk, Astana)",
      schedule_ru:"Ежедневно с 09:00 до 24:00",
      schedule_en:"Daily 09:00 - 24:00",
      schedule_kz:"Күнделікті 09:00 - 24:00",
      schedule_tr:"Her gün 09:00 - 24:00",
      type: ["Бутылки (ПЭТ)"],
      address_ru: "Улица Достык, 9",
      address_en: "Dostyk St., 9",
      address_kz: "Достық к-сі, 9",
      address_tr: "Dostyk Sk., 9"
    }
];

/* ----------------------
  Конфигурация и глобальные переменные языка
------------------------*/
const RECYCLING_TYPES_KEYS = Object.keys(TYPE_TRANSLATIONS); // русские ключи
let currentLang = 'en'; // default; затем перезапишем строго по имени файла

/* ----------------------
  Утилиты для переводов
------------------------*/
function t(key) {
  return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key;
}

function translateType(typeKey) {
  const map = TYPE_TRANSLATIONS[typeKey];
  if (!map) return typeKey;
  return map[currentLang] || map['ru'] || typeKey;
}

function getTitleForPoint(p) {
  return p['title_' + currentLang] || p.title_ru || '';
}
function getAddressForPoint(p) {
  return p['address_' + currentLang] || p.address_ru || '';
}
function getScheduleForPoint(p) {
  return p['schedule_' + currentLang] || p.schedule_ru || '';
}

/* ----------------------
  Определение языка строго по имени HTML-файла
  (index.html -> en, index_ru.html -> ru, index_kz.html -> kz, index_tr.html -> tr)
------------------------*/
function detectLangFromPath() {
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1).toLowerCase();
  const match = filename.match(/_((ru|kz|tr))\.html$/);
  if (match && match[1]) {
    currentLang = match[1];
  } else {
    // если есть суффикс вида _en.html (редко), или файл без суффикса — считаем английским
    currentLang = 'en';
  }
}

/* ----------------------
  MAP: инициализация, отображение, геолокация, маршрут
------------------------*/
function initMap(){
  detectLangFromPath();

  const center = allRecyclingPoints[0].position;
  map = new google.maps.Map(document.getElementById("map"), { center, zoom: 11 });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers:false});
  directionsRenderer.setMap(map);

  if(document.body.classList.contains('index-page')) {
      initIndexMap();
  } else if (document.body.classList.contains('map-page')) {
      setupMapPage();
  }

  updateStaticUITexts();
}

function initIndexMap() {
    const bottlePoints = allRecyclingPoints.filter(p => p.type.includes("Бутылки (ПЭТ)"));
    currentPoints = bottlePoints;
    if(directionsRenderer) directionsRenderer.setDirections({routes:[]});
    populatePoints(bottlePoints);
    findNearest();
}

function setupMapPage() {
    map.setCenter(allRecyclingPoints[0].position);
    map.setZoom(10);
    renderFilterButtons();
    filterMapByType('All');
}

function renderFilterButtons() {
    const filterContainer = document.getElementById('filter-buttons');
    if (!filterContainer) return;
    filterContainer.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = t('allPoints');
    allBtn.onclick = () => filterMapByType('All');
    filterContainer.appendChild(allBtn);

    RECYCLING_TYPES_KEYS.forEach(typeKey => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = translateType(typeKey);
        btn.setAttribute('data-type', typeKey);
        btn.onclick = () => filterMapByType(typeKey);
        filterContainer.appendChild(btn);
    });
}

function clearMarkers() {
    currentMarkers.forEach(marker => {
        if (marker.infowindow) marker.infowindow.close();
        marker.setMap(null);
    });
    currentMarkers = [];
    if(directionsRenderer) directionsRenderer.setDirections({routes:[]});
}

function filterMapByType(selectedType) {
    let filtered;
    if (selectedType === 'All') {
        filtered = allRecyclingPoints;
    } else {
        filtered = allRecyclingPoints.filter(p => p.type.includes(selectedType));
    }

    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === selectedType || (selectedType === 'All' && btn.textContent === t('allPoints'))) {
            btn.classList.add('active');
        }
    });

    populatePoints(filtered);

    if (filtered.length > 0) {
        map.setCenter(filtered[0].position);
    }
}

function populatePoints(points){
  clearMarkers();
  currentPoints = points;
  const list = document.getElementById("locations-list");
  if(list) list.innerHTML = "";

  points.forEach((p) => {
    const pos = p.position;
    const title = getTitleForPoint(p);
    const isPetOnly = p.type.length === 1 && p.type.includes("Бутылки (ПЭТ)");
    const iconUrl = isPetOnly ? "http://google.com/mapfiles/ms/icons/red-dot.png" : "http://google.com/mapfiles/ms/icons/green-dot.png";

    const marker = new google.maps.Marker({
        position:pos,
        map:map,
        title:title,
        icon: { url: iconUrl }
    });
    currentMarkers.push(marker);

    const typesDisplay = p.type.map(typeKey => translateType(typeKey)).join(', ');

    const iwContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <strong style="color: #d32f2f;">${title}</strong><br>
            <span style="font-size: 0.9em;">${t('address')}: ${getAddressForPoint(p) || '—'}</span><br>
            <span style="font-size: 0.9em; color: #388e3c;">${t('accepts')}: <b>${typesDisplay}</b></span><br>
            <span style="font-size: 0.9em; color: #00796b;">${t('schedule')}: ${getScheduleForPoint(p) || '—'}</span><br>
            <button onclick="calculateRouteTo(${pos.lat}, ${pos.lng})" class="btn secondary btn-map-small" style="margin-top: 5px;">${t('route')}</button>
        </div>
    `;
    const infowindow = new google.maps.InfoWindow({ content: iwContent });

    marker.addListener("click", () => {
        currentMarkers.forEach(m => {
            if (m.infowindow) m.infowindow.close();
        });
        infowindow.open(map, marker);
    });
    marker.infowindow = infowindow;

    if(list) {
      const item = document.createElement('div');
      item.className = 'location-item';
      item.onclick = () => {
        map.setCenter(pos);
        map.setZoom(15);
        google.maps.event.trigger(marker, 'click');
      };

      item.innerHTML = `
        <strong>${title}</strong>
        <div class="schedule-label">${getAddressForPoint(p) || ''}</div>
        <div class="type-label">${t('accepts')}: ${typesDisplay}</div>
        <div class="schedule-label">${t('schedule')}: ${getScheduleForPoint(p) || ''}</div>
      `;
      list.appendChild(item);
    }
  });
}

/* ----------------------
  Маршрут и геолокация
------------------------*/
function calculateRouteTo(lat, lng) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                const destination = { lat: lat, lng: lng };
                displayRoute(origin, destination);
            },
            (error) => {
                handleGeolocationError(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert(t('geolocationUnsupported'));
    }
}
function displayRoute(origin, destination) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            directionsRenderer.setMap(map);
        } else {
            window.alert(t('routeError') + status);
        }
    });
}

function handleGeolocationError(error) {
    let message = t('locatingError');

    if (error && error.code === error.PERMISSION_DENIED) {
        message = t('permissionDenied');
    } else if (error && error.code === error.TIMEOUT) {
        message = t('timeoutMsg');
    } else if (error && error.code === error.POSITION_UNAVAILABLE) {
        message = t('positionUnavailable');
    }

    alert(message);
    console.error("Geolocation Error:", error && error.code, error && error.message);

    if (map) {
        map.setCenter(allRecyclingPoints[0].position);
        map.setZoom(11);
    }
}

function findNearest() {
    if (navigator.geolocation && currentPoints.length > 0) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setCenter(userLocation);
                map.setZoom(14);

                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: t('yourLocation'),
                    icon: { url: "http://google.com/mapfiles/ms/icons/blue-dot.png" }
                });

                let nearestPoint = null;
                let minDistance = Infinity;

                currentPoints.forEach(p => {
                    const distance = google.maps.geometry.spherical.computeDistanceBetween(
                        new google.maps.LatLng(userLocation.lat, userLocation.lng),
                        new google.maps.LatLng(p.position.lat, p.position.lng)
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestPoint = p;
                    }
                });

                if (nearestPoint) {
                    displayRoute(userLocation, nearestPoint.position);
                    const nearestMarker = currentMarkers.find(m => {
                      try {
                        return m.position.lat() === nearestPoint.position.lat && m.position.lng() === nearestPoint.position.lng;
                      } catch (e) {
                        return false;
                      }
                    });
                    if (nearestMarker && nearestMarker.infowindow) {
                         google.maps.event.trigger(nearestMarker, 'click');
                    }
                }
            },
            (error) => {
                handleGeolocationError(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else if (currentPoints.length === 0) {
        alert(t('noPoints'));
    } else {
        alert(t('geolocationUnsupported'));
    }
}

/* ===============================
   Eco-QR: демонстрация (UI)
   =============================== */
function openScanner() {
  const qrSection = document.getElementById("qr-scanner-section");
  const heroSection = document.querySelector(".hero");
  const btn = document.getElementById("open-scan");

  if (!qrSection) return;

  const isOpen = !qrSection.classList.contains("hidden");
  if (isOpen) {
    resetDemoUI();
    qrSection.classList.add("hidden");
    qrSection.style.display = "none";
    if (heroSection) heroSection.style.display = "block";
    if (btn) btn.textContent = t('openScanner');
  } else {
    qrSection.classList.remove("hidden");
    qrSection.style.display = "block";
    if (heroSection) heroSection.style.display = "none";
    if (btn) btn.textContent = t('closeScanner');
    showDemoUI();
  }
}

function showDemoUI() {
  const qrDemo = document.getElementById("qr-demo");
  if (qrDemo) qrDemo.style.display = "block";

  const startBtn = document.getElementById("start-demo-btn");
  const cancelBtn = document.getElementById("cancel-demo-btn");
  if (startBtn && !startBtn._attached) {
    startBtn.addEventListener("click", startDemoScan);
    startBtn._attached = true;
  }
  if (cancelBtn && !cancelBtn._attached) {
    cancelBtn.addEventListener("click", resetDemoUI);
    cancelBtn._attached = true;
  }
}

function resetDemoUI() {
  const progress = document.getElementById("demo-progress");
  const fakeText = document.getElementById("fake-text");
  const demoResult = document.getElementById("demo-result");
  const photoSection = document.getElementById("photo-upload-section");
  const confirmBox = document.getElementById("confirmation-box");

  if (progress) progress.style.width = "0%";
  if (fakeText) fakeText.textContent = t('scanningProcess');
  if (demoResult) { demoResult.style.display = "none"; demoResult.textContent = ""; }
  if (photoSection) photoSection.classList.add("hidden");
  if (confirmBox) confirmBox.remove();
  if (_demoInterval) clearInterval(_demoInterval);
}

function startDemoScan() {
  const progressBar = document.getElementById("demo-progress");
  const fakeText = document.getElementById("fake-text");

  if (!progressBar) return;
  let width = 0;
  progressBar.style.width = "0%";
  fakeText.textContent = t('scanning');

  if (_demoInterval) clearInterval(_demoInterval);

  _demoInterval = setInterval(() => {
    width += Math.floor(Math.random() * 10) + 8;
    if (width >= 100) width = 100;
    progressBar.style.width = width + "%";

    if (width >= 100) {
      clearInterval(_demoInterval);
      _demoInterval = null;
      fakeText.textContent = t('done');
      const photoSection = document.getElementById("photo-upload-section");
      if (photoSection) {
        photoSection.classList.remove("hidden");
        photoSection.style.display = "block";
      }
    }
  }, 200);
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const preview = document.getElementById("photo-preview");
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
  preview.style.display = "block";
}

function confirmSubmission() {
  const section = document.getElementById("photo-upload-section");
  if (section) section.classList.add("hidden");

  const overlay = document.createElement("div");
  overlay.id = "confirmation-box";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const box = document.createElement("div");
  box.style.background = "#fff";
  box.style.borderRadius = "20px";
  box.style.padding = "30px 20px";
  box.style.textAlign = "center";
  box.style.width = "90%";
  box.style.maxWidth = "340px";
  box.style.boxShadow = "0 6px 25px rgba(0,0,0,0.2)";
  box.style.animation = "fadeIn 0.5s ease";

  box.innerHTML = `
    <div style="font-size:50px; color:green; animation:pop 0.6s ease;">✔️</div>
    <h3 style="margin-top:10px;">${t('thanks')}</h3>
    <p>${t('savedCO2')} <b>0.25 kg CO₂!</b></p>
    <p>${t('appPrompt')}</p>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.5s";
    setTimeout(() => overlay.remove(), 500);
  }, 4000);
}

const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn { from {opacity:0; transform:scale(0.9);} to {opacity:1; transform:scale(1);} }
@keyframes pop { 0%{transform:scale(0);} 60%{transform:scale(1.2);} 100%{transform:scale(1);} }
`;
document.head.appendChild(style);

/* ----------------------
  LANGUAGE SWITCHER (поддержка файлов-версий)
------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    detectLangFromPath();

    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        const currentPath = window.location.pathname;
        let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        let baseFileName = currentFile.replace(/_(en|kz|tr|ru)\.html$/, '').replace(/\.html$/, '');

        const options = langSwitcher.options;
        for (let i = 0; i < options.length; i++) {
            // предполагаем, что опции имеют value вида 'index.html' или 'index_en.html'
            const fileTemplate = options[i].value.replace('index', baseFileName);
            options[i].value = fileTemplate;
            if (options[i].value === currentFile || (currentFile === baseFileName + '.html' && options[i].value === baseFileName + '.html')) {
                options[i].selected = true;
            }
        }

        langSwitcher.addEventListener('change', (event) => {
            const newFile = event.target.value;
            // определить язык из выбранного имени файла и сохранить (для возможного использования)
            const detected = newFile.toLowerCase().match(/_((ru|kz|tr))\.html$/);
            let newLang = 'en';
            if (detected && detected[1]) newLang = detected[1];
            try { localStorage.setItem('lang', newLang); } catch(e) {}
            const newPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            window.location.href = newPath + newFile;
        });
    }

    const menuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }

    updateStaticUITexts();
});

/* ----------------------
  Обновление статических UI-элементов
------------------------*/
function updateStaticUITexts() {
  const openBtn = document.getElementById('open-scan');
  if (openBtn) {
    const qrSection = document.getElementById("qr-scanner-section");
    const isOpen = qrSection && !qrSection.classList.contains("hidden");
    openBtn.textContent = isOpen ? t('closeScanner') : t('openScanner');
  }

  const filterContainer = document.getElementById('filter-buttons');
  if (filterContainer && document.body.classList.contains('map-page')) {
    renderFilterButtons();
    const btns = filterContainer.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (btns.length > 0) btns[0].classList.add('active');
  }

  if (currentPoints && currentPoints.length > 0) {
    populatePoints(currentPoints);
  }
}

/* ===============================
  Объявляем initMap глобально, чтобы Google Maps callback мог его вызвать
  (Убедись, что при подключении Google Maps API указан &callback=initMap)
   =============================== */
