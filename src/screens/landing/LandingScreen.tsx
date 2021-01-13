import React, {useCallback} from 'react';
import {Image, StyleSheet, NativeModules, Platform} from 'react-native';
import {useStorage} from 'services/StorageService';
import {Box, Button, Icon} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Metric} from 'services/MetricsService/Metric';
import {DefaultMetricsService} from 'services/MetricsService/MetricsService';
import {DefaultMetricsJsonSerializer} from 'services/MetricsService/MetricsJsonSerializer';

export const LandingScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const {setLocale} = useStorage();

  // TEST CODE; WILL REMOVE
  function createFirstMetric(): Metric {
    return new Metric(new Date().getTime(), `${Metric.name}`, 'QC', [['isItTrue', 'true']]);
  }
  function createSecondMetric(): Metric {
    return new Metric(new Date().getTime(), `${Metric.name}`, 'ON', [
      ['isHeRight', 'false'],
      ['howMuchTime', '15 minutes'],
    ]);
  }
  const metricsJsonSerializer = new DefaultMetricsJsonSerializer('0.0.7', 'WindowsPhone');
  const metricsService = DefaultMetricsService.initialize(metricsJsonSerializer);
  metricsService.publishMetric(createFirstMetric());
  metricsService.publishMetrics([createSecondMetric(), createFirstMetric()]);
  metricsService.sendMetrics();

  const isENFrameworkSupported = async () => {
    if (Platform.OS === 'ios') {
      try {
        await NativeModules.ExposureNotification.isExposureNotificationsFrameworkSupported();
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return true;
    }
  };

  const toggle = useCallback(
    (newLocale: 'en' | 'fr') => async () => {
      setLocale(newLocale);

      let nextRoute = 'OnboardingNavigator';

      const isSupported = await isENFrameworkSupported();

      if (isSupported === false) {
        nextRoute = 'FrameworkUnavailableScreen';
      }

      navigation.reset({
        index: -1,
        routes: [{name: nextRoute}],
      });
    },
    [navigation, setLocale],
  );
  return (
    <SafeAreaView style={styles.flex}>
      <Box flex={1} marginBottom="s" style={{...styles.imageBackround}}>
        <Box flex={1} justifyContent="flex-start" alignItems="center" paddingTop="s">
          <Image
            resizeMode="contain"
            style={{...styles.imagePad}}
            accessible
            accessibilityLabel={i18n.translate('Landing.AltText')}
            source={require('assets/landingintro.png')}
          />
        </Box>
        <Box style={styles.overlay} paddingVertical="m">
          <Box paddingHorizontal="m" marginTop="s" marginBottom="s">
            <Button testID="enButton" onPress={toggle('en')} text={i18n.translate('Landing.En')} variant="thinFlat" />
          </Box>
          <Box paddingHorizontal="m">
            <Button testID="frButton" onPress={toggle('fr')} text={i18n.translate('Landing.Fr')} variant="thinFlat" />
          </Box>
          <Box
            accessible
            accessibilityLabel={i18n.translate('Landing.CanadaAltText')}
            alignSelf="center"
            marginVertical="m"
          >
            <Icon height={32} width={135} name="canada-logo" />
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -50,
  },
  imageBackround: {
    backgroundColor: '#EEEEEE',
    paddingTop: 50,
  },
  imagePad: {flex: 1, width: '100%'},
  overlay: {
    backgroundColor: '#FFFFFF',
  },
});
