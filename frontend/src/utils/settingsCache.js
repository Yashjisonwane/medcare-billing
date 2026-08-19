// src/utils/settingsCache.js
// A lightweight cache that loads general settings once and provides them app-wide.
// This avoids prop-drilling settings into every utility function like formatCurrency.

import { getGeneralSettings } from '../services/api/apiSettingsService';

let _cachedSettings = null;
let _loadPromise = null;

export const loadSettings = async () => {
  if (_cachedSettings) return _cachedSettings;
  if (_loadPromise) return _loadPromise;

  _loadPromise = getGeneralSettings()
    .then(data => {
      _cachedSettings = data || {};
      _loadPromise = null;
      return _cachedSettings;
    })
    .catch(() => {
      _loadPromise = null;
      _cachedSettings = {};
      return _cachedSettings;
    });

  return _loadPromise;
};

export const getCachedSettings = () => _cachedSettings || {};

// Call this after saving settings so the cache is refreshed everywhere
export const refreshSettingsCache = async () => {
  _cachedSettings = null;
  _loadPromise = null;
  return loadSettings();
};
