import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, SRI_LANKAN_DISTRICTS, BLOOD_TYPES } from '../../app/api';
import DonorCard from '../../components/DonorCard';
import SelectField from '../../components/SelectField';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { Users, Filter, RotateCcw } from 'lucide-react';
import './donorBrowse.css';

export default function DonorBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedBloodType, setSelectedBloodType] = useState(searchParams.get('bloodType') || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'All');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state if search params change
  useEffect(() => {
    const btParam = searchParams.get('bloodType');
    const distParam = searchParams.get('district');
    if (btParam) setSelectedBloodType(btParam);
    if (distParam) setSelectedDistrict(distParam);
  }, [searchParams]);

  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getDonors(selectedBloodType, selectedDistrict);
      setDonors(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to connect to LifeDrop donor directory server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodType, selectedDistrict]);

  const handleBloodTypeChange = (e) => {
    const val = e.target.value;
    setSelectedBloodType(val);
    updateParams(val, selectedDistrict);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    updateParams(selectedBloodType, val);
  };

  const updateParams = (bt, dist) => {
    const newParams = {};
    if (bt && bt !== 'All') newParams.bloodType = bt;
    if (dist && dist !== 'All') newParams.district = dist;
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSelectedBloodType('All');
    setSelectedDistrict('All');
    setSearchParams({});
  };

  const bloodTypeOptions = [{ value: 'All', label: 'All Blood Groups' }, ...BLOOD_TYPES];
  const districtOptions = [{ value: 'All', label: 'All 25 Sri Lankan Districts' }, ...SRI_LANKAN_DISTRICTS];

  return (
    <div className="browse-page container section">
      <div className="page-header text-center">
        <div className="header-title-box">
          <span className="section-tag flex-center gap-1" style={{ justifyContent: 'center' }}>
            <Users size={14} /> Voluntary Registry
          </span>
          <h2>Browse Voluntary Blood Donors</h2>
          <p className="subtitle">
            Filter available voluntary blood donors by blood group and Sri Lankan district to find immediate matches.
          </p>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-header flex-between">
          <div className="filter-title flex-center gap-1">
            <Filter size={18} className="filter-icon" />
            <span>Search & Filter Directory</span>
          </div>
          {(selectedBloodType !== 'All' || selectedDistrict !== 'All') && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="reset-btn">
              <RotateCcw size={14} /> Reset Filters
            </Button>
          )}
        </div>

        <div className="filter-grid grid-2">
          <SelectField
            label="Filter by Blood Group"
            name="bloodType"
            value={selectedBloodType}
            onChange={handleBloodTypeChange}
            options={bloodTypeOptions}
            placeholder={null}
          />
          <SelectField
            label="Filter by District"
            name="district"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            options={districtOptions}
            placeholder={null}
          />
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Directory Server Notice"
          message={error}
          onRetry={fetchDonors}
        />
      ) : loading ? (
        <LoadingState message="Fetching registered blood donors..." />
      ) : (
        <>
          <div className="results-count-bar flex-between items-center">
            <span className="results-count-text">
              Showing <strong>{donors.length}</strong> voluntary donor{donors.length !== 1 ? 's' : ''} available
            </span>
            {(selectedBloodType !== 'All' || selectedDistrict !== 'All') && (
              <span className="active-filter-pills flex-center gap-1">
                {selectedBloodType !== 'All' && (
                  <span className="badge badge-blood">{selectedBloodType}</span>
                )}
                {selectedDistrict !== 'All' && (
                  <span className="badge badge-info">{selectedDistrict}</span>
                )}
              </span>
            )}
          </div>

          {donors.length === 0 ? (
            <EmptyState
              title="No Voluntary Donors Found"
              message={`No registered donors currently match ${selectedBloodType !== 'All' ? selectedBloodType : ''} in ${selectedDistrict !== 'All' ? selectedDistrict : 'the selected region'}.`}
              actionText="Reset Search Filters"
              onAction={handleReset}
            />
          ) : (
            <div className="donors-grid grid-3">
              {donors.map((donor) => (
                <DonorCard key={donor._id || donor.phone || donor.name} donor={donor} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
