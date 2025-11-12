import { useMemo, useState } from "react";
import "./App.css";
import officeImage from "./assets/off.jpg";
import windows10Image from "./assets/w10.jpg";
import windows11Image from "./assets/w11.jpg";

const categories = [

  { id: "office", icon: "💻", label: "برامج مكتبية", helper: "أوفيس بجميع إصداراته" },
  { id: "systems", icon: "🪟", label: " دورات ", helper: "دورة في المعلوماتية  " },


];


const products = [
    {
    id: "office-dewra",
    name: "دورة في المعلوماتية   ",
    description: "word , excel , powerpoint, access",
    priceMru: "600",
    billing: "مرة واحدة",
    sold: 8120,
    accountMask: "76**09",
    lastPurchase: "قبل 5 ساعات",
    category: "systems",
    image: windows11Image,
  },
  {
    id: "office-2021",
    name: "أوفيس 2021 برو",
    description: "وورد، إكسل، باوربوينت، أكسس وتفعيل دائم.",
    priceMru: "300",
    billing: "مرة واحدة",
    sold: 34322,
    accountMask: "80**14",
    lastPurchase: "قبل ساعتين",
    category: "office",
    image: officeImage,
  },
  {
    id: "windows-pro",
    name: "windowz  10",
    description: "مفتاح أصلي مع تفعيل فوري ودعم كامل للتحديثات.",
    priceMru: "280",
    billing: "مرة واحدة",
    sold: 8120,
    accountMask: "76**09",
    lastPurchase: "قبل 5 ساعات",
    category: "office",
    image: windows10Image,
  },



];

const lessons = [
  {
    id: "lesson-01",
    title: "Getting started with FamilyDeals",
    duration: "12 min",
    description: "Understand how the dashboard works and how to request premium accounts.",
    resource: "https://example.com/docs/getting-started.pdf",
  },
  {
    id: "lesson-02",
    title: "Optimizing shared accounts",
    duration: "20 min",
    description: "Best practices for managing profiles, renewals, and customer slots.",
    resource: "https://example.com/docs/shared-accounts.pdf",
  },
  {
    id: "lesson-03",
    title: "Handling payments in MRU",
    duration: "18 min",
    description: "Quick overview of local gateways and how to convert USD pricing to MRU.",
    resource: "https://example.com/docs/payments.pdf",
  },
];

const heroCopy = {
  heading: (
    <>
      ابدأ رحلتك <span>واستمتع بدوراتنا </span>
    </>
  ),
  description: "  للتسجيل في دورتنا ماعليك سوي إنشاء حساب ومتابعة الفيديوهات .",
  cta: "استكشف العروض",
};

const productCopy = {
  sold: "تم البيع",
  cta: "انضم الآن",
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

const orderDefaultValues = {
  fullName: "",
  phone: "",
  productName: "",
  priceMru: "",
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

async function submitOrderLead(values) {
  const payload = {
    name: values.fullName,
    phone: values.phone,
    product: values.productName,
    price_mru: values.priceMru,
    _subject: `New order request: ${values.productName}`,
    form_type: "product_order",
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

  if (!response.ok) {
    let reason = "";
    try {
      const data = await response.json();
      reason = data.message;
    } catch {
      // ignore
    }
    throw new Error(reason || "تفقد من اتصالك بالانترنت ");
  }
}



function App() {
  const [activeCategory, setActiveCategory] = useState("all");
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
  const [showOrder, setShowOrder] = useState(false);
  const [orderValues, setOrderValues] = useState({ ...orderDefaultValues });
  const [orderStatus, setOrderStatus] = useState({ loading: false, error: "", message: "" });
  const [activePage, setActivePage] = useState("home"); // home | lessons

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openSignup = () => {
    setSignupValues({ ...signupDefaultValues });
      setSignupStatus({
        loading: false,
        error: "",
        message: "Thanks! We received your details and will reply by email shortly.",
      });
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
      const friendly = error?.message || "Something went wrong while verifying your credentials.";
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
        throw new Error("We couldn't load the login sheet. Please try again.");
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
        throw new Error("Name or password is incorrect. Double-check both fields.");
      }

      setLoginStatus({ loading: false, error: "", message: "Logged in successfully." });
      setLoggedInUser({ name: match.name });
      setActivePage("lessons");
      setTimeout(() => {
        closeLogin();
      }, 900);
    } catch (error) {
      const friendly = error?.message || "We couldn't send your request. Please try again.";
      setLoginStatus({ loading: false, error: friendly, message: "" });
    }
  };

  const handleLogoutUser = () => {
    setLoggedInUser(null);
    setActivePage("home");
  };

  const openOrderModal = (product) => {
    const priceMru = product.priceMru ?? "";
    setOrderValues({
      ...orderDefaultValues,
      productName: product.name,
      priceMru,
    });
    setOrderStatus({ loading: false, error: "", message: "" });
    setShowOrder(true);
  };

  const closeOrderModal = () => {
    setShowOrder(false);
  };

  const handleOrderChange = (field) => (event) => {
    setOrderValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    try {
      setOrderStatus({ loading: true, error: "", message: "" });
      await submitOrderLead(orderValues);
      setOrderStatus({
        loading: false,
        error: "",
        message: "Order sent! We'll contact you shortly.",
      });
      setTimeout(() => {
        closeOrderModal();
      }, 1000);
    } catch (error) {
      const friendly = error?.message || "Unable to submit the order form. Try again.";
      setOrderStatus({ loading: false, error: friendly, message: "" });
    }
  };

  const handleExploreClick = () => {
    if (!loggedInUser) {
      openLogin();
      return;
    }
    setActivePage("home");
  };

  return (
    <div className="app">
      <HeaderBar
        onOpenSignup={openSignup}
        onOpenLogin={openLogin}
        loggedInUser={loggedInUser}
        onLogout={handleLogoutUser}
        onNavHome={() => setActivePage("home")}
        onNavLessons={() => setActivePage("lessons")}
        activePage={activePage}
      />
      <main className={`layout${activePage === "lessons" ? " layout--lessons" : ""}`}>
        {activePage === "lessons" ? (
          <LessonsPage lessons={lessons} />
        ) : (
          <>
            <HeroSection onExplore={handleExploreClick} />
            <CategoryBar categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
            <ProductSection products={filteredProducts} onJoin={openOrderModal} />
          </>
        )}
        <Footer />
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
      {showOrder ? (
        <OrderModal
          values={orderValues}
          status={orderStatus}
          onChange={handleOrderChange}
          onSubmit={handleOrderSubmit}
          onClose={closeOrderModal}
        />
      ) : null}
    </div>
  );
}

function HeaderBar({ onOpenSignup, onOpenLogin, loggedInUser, onLogout, onNavHome, onNavLessons, activePage }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo">MDS</span>
        <span className="topbar__name">Bureautique</span>
      </div>
      <nav className="topbar__actions">
        {loggedInUser ? (
          <>
            <button
              type="button"
              className={activePage === "home" ? "is-active" : ""}
              onClick={onNavHome}
            >
              العروض
            </button>
            <button
              type="button"
              className={activePage === "lessons" ? "is-active" : ""}
              onClick={onNavLessons}
            >
              الدروس
            </button>
            <span className="topbar__user">{`مرحبا بك, ${loggedInUser.name}`}</span>
            <button type="button" onClick={onLogout}>
             تسجيل الخروج
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onOpenLogin}>
              تسجيل الدخول
            </button>
            <button type="button" className="primary" onClick={onOpenSignup}>
             انشاء حساب
            </button>
          </>
        )}
      </nav>
    </header>



  );
}

function HeroSection({ onExplore }) {
  const copy = heroCopy;
  return (
    <section className="hero">
      <div className="hero__text">
        <h1>{copy.heading}</h1>
        <p>{copy.description}</p>
        <button type="button" onClick={onExplore}>
          {copy.cta}
        </button>
      </div>
      <div className="hero__art" aria-hidden="true">
        <div className="hero__illustration" />
      </div>
    </section>
  );
}

function CategoryBar({ categories, activeCategory, onSelect }) {
  return (
    <section className="categories">
      {categories.map((category) => {
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
            <span className="categories__label">{category.label}</span>
            <span className="categories__helper">{category.helper}</span>
          </button>
        );
      })}
    </section>
  );
}

function ProductSection({ products, onJoin }) {
  return (
    <section className="products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onJoin={onJoin} />
      ))}
    </section>
  );
}

function ProductCard({ product, onJoin }) {
  const strings = productCopy;

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
          <span className="product-card__price-value">{product.priceMru} MRU</span>
          <span className="product-card__price-caption">{product.billing}</span>
        </div>
        <button type="button" className="product-card__cta" onClick={() => onJoin(product)}>
          {strings.cta}
        </button>
      </footer>
    </article>
  );
}

function LoginModal({ values, status, onChange, onSubmit, onClose }) {
  const submitLabel = status.loading ? "جاري التحقق..." : "دخول";

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>تسجيل الدخول</h2>

        <form className="auth-modal__form" onSubmit={onSubmit}>
          <label>
            الاسم الكامل
            <input
              type="text"
              value={values.name}
              onChange={onChange("name")}
              required
              placeholder="Must match the sheet entry"
            />
          </label>
          <label>
            كلمة المرور
            <input
              type="password"
              value={values.password}
              onChange={onChange("password")}
              required
              placeholder="********"
            />
          </label>

          {status.error ? <p className="auth-modal__error">{status.error}</p> : null}
          {status.message ? <p className="auth-modal__success">{status.message}</p> : null}

          <button type="submit" disabled={status.loading}>
            {submitLabel}
          </button>
          <button type="button" className="auth-modal__link" onClick={onClose}>
            اغلاق
          </button>
        </form>
      </div>
    </div>
  );
}

function SignupModal({ values, status, onChange, onSubmit, onClose }) {
  const submitLabel = status.loading ? "جاري الانشاء والتحقق..." : "إنشاء";

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
       الرجاء ادخال معلومات صحيحة معلومات صحيحة
          </p>
          <label>
          الاسم الكامل
            <input
              type="text"
              value={values.fullName}
              onChange={onChange("fullName")}
              required
              placeholder="Example: Mohamed Ahmed"
            />
          </label>
          <label>
            البريد الالكتروني 
            <input
              type="email"
              value={values.email}
              onChange={onChange("email")}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
           رقم الواتساب
            <input
              type="tel"
              value={values.phone}
              onChange={onChange("phone")}
              placeholder="+20 10 0000 0000"
            />
          </label>
          <label>
            كلمة المرور
            <input
              type="text"
              value={values.service}
              onChange={onChange("service")}
              required
              placeholder=""
            />
          </label>
        

          {status.error ? <p className="auth-modal__error">{status.error}</p> : null}
          {status.message ? <p className="auth-modal__success">{status.message}</p> : null}

          <button type="submit" disabled={status.loading}>
            {submitLabel}
          </button>
          <button type="button" className="auth-modal__link" onClick={onClose}>
            اغلاق
          </button>
        </form>
      </div>
    </div>
  );
}

function OrderModal({ values, status, onChange, onSubmit, onClose }) {
  const submitLabel = status.loading ? "Sending..." : "Send order";
  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>Confirm your order</h2>
        <form className="auth-modal__form" onSubmit={onSubmit}>
          <label>
            Full name
            <input
              type="text"
              value={values.fullName}
              onChange={onChange("fullName")}
              required
              placeholder="Your full name"
            />
          </label>
          <label>
            Phone / WhatsApp
            <input
              type="tel"
              value={values.phone}
              onChange={onChange("phone")}
              required
              placeholder="+222 XX XX XX XX"
            />
          </label>
          <label>
            Product name
            <input
              type="text"
              value={values.productName}
              onChange={onChange("productName")}
              required
            />
          </label>
          <label>
            Price (MRU)
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.priceMru}
              onChange={onChange("priceMru")}
              required
            />
          </label>

          {status.error ? <p className="auth-modal__error">{status.error}</p> : null}
          {status.message ? <p className="auth-modal__success">{status.message}</p> : null}

          <button type="submit" disabled={status.loading}>
            {submitLabel}
          </button>
          <button type="button" className="auth-modal__link" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
}
function LessonsPage({ lessons }) {
  return (
    <section className="lessons-page">
      <header className="lessons-page__header">
        <h1>Course lessons</h1>
        <p>All recordings and resources are available below after you log in.</p>
      </header>
      <div className="lessons-page__grid">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="lesson-card">
            <div className="lesson-card__meta">
              <span className="lesson-card__badge">{lesson.duration}</span>
            </div>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <a href={lesson.resource} target="_blank" rel="noreferrer" className="lesson-card__link">
              Open resource
            </a>
          </article>
        ))}
      </div>
    </section>





  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <p>dev.med said mohameden</p>
    </footer>
  );
}

export default App;
