import React, {createContext, useContext} from 'react';
import {useStorage} from 'services/StorageService';

type RegionalProviderProps = {
  content?: any;
  translate: (id: string) => string;
  children?: React.ReactElement;
};

export const createRegionalI18n = (locale: string, content: any) => {
  return {
    locale: locale,
    content: content,
    translate: (id: string) => {
      console.log('translate', id, content[locale][`${id}`]);
      try {
        return content[locale].RegionContent.ExposureView.Active.NL.CTA;
      } catch (e) {
        return 'not ready';
      }
    },
  };
};

export const RegionalContext = createContext<RegionalProviderProps | undefined>(undefined);

export const RegionalProvider = ({content, children}: RegionalProviderProps) => {
  const {locale: persistedLocale} = useStorage();
  const locale = persistedLocale;

  const value = createRegionalI18n(locale, content);

  return <RegionalContext.Provider value={value}>{children}</RegionalContext.Provider>;
};

export const useRegionalI18n = () => {
  return useContext(RegionalContext)!!;
};
