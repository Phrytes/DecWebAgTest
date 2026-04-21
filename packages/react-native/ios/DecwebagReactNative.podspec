require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name         = "DecwebagReactNative"
  s.version      = package["version"]
  s.summary      = package["description"] || "decwebag react-native native bindings"
  s.license      = "MIT"
  s.author       = { "decwebag" => "hello@decwebag.local" }
  s.homepage     = "https://github.com/Phrytes/DecWebAgTest"
  s.platform     = :ios, "13.0"
  s.source       = { :git => "https://github.com/Phrytes/DecWebAgTest.git" }
  s.source_files = "*.{h,m,mm,swift}"

  # Native iOS transports (BLE, Bonjour) are not yet implemented.
  # This stub exists so `pod install` succeeds in consumer apps; the
  # corresponding JS transports will throw a clear error on iOS until
  # the native code lands.
  s.dependency "React-Core"
end
