import React, { useState, useEffect } from 'react';
import { countries } from '../utils/countries';

interface CountrySelectModalProps {
  onClose: () => void;
  onCountrySelect: (country: { code: string; name: string }) => void;
}

const CountrySelectModal: React.FC<CountrySelectModalProps> = ({
  onClose,
  onCountrySelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  useEffect(() => {
    const handleSearch = () => {
      const term = searchTerm.toLowerCase();
      const results = countries.filter(country => {
        const matchesName = country.name.toLowerCase().includes(term);
        const matchesCode = country.code.toLowerCase().includes(term);
        
        // Debugging log
        console.log(`Checking country: ${country.name}, matches: ${matchesName || matchesCode}`);
        return matchesName || matchesCode;
      });
      
      setFilteredCountries(results);
    };

    handleSearch(); // Call the search function directly for immediate results
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-lg shadow-lg relative z-10">
        <h2 className="text-xl font-bold mb-4">Select Country</h2>
        
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        
        <ul className="max-h-60 overflow-y-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li key={country.code} className="py-2">
                <button
                  onClick={() => onCountrySelect(country)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                >
                  {country.name} ({country.code})
                </button>
              </li>
            ))
          ) : (
            <li className="py-2 text-gray-500">No countries found</li>
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

export default CountrySelectModal;
