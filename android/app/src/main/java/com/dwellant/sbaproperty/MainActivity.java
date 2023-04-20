package com.dwellant.sbaproperty;

import com.facebook.react.ReactActivity;
import android.os.Bundle; // required for onCreate parameter

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BlockManagementUK";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
  }
}
