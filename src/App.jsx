import "./App.css";

function toDriveDirectUrl(urlOrId) {
  if (!urlOrId) return "";
  if (!urlOrId.includes("/")) {
    return `https://drive.google.com/uc?export=download&id=${urlOrId}`;
  }

  if (urlOrId.includes("uc?export=download")) return urlOrId;

  const byPath = urlOrId.match(/\/file\/d\/([^/]+)/);
  if (byPath?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${byPath[1]}`;
  }

  const byQuery = urlOrId.match(/[?&]id=([^&]+)/);
  if (byQuery?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${byQuery[1]}`;
  }

  return urlOrId;
}

const apps = [
  {
    id: 1,
    name: "  المحاسب  ",
    category: " تطبيق لهواتف الاندرويد",
    badge: "مميز",
    version: "v1.2.1253",
    android: "5.0 والأحدث",
    image: "/m.jpeg",
    downloadUrl: "/%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D8%B3%D8%A8%20(1).apk",
  },
  {
    id: 2,
    name: "  المحاسب  ",
    category: " تطبيق  لجهاز الكمبيوتر",
    badge: "مميز",
    version: "v1.2.1253",
    android: "5.0 والأحدث",
    image: "/m.jpeg",
    downloadUrl: "",
  },
 
 
];

function handleDownload(app) {
  const link = document.createElement("a");
  link.href = app.downloadUrl;
  const isApk = app.downloadUrl.toLowerCase().includes(".apk");
  link.download = isApk ? `${app.name.trim()}.apk` : app.name;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function App() {
  return (
    <main className="apps-page">
      <header className="apps-header">
        <h1 className="apps-header__title">MDS bureautique</h1>
        <p className="apps-header__subtitle">برامج محاسبية</p>
      </header>
      <section className="apps-strip">
        {apps.map((app) => (
          <article key={app.id} className="app-card">
            <div className="app-card__top">
              <span className="app-card__update-dot" />
              <span className="app-card__update-text">تحديث</span>
            </div>

            <img className="app-card__image" src={app.image} alt={app.name} />

            <span className="app-card__badge">{app.badge}</span>
            <h3 className="app-card__title">{app.name}</h3>
            <p className="app-card__category">{app.category}</p>

            <button className="app-card__download" onClick={() => handleDownload(app)} type="button">
              تحميل
            </button>

            <div className="app-card__meta">
              <span>{app.version}</span>
              <span>{app.android}</span>
            </div>
          </article>
        ))}
      </section>
      <footer className="apps-footer">
        <p>تم التطوير بواسطة</p>
        <p>dev. med said mohameden</p>
      </footer>
    </main>
  );
}

export default App;
