package com.starjack.farflight;

/**
 * Created by edwin on 24-07-15.
 */
abstract class ScreenTheme {
    public String title;
    public int backgroundColor;
    public int textColor;

    ScreenTheme(String title, int backgroundColor, int textColor) {
        this.title = title;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
    }

    abstract int getShapeColor();
}
