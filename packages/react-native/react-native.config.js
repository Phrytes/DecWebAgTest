/**
 * React Native autolinking configuration.
 *
 * Tells the RN/Expo CLI where to find this package's native Android module
 * and which ReactPackage classes to register.  Consumer apps don't need to
 * edit settings.gradle or MainApplication.kt — the CLI generates the
 * linkage during `expo prebuild` / `pod install`.
 */
module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath: [
          'import com.decwebag.mdns.MdnsPackage;',
          'import com.decwebag.ble.BlePeripheralPackage;',
        ].join('\n'),
        packageInstance: [
          'new com.decwebag.mdns.MdnsPackage()',
          'new com.decwebag.ble.BlePeripheralPackage()',
        ].join(',\n          '),
      },
      ios: {
        // Swift stubs under ios/; no native code yet.  Present so pod install
        // picks up an empty framework rather than failing outright.
        podspecPath: './ios/DecwebagReactNative.podspec',
      },
    },
  },
};
