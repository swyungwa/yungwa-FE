import { MountainSilhouette, SectionOrnamentDivider } from './decorations';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoveTypeSection from './components/LoveTypeSection';
import ActionSection from './components/ActionSection';
import GuideSection from './components/GuideSection';
import Footer from './components/Footer';

export default function App() {
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
        <Header />
        <main className="flex-1 flex flex-col">
          <HeroSection />
          <SectionOrnamentDivider className="py-2" />
          <LoveTypeSection />
          <SectionOrnamentDivider className="py-2" />
          <ActionSection />
          <SectionOrnamentDivider className="py-2" />
          <GuideSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
