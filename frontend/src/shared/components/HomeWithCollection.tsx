// shared/components/HomeWithCollection.tsx - Home page with collection sections
import Home from '../../pages/Home';
import CollectionSection from '../../components/CollectionSection';
import GallerySection from '../../components/GallerySection';
import UsageSection from '../../components/UsageSection';

export const HomeWithCollection = () => (
  <>
    <Home />
    <div className="collection-heading">
      <h2>Bộ Sưu Tập Đá</h2>
      <div className="collection-heading-line" />
    </div>
    <CollectionSection />
    <GallerySection />
    <UsageSection />
  </>
);
