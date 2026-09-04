import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, UserPlus, FilePlus, Search, AlertTriangle, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span> Voluntary Blood Donation Platform
          </div>
          <h1 className="hero-title">
            Direct Blood Connection Across <span className="highlight-text">Sri Lankan Districts</span>
          </h1>
          <p className="hero-description">
            Connecting voluntary blood donors with urgent patient requests. LifeDrop addresses regional supply gaps in areas with lower donation participation to save lives faster.
          </p>

          <div className="hero-actions">
            <Link to="/register">
              <Button variant="primary">
                <UserPlus size={18} /> Register as Donor
              </Button>
            </Link>
            <Link to="/request">
              <Button variant="secondary">
                <FilePlus size={18} /> Request Blood
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline">
                <Search size={18} /> Browse Donors
              </Button>
            </Link>
          </div>

          <div className="hero-stats-bar glass-panel">
            <div className="stat-item">
              <span className="stat-number">466,061</span>
              <span className="stat-label">2023 National Units Collected</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Voluntary System (Since 2014)</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">1.5%</span>
              <span className="stat-label">National Participation (WHO Target: 2%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Need Districts UI Banner */}
      <section className="critical-districts-section section">
        <div className="container">
          <div className="critical-card">
            <div className="critical-header">
              <AlertTriangle className="critical-icon" size={26} />
              <div>
                <h3 className="critical-title">Critical Need Districts Feature</h3>
                <span className="critical-subtitle">Addressing Regional Donation Imbalance</span>
              </div>
            </div>
            
            <p className="critical-body">
              <strong>Jaffna</strong> and <strong>Kilinochchi</strong> are highlighted because regional donation participation can vary significantly across Sri Lanka. In 2023, the Jaffna cluster collected 14,013 units, while Kilinochchi collected only 1,332 units. LifeDrop helps surface local donor/request information directly rather than relying on scattered social-media posts.
            </p>

            <div className="critical-tags">
              <span className="district-tag priority-tag"><MapPin size={14} /> Jaffna Cluster (14,013 units)</span>
              <span className="district-tag priority-tag"><MapPin size={14} /> Kilinochchi District (1,332 units)</span>
              <span className="district-tag"><MapPin size={14} /> Seasonal Gap: New Year Dips</span>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Context & Relevance Section */}
      <section className="problem-section section">
        <div className="container">
          <div className="section-title-box text-center">
            <span className="section-tag">Context & Relevance</span>
            <h2>Why LifeDrop? The Sri Lankan Problem</h2>
          </div>

          <div className="problem-grid grid-2">
            <div className="problem-card card-adequate">
              <div className="card-header-icon">
                <ShieldCheck size={28} className="icon-green" />
              </div>
              <h3>National Supply on Paper</h3>
              <p>
                Sri Lanka's overall blood supply is <strong>adequate on paper</strong> (466,061 units collected in 2023 vs. ~450,000 units demand, operating a 100% voluntary system since 2014).
              </p>
            </div>

            <div className="problem-card card-gap">
              <div className="card-header-icon">
                <AlertTriangle size={28} className="icon-red" />
              </div>
              <h3>Regional & Seasonal Gaps</h3>
              <p>
                Severe regional imbalances persist. The Jaffna cluster collected only 14,013 units (Kilinochchi just 1,332), national participation is ~1.5% vs. WHO's recommended 2%, and donations dip sharply during the Sinhala/Tamil New Year.
              </p>
            </div>
          </div>

          {/* Affected Users Highlight Box */}
          <div className="affected-users-banner">
            <div className="affected-badge">Primary Affected Users</div>
            <h3>Who suffers from this coordination gap?</h3>
            <p className="affected-text">
              <strong>Patients and families in low-donation districts who currently rely on scattered WhatsApp and Facebook posts to find donors urgently.</strong>
            </p>
            <p className="affected-solution">
              LifeDrop replaces unstructured social media posts with an organized, searchable donor-request network filtered by district and urgency.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="features-section section">
        <div className="container">
          <div className="section-title-box text-center">
            <span className="section-tag">Integrated Solution</span>
            <h2>Core LifeDrop Features</h2>
          </div>

          <div className="feature-cards-grid grid-4">
            <div className="feature-box">
              <div className="feature-icon-wrapper"><UserPlus size={24} /></div>
              <h4>Donor Registration</h4>
              <p>Register as a voluntary donor with district location, blood group, and verified Sri Lankan contact.</p>
              <Link to="/register" className="feature-link">Register <ArrowRight size={14} /></Link>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper"><FilePlus size={24} /></div>
              <h4>Blood Request Submission</h4>
              <p>Post urgent patient blood requirements specifying hospital ward, district, and urgency level.</p>
              <Link to="/request" className="feature-link">Post Request <ArrowRight size={14} /></Link>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper"><Search size={24} /></div>
              <h4>Browse Donors</h4>
              <p>Filter registered voluntary donors by district and blood group with instant contact details.</p>
              <Link to="/browse" className="feature-link">Browse <ArrowRight size={14} /></Link>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper"><Heart size={24} /></div>
              <h4>Active Requests</h4>
              <p>View live patient requests automatically sorted by priority (Critical &gt; Urgent &gt; Normal).</p>
              <Link to="/requests" className="feature-link">View Active <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
