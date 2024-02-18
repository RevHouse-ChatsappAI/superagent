
'use client'
import React, { useEffect, useState } from 'react'
import { CardPrice } from './components/CardPrice'
import Stripe from 'stripe';
import { pricingFeatures } from '@/config/pricing';
import { Profile } from '@/types/profile';
import { CardScheduleLink } from './components/CardScheduleLink';


async function loadPrices() {
  const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is undefined.');
  }
  //Production
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-08-16'
  });
  const prices = await stripe.prices.list({
    product: 'prod_PQlBLHxNozr0nS'
  });
  const sortedPrices = prices.data.sort((a, b) => {
    const unitAmountA = a.unit_amount || 0;
    const unitAmountB = b.unit_amount || 0;
    return unitAmountA - unitAmountB;
  });

  return sortedPrices;
}


export const DataTable = ({profile}: {profile: Profile}) => {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const loadedPrices = await loadPrices();
        setPrices(loadedPrices);
      } catch (error) {
        console.error("Error loading prices:", error);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className='space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10'>
      {
        prices.map(price => (
          <CardPrice
            key={price.id}
            priceId={price.id}
            title={price.nickname || ''}
            nickname={price.nickname || ''}
            description={getPriceDescription(price)}
            price={price.unit_amount ? `$${price.unit_amount / 100}` : 'Free'}
            features={getFeatures(price)}
            buttonLink='/signup'
            profile={profile}
          />
        ))
      }
      <CardScheduleLink/>
    </div>
  );
};

function getPriceDescription(price: any): string {
  if (price.unit_amount === 0) {
    return 'Explora nuestros servicios con el Plan Gratis, ¡perfecto para empezar!';
  } else if (price.unit_amount < 78900) {
    return 'Desbloquea más características con el Plan Estándar, ideal para negocios en crecimiento!';
  } else {
    return '¡Experimenta la suite completa con nuestro Plan Premium, diseñado para escalar!';
  }
}

function getFeatures(price: any): string[] {
  if (price.unit_amount === 0) {
    return pricingFeatures.free;
  } else if (price.unit_amount < 78900) {
    return pricingFeatures.standard;
  } else {
    return pricingFeatures.premiun;
  }
}
