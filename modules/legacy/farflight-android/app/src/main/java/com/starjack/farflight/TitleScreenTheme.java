package com.starjack.farflight;

import android.graphics.Color;
import android.util.Log;

/**
 * Created by edwin on 24-07-15.
 */
public class TitleScreenTheme extends ScreenTheme{
    float comp[] = {0.0f, 1.0f, 1.0f};

    TitleScreenTheme(String title, int backgroundColor, int textColor) {
        super(title, backgroundColor, textColor);
    }

    final int getShapeColor() {
        comp[0] = (float)(Math.random() * 360.0);
        return Color.HSVToColor(comp);
    }
}
