import { useMemo, useState } from "react";
import "./App.css";

const categories = [
  { id: "all", icon: "🤝", label: "All", helper: "Every offer" },
  { id: "ai", icon: "🤖", label: "AI", helper: "ChatGPT & more" },
  { id: "media", icon: "🎬", label: "Audio & Video", helper: "Netflix, Spotify" },
  { id: "design", icon: "🎨", label: "Creative", helper: "Adobe, Canva" },
  { id: "productivity", icon: "🧠", label: "Productivity", helper: "Office, Windows" },
];

const products = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    description: "Faster answers, always-on GPT-4 access for power users.",
    price: 5.5,
    billing: "month",
    sold: 34322,
    accountMask: "80**14",
    lastPurchase: "2 hours ago",
    category: "ai",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  {
    id: "midjourney",
    name: "Midjourney Boost",
    description: "Add 15 fast hours for high quality renders during sprints.",
    price: 6.99,
    billing: "month",
    sold: 8120,
    accountMask: "76**09",
    lastPurchase: "5 hours ago",
    category: "ai",
    image: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    description: "Create with Photoshop, Illustrator, Premiere Pro, and more.",
    price: 4.99,
    billing: "month",
    sold: 63,
    accountMask: "vl**14",
    lastPurchase: "5 days ago",
    category: "design",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Adobe_Corporate_logo.svg/512px-Adobe_Corporate_logo.svg.png",
  },
  {
    id: "canva-pro",
    name: "Canva Pro Team",
    description: "Unlimited templates, stock assets, and brand kit controls.",
    price: 3.2,
    billing: "month",
    sold: 941,
    accountMask: "ca**28",
    lastPurchase: "1 day ago",
    category: "design",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Canva_Logo.png",
  },
  {
    id: "office-365",
    name: "Microsoft 365 Family",
    description: "Six users with full Office apps and 1 TB OneDrive each.",
    price: 6.4,
    billing: "month",
    sold: 1267,
    accountMask: "ms**07",
    lastPurchase: "today",
    category: "productivity",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    id: "windows-11",
    name: "Windows 11 Pro Key",
    description: "Instant OEM key with bilingual activation guide and support.",
    price: 3.5,
    billing: "license",
    sold: 20450,
    accountMask: "wn**43",
    lastPurchase: "30 minutes ago",
    category: "productivity",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Windows_logo_-_2021.svg",
  },
  {
    id: "spotify-duo",
    name: "Spotify Premium Duo",
    description: "Ad-free music streaming for two devices with offline mode.",
    price: 2.99,
    billing: "month",
    sold: 14500,
    accountMask: "sp**66",
    lastPurchase: "3 hours ago",
    category: "media",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  },
  {
    id: "netflix-uhd",
    name: "Netflix Ultra HD",
    description: "Watch unlimited series and films in crisp 4K resolution.",
    price: 7.5,
    billing: "month",
    sold: 5874,
    accountMask: "nt**22",
    lastPurchase: "1 day ago",
    category: "media",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg",
  },
];

const languageLabels = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

const heroCopy = {
  en: {
    heading: (
      <>
        Start Joining · <span>Enjoy Saving</span>
      </>
    ),
    description: "Join premium subscriptions at family pricing, delivered instantly.",
    cta: "Explore deals",
  },
  fr: {
    heading: (
      <>
        Commencez ensemble · <span>Profitez des économies</span>
      </>
    ),
    description: "Abonnez-vous aux meilleurs services à tarif familial, livraison immédiate.",
    cta: "Découvrir les offres",
  },
  ar: {
    heading: (
      <>
        ابدأ الاشتراك · <span>واستمتع بالتوفير</span>
      </>
    ),
    description: "انضم إلى أفضل الاشتراكات الرقمية بأسعار عائلية وتسليم فوري.",
    cta: "استكشف العروض",
  },
};

const categoryCopy = {
  en: {
    all: "All",
    helperAll: "Every offer",
  },
  fr: {
    all: "Tout",
    helperAll: "Toutes les offres",
  },
  ar: {
    all: "الكل",
    helperAll: "كل العروض",
  },
};

const productCopy = {
  en: {
    sold: "Sold",
    cta: "Join in",
  },
  fr: {
    sold: "Vendus",
    cta: "Rejoindre",
  },
  ar: {
    sold: "تم البيع",
    cta: "انضم الآن",
  },
};

const SIGNUP_TARGET_EMAIL = "saiidfatis@gmail.com";
const SIGNUP_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(SIGNUP_TARGET_EMAIL)}`;
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyeu9IDkdfadmmO3IDCNUixWS8GaUTyMFWy94KIlkmuUpMJT49h7_Px_rA2amN-gHOZBpr4VZQMBXV/pub?output=csv";

const signupDefaultValues = {
  fullName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

async function submitSignupLead(values) {
  const payload = {
    name: values.fullName,
    email: values.email,
    phone: values.phone,
    service: values.service,
    details: values.message,
    _subject: "New FamilyDeals sign-up request",
    _template: "table",
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(SIGNUP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (parseError) {
    // Ignore parse errors and rely on status code.
  }

  if (!response.ok) {
    throw new Error(data.message || "تعذر إرسال الطلب. حاول مرة أخرى.");
  }

  if (data.success && String(data.success).toLowerCase() === "true") {
    return data;
  }

  if (data.success === undefined) {
    return data;
  }

  throw new Error(data.message || "لم نتمكن من تسليم رسالتك، حاول مرة أخرى.");
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function sanitizeCell(cell = "") {
  return cell.replace(/^\ufeff/, "").trim();
}

function extractLoginEntries(csvText) {
  if (!csvText) return [];
  const rows = csvText
    .split(/\r?\n/)
    .filter((line) => line.trim() != "")
    .map((line) => parseCsvLine(line));

  if (!rows.length) return [];

  const [, ...dataRows] = rows;
  return dataRows
    .map((row) => ({
      name: sanitizeCell(row[0]),
      password: sanitizeCell(row[1]),
    }))
    .filter((entry) => entry.name && entry.password);
}



function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [language, setLanguage] = useState("en");
  const [showSignup, setShowSignup] = useState(false);
  const [signupValues, setSignupValues] = useState(() => ({ ...signupDefaultValues }));
  const [signupStatus, setSignupStatus] = useState({
    loading: false,
    error: "",
    message: "",
  });
  const [showLogin, setShowLogin] = useState(false);
  const [loginValues, setLoginValues] = useState({ name: "", password: "" });
  const [loginStatus, setLoginStatus] = useState({ loading: false, error: "", message: "" });
  const [loggedInUser, setLoggedInUser] = useState(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openSignup = () => {
    setSignupValues({ ...signupDefaultValues });
    setSignupStatus({ loading: false, error: "", message: "" });
    setShowSignup(true);
  };

  const closeSignup = () => {
    setShowSignup(false);
  };

  const handleSignupChange = (field) => (event) => {
    setSignupValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    try {
      setSignupStatus({ loading: true, error: "", message: "" });
      await submitSignupLead(signupValues);
      setSignupStatus({
        loading: false,
        error: "",
        message: " تم بنجاح",
      });
      setSignupValues({ ...signupDefaultValues });
      setTimeout(() => {
        closeSignup();
      }, 1200);
    } catch (error) {
      const friendly = error?.message || "حدث خطأ";
      setSignupStatus({ loading: false, error: friendly, message: "" });
    }
  };

  const openLogin = () => {
    setLoginValues({ name: "", password: "" });
    setLoginStatus({ loading: false, error: "", message: "" });
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const handleLoginChange = (field) => (event) => {
    setLoginValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoginStatus({ loading: true, error: "", message: "" });
      const response = await fetch(SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error("");
      }

      const text = await response.text();
      const entries = extractLoginEntries(text);
      const targetName = loginValues.name.trim();
      const targetPassword = loginValues.password.trim();

      const match = entries.find((entry) =>
        entry.name.localeCompare(targetName, undefined, { sensitivity: "accent", usage: "search" }) === 0 &&
        entry.password === targetPassword
      );

      if (!match) {
        throw new Error("");
      }

      setLoginStatus({ loading: false, error: "", message: " " });
      setLoggedInUser({ name: match.name });
      setTimeout(() => {
        closeLogin();
      }, 900);
    } catch (error) {
      const friendly = error?.message || " ";
      setLoginStatus({ loading: false, error: friendly, message: "" });
    }
  };

  const handleLogoutUser = () => {
    setLoggedInUser(null);
  };

  return (
    <div className="app">
      <HeaderBar
        language={language}
        onChangeLanguage={setLanguage}
        onOpenSignup={openSignup}
        onOpenLogin={openLogin}
        loggedInUser={loggedInUser}
        onLogout={handleLogoutUser}
      />
      <main className="layout">
        <HeroSection language={language} />
        <CategoryBar
          categories={categories}
          language={language}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <ProductSection language={language} products={filteredProducts} />
      </main>

      {showSignup ? (
        <SignupModal
          values={signupValues}
          status={signupStatus}
          onChange={handleSignupChange}
          onSubmit={handleSignupSubmit}
          onClose={closeSignup}
        />
      ) : null}
      {showLogin ? (
        <LoginModal
          values={loginValues}
          status={loginStatus}
          onChange={handleLoginChange}
          onSubmit={handleLoginSubmit}
          onClose={closeLogin}
        />
      ) : null}
    </div>
  );
}

function HeaderBar({ language, onChangeLanguage, onOpenSignup, onOpenLogin, loggedInUser, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo">MDS</span>
        <span className="topbar__name">Bureautique</span>
      </div>
      <nav className="topbar__actions">
        <select
          className="language-switcher"
          value={language}
          onChange={(event) => onChangeLanguage(event.target.value)}
        >
          {Object.entries(languageLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {loggedInUser ? (
          <>
            <span className="topbar__user">{`اسم المستخدم ${loggedInUser.name}`}</span>
            <button type="button" onClick={onLogout}>
              {"خروج"}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onOpenLogin}>
              Login
            </button>
            <button type="button" className="primary" onClick={onOpenSignup}>
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function HeroSection({ language }) {
  const copy = heroCopy[language];
  return (
    <section className="hero">
      <div className="hero__text">
        <h1>{copy.heading}</h1>
        <p>{copy.description}</p>
        <button type="button">{copy.cta}</button>
      </div>
      <div className="hero__art" aria-hidden="true">
        <div className="hero__illustration" />
      </div>
    </section>
  );
}

function CategoryBar({ categories, language, activeCategory, onSelect }) {
  const strings = categoryCopy[language];
  return (
    <section className="categories">
      {categories.map((category) => {
        const isAll = category.id === "all";
        const label = isAll ? strings.all : category.label;
        const helper = isAll ? strings.helperAll : category.helper;
        const isActive = category.id === activeCategory;

        return (
          <button
            key={category.id}
            type="button"
            className={`categories__item${isActive ? " is-active" : ""}`}
            onClick={() => onSelect(category.id)}
          >
            <span className="categories__icon" aria-hidden="true">
              {category.icon}
            </span>
            <span className="categories__label">{label}</span>
            <span className="categories__helper">{helper}</span>
          </button>
        );
      })}
    </section>
  );
}

function ProductSection({ products, language }) {
  return (
    <section className="products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} language={language} />
      ))}
    </section>
  );
}

function ProductCard({ product, language }) {
  const strings = productCopy[language];

  return (
    <article className="product-card">
      <header className="product-card__header">
        <span className="product-card__avatar">
          <img src={product.image} alt={`${product.name} logo`} />
        </span>
        <div className="product-card__headline">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </header>
      <div className="product-card__activity">
        <span>
          {product.accountMask} purchased {product.lastPurchase}
        </span>
        <span>
          {strings.sold}: {product.sold.toLocaleString()}
        </span>
      </div>
      <footer className="product-card__footer">
        <div className="product-card__price">
          <span className="product-card__price-value">${product.price}</span>
          <span className="product-card__price-caption">/{product.billing}</span>
        </div>
        <button type="button" className="product-card__cta">
          {strings.cta}
        </button>
      </footer>
    </article>
  );
}

function LoginModal({ values, status, onChange, onSubmit, onClose }) {
  const submitLabel = status.loading ? "دخول" : "تم";

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>تسجيل دخول</h2>

        <form className="auth-modal__form" onSubmit={onSubmit}>
          <label>
          email
            <input
              type="text"
              value={values.name}
              onChange={onChange("name")}
              required
              placeholder="البريد الالكتروني"
            />
          </label>
          <label>
           mot de passe
            <input
              type="password"
              value={values.password}
              onChange={onChange("password")}
              required
              placeholder="كلمة المرور"
            />
          </label>

          {status.error ? <p className="auth-modal__error">{status.error}</p> : null}
          {status.message ? <p className="auth-modal__success">{status.message}</p> : null}

          <button type="submit" disabled={status.loading}>
            {submitLabel}
          </button>
          <button type="button" className="auth-modal__link" onClick={onClose}>
           رجوع
          </button>
        </form>
      </div>
    </div>
  );
}

function SignupModal({ values, status, onChange, onSubmit, onClose }) {
  const submitLabel = status.loading ? "دخول" : "دخول";

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>إنشاء حساب</h2>

        <form className="auth-modal__form" onSubmit={onSubmit}>
          <p className="auth-modal__info">
رجاءا تأكد من صحة المعلومات 
          </p>
          <label>
         Name : 
            <input
              type="text"
              value={values.fullName}
              onChange={onChange("fullName")}
              required
              placeholder="إسم المستخدم"
            />
          </label>
          <label>
            Email :
            <input
              type="email"
              value={values.email}
              onChange={onChange("email")}
              required
              placeholder="البريد الالكتروني "
            />
          </label>
          <label>
          Numéro whatsapp :
            <input
              type="tel"
              value={values.phone}
              onChange={onChange("phone")}
              placeholder="رقم الواتساب"
            />
          </label>
          <label>
            Mot de passe :
            <input
              type="text"
              value={values.service}
              onChange={onChange("service")}
              required
              placeholder="كلمة المرور"
            />
          </label>
       

 <label>
            Mot de passe :
            <input
              type="text"
              value={values.service}
              onChange={onChange("service")}
              required
              placeholder="كلمة المرور"
            />
          </label>



          {status.error ? <p className="auth-modal__error">{status.error}</p> : null}
          {status.message ? <p className="auth-modal__success">{status.message}</p> : null}

          <button type="submit" disabled={status.loading}>
            {submitLabel}
          </button>
          <button type="button" className="auth-modal__link" onClick={onClose}>
          رجوع
          </button>
        </form>
      </div>
    </div>
  );
}



export default App;
