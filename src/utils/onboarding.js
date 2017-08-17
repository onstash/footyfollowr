import Cache from './cache';

export const checkIfOnboardingShown = () =>
  Cache.get(Cache.keys.ONBOARDING_SHOWN).catch(() => false);

export const setOnboardingShown = () =>
  Cache.set(Cache.keys.ONBOARDING_SHOWN, true).catch(console.error);
