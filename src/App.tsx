import { useEffect, useState } from 'react';
import { MountainSilhouette } from './decorations';
import HeroSection from './components/HeroSection';
import TypePreviewSection from './components/TypePreviewSection';
import LoveTypeSection from './components/LoveTypeSection';
import CardRegisterPage from './components/CardRegisterPage';
import CardBrowsePage from './components/CardBrowsePage';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { getCurrentUser } from './services/auth';
import { types } from './data/loveTest';
import type { AuthData } from './types/auth';
import type { LoveType } from './data/loveTest';

type PageState = 'home' | 'test' | 'register' | 'cards';

const LOVE_TYPE_STORAGE_KEY = 'testResultLoveType';

const getPageFromPath = (): PageState => {
  if (window.location.pathname === '/test') return 'test';
  if (window.location.pathname === '/register') return 'register';
  if (window.location.pathname === '/cards') return 'cards';
  return 'home';
};

const getStoredLoveType = (): LoveType | null => {
  const value = sessionStorage.getItem(LOVE_TYPE_STORAGE_KEY);
  return types.includes(value as LoveType) ? (value as LoveType) : null;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthData | null>(null);
  const [page, setPage] = useState<PageState>('home');
  const [testResultType] = useState<LoveType | null>(getStoredLoveType);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }

    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token)
        .then(setCurrentUser)
        .catch(() => setCurrentUser(null));
    }

    const handlePopState = () => {
      setPage(getPageFromPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRegisterComplete = (data: AuthData) => {
    setCurrentUser(data);
    sessionStorage.removeItem(LOVE_TYPE_STORAGE_KEY);
  };

  const handleLoginSuccess = (data: AuthData) => {
    setCurrentUser(data);
    setIsLoginOpen(false);
    moveToPage('cards');
  };

  const moveToPage = (nextPage: PageState) => {
    const nextPath =
      nextPage === 'test'
        ? '/test'
        : nextPage === 'register'
          ? '/register'
          : nextPage === 'cards'
            ? '/cards'
            : '/';

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }

    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* 좌우 산수화 장식 — lg 이상에서만 표시 */}
      <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-32 pointer-events-none z-0 overflow-hidden">
        <MountainSilhouette className="absolute top-8 left-0 opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-48"
          style={{ background: 'linear-gradient(to top, #ece0b8 20%, transparent)' }} />
      </div>
      <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-32 pointer-events-none z-0 overflow-hidden">
        <MountainSilhouette className="absolute top-24 right-0 opacity-80" flip />
        <div className="absolute bottom-0 right-0 w-full h-48"
          style={{ background: 'linear-gradient(to top, #ece0b8 20%, transparent)' }} />
      </div>

      {/* 메인 콘텐츠 컨테이너 */}
      <div className="relative z-10 w-full max-w-[680px] mx-auto flex flex-col min-h-screen">
        <Header
          currentUser={currentUser}
          onLoginClick={() => setIsLoginOpen(true)}
          onLogout={() => setCurrentUser(null)}
          onHomeClick={() => moveToPage('home')}
        />
        <main className="flex-1 flex flex-col">
          {page === 'home' ? (
            <>
              <HeroSection
                onTestClick={() => moveToPage('test')}
                onCreateClick={() => moveToPage('register')}
                onBrowseClick={() => moveToPage('cards')}
              />
              <TypePreviewSection />
            </>
          ) : page === 'test' ? (
            <LoveTypeSection
              onGoHome={() => moveToPage('home')}
            />
          ) : page === 'register' ? (
            <CardRegisterPage
              resultType={testResultType}
              onComplete={handleRegisterComplete}
              onBrowseCards={() => moveToPage('cards')}
              onGoHome={() => moveToPage('home')}
              onBackToTest={() => moveToPage('test')}
            />
          ) : (
            <CardBrowsePage
              onBackHome={() => moveToPage('home')}
              onCreateCard={() => moveToPage('register')}
              onLoginClick={() => setIsLoginOpen(true)}
              onStartTest={() => moveToPage('test')}
            />
          )}
        </main>
        <Footer />
      </div>

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
