import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

/**
 * Member C Feature Component:
 * Calculates indicative eligibility based on last donation date (>= 4 months rule)
 */
export default function EligibilityBadge({ lastDonationDate }) {
  if (!lastDonationDate) {
    return (
      <span className="badge badge-eligible">
        <CheckCircle2 size={14} /> Indicatively eligible
      </span>
    );
  }

  const donation = new Date(lastDonationDate);
  const now = new Date();
  
  // Calculate months difference
  const diffTime = Math.abs(now - donation);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthsAgo = Math.floor(diffDays / 30.4375);

  const isEligible = monthsAgo >= 4;

  return (
    <div className="eligibility-container">
      <span className={`badge ${isEligible ? 'badge-eligible' : 'badge-ineligible'}`}>
        {isEligible ? (
          <>
            <CheckCircle2 size={14} /> Indicatively eligible ({monthsAgo} mos since last donation)
          </>
        ) : (
          <>
            <Clock size={14} /> Not currently eligible ({monthsAgo} mos since last donation)
          </>
        )}
      </span>
      <div className="disclaimer-banner">
        Indicative only, not medical advice. Final eligibility should be determined by qualified medical/blood-bank personnel.
      </div>
    </div>
  );
}
