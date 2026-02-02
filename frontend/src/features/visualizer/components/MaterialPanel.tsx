// features/visualizer/components/MaterialPanel.tsx - Material selection panel
import { useVisualStore } from '../store/visualStore';
import type { Granite, SurfaceType } from '../../../shared/types';
import graniteCatalog from '../materials/graniteCatalog.json';
import './MaterialPanel.css';

const SURFACE_LABELS: Record<NonNullable<SurfaceType>, string> = {
  COUNTERTOP: 'Mặt Bàn',
  BACKSPLASH: 'Ốp Lưng',
  ISLAND: 'Đảo Bếp',
} as const;

const granites = graniteCatalog as Granite[];

export const MaterialPanel = () => {
  const { activeSurface, selectedGranite, setSelectedGranite } = useVisualStore();

  const handleGraniteClick = (granite: Granite) => {
    setSelectedGranite(granite);
  };

  return (
    <div className="material-panel">
      <div className="material-panel-header">
        <h3>Chọn Đá Granite</h3>
        {activeSurface && (
          <p className="active-surface">
            Bề mặt: <strong>{SURFACE_LABELS[activeSurface] || activeSurface}</strong>
          </p>
        )}
        {!activeSurface && (
          <p className="hint">Nhấp vào bề mặt trong mô hình 3D để chọn</p>
        )}
      </div>

      <div className="material-grid">
        {granites.map((granite) => (
          <button
            key={granite.id}
            className={`material-item ${
              selectedGranite?.id === granite.id ? 'selected' : ''
            }`}
            onClick={() => handleGraniteClick(granite)}
            disabled={!activeSurface}
            title={granite.name}
          >
            <div className="material-thumb">
              {/* Placeholder for thumbnail - replace with actual image */}
              <div className="material-thumb-placeholder">
                {granite.name.charAt(0)}
              </div>
              {/* Uncomment when thumbnails are available:
              <img src={granite.thumb} alt={granite.name} />
              */}
            </div>
            <span className="material-name">{granite.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
