import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 bg-white border border-gray-200 shadow-xl p-5 rounded-xl animate-slide-up">
      <h4 className="text-lg font-semibold mb-2">We use cookies 🍪</h4>
      <p className="text-sm text-gray-600 mb-4">
        We use cookies to personalize content and analyze traffic. You can accept or decline.
      </p>
      <div className="flex space-x-3">
        <button
          onClick={() => handleConsent(true)}
          className="bg-brand-purple text-white px-4 py-2 rounded-md hover:bg-brand-tertiary-purple transition"
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent(false)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
