import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { getFirebase } from "./firebase";

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

const firebaseErrorMessages = {
  "auth/email-already-in-use": "Email already in use. Try logging in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found. Please sign up first.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/weak-password": "Password should be at least 6 characters.",
  default: "Something went wrong. Please try again.",
};

function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [language, setLanguage] = useState("en");
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authInitError, setAuthInitError] = useState("");

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | signup | reset
  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authStatus, setAuthStatus] = useState({
    loading: false,
    error: "",
    message: "",
  });

  useEffect(() => {
    let unsubscribe;

    getFirebase()
      .then(({ auth, onAuthStateChanged }) => {
        setAuthReady(true);
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user ? { email: user.email ?? "" } : null);
        });
      })
      .catch((error) => {
        setAuthInitError(error.message);
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthValues({ email: "", password: "", confirmPassword: "" });
    setAuthStatus({ loading: false, error: "", message: "" });
    setShowAuth(true);
  };

  const closeAuth = () => {
    setShowAuth(false);
  };

  const handleAuthChange = (field) => (event) => {
    setAuthValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthStatus({ loading: true, error: "", message: "" });

    try {
      const { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } =
        await getFirebase();

      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, authValues.email, authValues.password);
        setAuthStatus({ loading: false, error: "", message: "Logged in successfully." });
        setTimeout(() => {
          closeAuth();
        }, 900);
      } else if (authMode === "signup") {
        if (authValues.password !== authValues.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await createUserWithEmailAndPassword(auth, authValues.email, authValues.password);
        setAuthStatus({ loading: false, error: "", message: "Account created. You are now signed in." });
        setTimeout(() => {
          closeAuth();
        }, 900);
      } else {
        await sendPasswordResetEmail(auth, authValues.email);
        setAuthStatus({
          loading: false,
          error: "",
          message: "Password reset email sent. Check your inbox.",
        });
      }
    } catch (error) {
      const code = error.code;
      const fallbackMessage = error.message || firebaseErrorMessages.default;
      const friendly = code ? firebaseErrorMessages[code] ?? fallbackMessage : fallbackMessage;
      setAuthStatus({ loading: false, error: friendly, message: "" });
    }
  };

  const handleLogout = async () => {
    try {
      const { auth, signOut } = await getFirebase();
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="app">
      <HeaderBar
        language={language}
        onChangeLanguage={setLanguage}
        currentUser={currentUser}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
        authDisabled={!authReady || Boolean(authInitError)}
        authInitError={authInitError}
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

      {showAuth ? (
        <AuthModal
          mode={authMode}
          language={language}
          values={authValues}
          status={authStatus}
          onChange={handleAuthChange}
          onSubmit={handleAuthSubmit}
          onClose={closeAuth}
          onSwitchMode={setAuthMode}
          disabled={!authReady || Boolean(authInitError)}
          authInitError={authInitError}
        />
      ) : null}
    </div>
  );
}

function HeaderBar({
  language,
  onChangeLanguage,
  currentUser,
  onOpenAuth,
  onLogout,
  authDisabled,
  authInitError,
}) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo">FP</span>
        <span className="topbar__name">FamilyDeals</span>
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
        {currentUser ? (
          <>
            <span className="topbar__user">{currentUser.email}</span>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onOpenAuth("login")} disabled={authDisabled}>
              Login
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => onOpenAuth("signup")}
              disabled={authDisabled}
            >
              Sign Up
            </button>
          </>
        )}
      </nav>
      {authInitError ? <span className="topbar__alert">Add Firebase config to enable auth.</span> : null}
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

function AuthModal({
  mode,
  values,
  status,
  onChange,
  onSubmit,
  onClose,
  onSwitchMode,
  disabled,
  authInitError,
}) {
  const renderTitle = () => {
    if (authInitError) return "Firebase configuration required";
    if (mode === "signup") return "Create your account";
    if (mode === "reset") return "Reset password";
    return "Welcome back";
  };

  const submitLabel =
    mode === "signup" ? "Sign Up" : mode === "reset" ? "Send reset link" : "Login";

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose} />
      <div className="auth-modal__panel">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>
        <h2>{renderTitle()}</h2>

        {authInitError ? (
          <p className="auth-modal__info">
            {authInitError} Open <code>src/firebase.js</code> and replace the placeholder credentials
            with your Firebase project keys.
          </p>
        ) : (
          <form className="auth-modal__form" onSubmit={onSubmit}>
            <label>
              Email
              <input
                type="email"
                value={values.email}
                onChange={onChange("email")}
                required
                placeholder="you@example.com"
              />
            </label>

            {mode !== "reset" ? (
              <label>
                Password
                <input
                  type="password"
                  value={values.password}
                  onChange={onChange("password")}
                  required
                  placeholder="••••••••"
                />
              </label>
            ) : null}

            {mode === "signup" ? (
              <label>
                Confirm password
                <input
                  type="password"
                  value={values.confirmPassword}
                  onChange={onChange("confirmPassword")}
                  required
                  placeholder="••••••••"
                />
              </label>
            ) : null}

            {status.error ? <p className="auth-modal__error">{status.error}</p> : null}
            {status.message ? <p className="auth-modal__success">{status.message}</p> : null}

            <button type="submit" disabled={status.loading || disabled}>
              {status.loading ? "Processing..." : submitLabel}
            </button>

            {mode === "login" ? (
              <button
                type="button"
                className="auth-modal__link"
                onClick={() => onSwitchMode("reset")}
              >
                Forgot password?
              </button>
            ) : null}

            {mode !== "login" ? (
              <button
                type="button"
                className="auth-modal__link"
                onClick={() => onSwitchMode("login")}
              >
                Back to login
              </button>
            ) : (
              <button
                type="button"
                className="auth-modal__link"
                onClick={() => onSwitchMode("signup")}
              >
                Need an account? Sign up
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default App;

