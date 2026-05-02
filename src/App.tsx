import { useEffect, useState } from 'react';
import { MountainSilhouette, SectionOrnamentDivider } from './decorations';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoveTypeSection from './components/LoveTypeSection';
import CardRegisterPage from './components/CardRegisterPage';
import ActionSection from './components/ActionSection';
import GuideSection from './components/GuideSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { getSession } from './services/auth';
import type { AuthData } from './types/auth';
import type { LoveType } from './data/loveTest';

type ModalState = 'none' | 'login';
type PageState = 'home' | 'test' | 'register';

const LOVE_TYPE_STORAGE_KEY = 'testResultLoveType';

const getPageFromPath = (): PageState => {
  if (window.location.pathname === '/test') return 'test';
  if (window.location.pathname === '/register') return 'register';
  return 'home';
};

const getStoredLoveType = (): LoveType | null => {
  const value = sessionStorage.getItem(LOVE_TYPE_STORAGE_KEY);
  if (
    value === '사또' ||
    value === '장군' ||
    value === '양반' ||
    value === '돌쇠' ||
    value === '왕족' ||
    value === '광대'
  ) {
    return value;
  }

  return null;
};

export default function App() {
  const [modal, setModal] = useState<ModalState>('none');
  const [currentUser, setCurrentUser] = useState<AuthData | null>(getSession);
  const [page, setPage] = useState<PageState>(getPageFromPath);
  const [testResultType, setTestResultType] = useState<LoveType | null>(getStoredLoveType);

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAuthSuccess = (data: AuthData) => {
    setCurrentUser(data);
    setModal('none');
  };

  const handleRegisterComplete = (data: AuthData) => {
    setCurrentUser(data);
    sessionStorage.removeItem(LOVE_TYPE_STORAGE_KEY);
    moveToPage('home');
  };

  const handleCardRegisterClick = (resultType: LoveType) => {
    setTestResultType(resultType);
    sessionStorage.setItem(LOVE_TYPE_STORAGE_KEY, resultType);
    moveToPage('register');
  };

  const moveToPage = (nextPage: PageState) => {
    const nextPath = nextPage === 'test' ? '/test' : nextPage === 'register' ? '/register' : '/';

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
          onLoginClick={() => setModal('login')}
          onLogout={() => setCurrentUser(null)}
          onHomeClick={() => moveToPage('home')}
        />
        <main className="flex-1 flex flex-col">
          {page === 'home' ? (
            <>
              <HeroSection
                onTestClick={() => moveToPage('test')}
                onBrowseClick={() => moveToPage('test')}
              />
              <SectionOrnamentDivider className="py-2" />
              <ActionSection />
              <SectionOrnamentDivider className="py-2" />
              <GuideSection />
            </>
          ) : page === 'test' ? (
            <LoveTypeSection onRegister={handleCardRegisterClick} />
          ) : (
            <CardRegisterPage
              resultType={testResultType}
              onComplete={handleRegisterComplete}
              onBackToTest={() => moveToPage('test')}
            />
          )}
        </main>
        <Footer />
      </div>

      {/* 모달 */}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal('none')}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
