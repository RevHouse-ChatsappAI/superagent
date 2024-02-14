'use client'
import React from 'react'

interface ButtonPriceProps {
  title: string;
  priceId: string;
  profile: any;
  nickname: string;
}

export const ButtonPrice: React.FC<ButtonPriceProps> = ({ title, priceId, profile, nickname }) => {
  const handleClick = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId, customer_id: profile.stripe_customer_id, user_id: profile.user_id, api_key: profile.api_key, nickname: nickname }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      window.open(data.url, '_blank');
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <button
      className="focus:ring-primary-200 dark:focus:ring-primary-900 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-blue-500 focus:ring-4 dark:text-white"
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

