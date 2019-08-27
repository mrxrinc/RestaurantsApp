package com.chilivery.chiliveryrestaurant;

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

import com.airbnb.android.react.maps.MapsPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

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
            new MapsPackage(),
            new NetInfoPackage(),
            new LinearGradientPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage()
          );
      }
  
      @Override
      public List<ReactPackage> createAdditionalReactPackages() {
          return getPackages();
      }
  }
