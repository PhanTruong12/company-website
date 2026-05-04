import { Link } from 'react-router-dom';
import { ROUTES } from '../shared/constants/routes';
import './HomeSectionCTA.css';

type HomeSectionCTAProps = {
  label: string;
  className?: string;
  to?: string;
};

export const HomeSectionCTA = ({ label, className, to = ROUTES.CONTACT }: HomeSectionCTAProps) => (
  <div className={className}>
    <Link to={to} className="home-section-cta-link">
      {label}
    </Link>
  </div>
);
