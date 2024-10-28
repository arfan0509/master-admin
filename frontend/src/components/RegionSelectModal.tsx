import React, { useState, useEffect } from 'react';
import { regions } from '../utils/regions'; // Import data region di sini

interface RegionSelectModalProps {
  onClose: () => void;
  onRegionSelect: (region: { id: string; name: string }) => void;
}

const RegionSelectModal: React.FC<RegionSelectModalProps> = ({
  onClose,
  onRegionSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegions, setFilteredRegions] = useState(regions);

  useEffect(() => {
    const handleSearch = () => {
      const term = searchTerm.toLowerCase();
      const results = regions.filter(region => {
        const matchesName = region.name.toLowerCase().includes(term);
        const matchesId = region.id.toLowerCase().includes(term);
        
        console.log(`Checking region: ${region.name}, matches: ${matchesName || matchesId}`);
        return matchesName || matchesId;
      });
      
      setFilteredRegions(results);
    };

    handleSearch();
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-lg shadow-lg relative z-10">
        <h2 className="text-xl font-bold mb-4">Select Region</h2>
        
        <input
          type="text"
          placeholder="Search region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        
        <ul className="max-h-60 overflow-y-auto">
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region) => (
              <li key={region.id} className="py-2">
                <button
                  onClick={() => onRegionSelect(region)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                >
                  {region.name} ({region.id})
                </button>
              </li>
            ))
          ) : (
            <li className="py-2 text-gray-500">No regions found</li>
          )}
        </ul>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionSelectModal;
