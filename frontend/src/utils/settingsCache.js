// src/utils/settingsCache.js
// A lightweight reactive cache that loads general settings and provides them app-wide.
// Supports instant reactive updates across all components when settings change.

import { useState, useEffect } from 'react';
import { getGeneralSettings } from '../services/api/apiSettingsService';

const STORAGE_KEY = 'medcare_practice_settings';

const getDefaultSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    timezone: 'America/Chicago',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12H',
    language: 'en-US'
  };
};

let _cachedSettings = getDefaultSettings();
let _loadPromise = null;

export const loadSettings = async () => {
  if (_loadPromise) return _loadPromise;

  _loadPromise = getGeneralSettings()
    .then(data => {
      if (data && typeof data === 'object') {
        _cachedSettings = { ..._cachedSettings, ...data };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_cachedSettings));
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('medcare_settings_updated', { detail: _cachedSettings }));
      }
      _loadPromise = null;
      return _cachedSettings;
    })
    .catch(() => {
      _loadPromise = null;
      return _cachedSettings;
    });

  return _loadPromise;
};

export const getCachedSettings = () => {
  if (!_cachedSettings) {
    _cachedSettings = getDefaultSettings();
  }
  return _cachedSettings;
};

// Call this after saving settings so the cache is refreshed everywhere immediately
export const refreshSettingsCache = async (newSettings = null) => {
  if (newSettings) {
    _cachedSettings = { ..._cachedSettings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_cachedSettings));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('medcare_settings_updated', { detail: _cachedSettings }));
  }
  _loadPromise = null;
  return loadSettings();
};

/**
 * Custom React hook to subscribe to settings changes reactively
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(getCachedSettings);

  useEffect(() => {
    const handler = (e) => {
      if (e?.detail) {
        setSettings(e.detail);
      } else {
        setSettings(getCachedSettings());
      }
    };
    window.addEventListener('medcare_settings_updated', handler);
    return () => window.removeEventListener('medcare_settings_updated', handler);
  }, []);

  return settings;
};

