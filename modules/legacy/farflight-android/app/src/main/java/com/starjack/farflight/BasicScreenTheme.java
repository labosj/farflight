package com.starjack.farflight;

/**
 * Created by edwin on 24-07-15.
 */
public class BasicScreenTheme extends ScreenTheme {
    public int shapeColor;

    BasicScreenTheme(String title, int backgroundColor, int textColor, int shapeColor) {
        super(title, backgroundColor, textColor);
        this.shapeColor = shapeColor;
    }

    final int getShapeColor() { return shapeColor; }
}
