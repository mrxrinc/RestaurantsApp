package com.chiliveryrestaurant;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.i18nmanager.I18nUtil;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

// import com.airbnb.android.react.maps.MapsPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;

import java.util.Arrays;
import java.util.List;



public class MainApplication extends NavigationApplication {

      @Override
      public void onCreate() {
          super.onCreate();
          // FORCE LTR
          I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
          sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);
      }
  
      @Override
      protected ReactGateway createReactGateway() {
          ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
              @Override
              protected String getJSMainModuleName() {
                  return "index";
              }
          };
          return new ReactGateway(this, isDebug(), host);
      }
  
      @Override
      public boolean isDebug() {
          return BuildConfig.DEBUG;
      }
  
      protected List<ReactPackage> getPackages() {
          // Add additional packages you require here
          // No need to add RnnPackage and MainReactPackage
          return Arrays.<ReactPackage>asList(
            // new MapsPackage()
            new NetInfoPackage()
          );
      }
  
      @Override
      public List<ReactPackage> createAdditionalReactPackages() {
          return getPackages();
      }
  }



// public class MainApplication extends Application implements ReactApplication {

//   private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//     @Override
//     public boolean getUseDeveloperSupport() {
//       return BuildConfig.DEBUG;
//     }

//     @Override
//     protected List<ReactPackage> getPackages() {
//       @SuppressWarnings("UnnecessaryLocalVariable")
//       List<ReactPackage> packages = new PackageList(this).getPackages();
//       // Packages that cannot be autolinked yet can be added manually here, for example:
//       // packages.add(new MyReactNativePackage());
//       return packages;
//     }

//     @Override
//     protected String getJSMainModuleName() {
//       return "index";
//     }
//   };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, /* native exopackage */ false);
//   }
// }
