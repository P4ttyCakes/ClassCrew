export default {
  expo: {
    name: 'ClassCrew',
    slug: 'classcrew',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.classcrew.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.classcrew.app'
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro'
    }
  }
}; 