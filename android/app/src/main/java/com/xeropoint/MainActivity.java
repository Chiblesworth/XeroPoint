package com.xeropoint;

import com.facebook.react.ReactActivity;
import com.rssignaturecapture.RSSignatureCapturePackage; // <-- add this import 
import android.content.Intent; // <--- import 
import android.content.res.Configuration; // <--- import 
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity{
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
   
    @Override
    protected String getMainComponentName() {
        return "XeroPoint";
    }

     @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {

            if (!PermissionsController.verifyAppPermissions(this)) {
                PermissionsController.requestAppPermissions(this, PermissionsController.permissions, 1001);
            }
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
        };
    }
}
