package com.starjack.farflight;
import android.graphics.Color;
import java.lang.Math;

/**
 * Created by edwin on 23-07-15.
 */
public class Shape {
    public int color = Color.GREEN;
    public float[][] dimension = {{0.0f, 0.0f}, {0.0f, 0.0f}};
    public static float height = 600.0f;

    public void advance(float distance) {
        dimension[1][0] -= distance * 0.3f;
        dimension[1][1] -= distance * 0.3f;
    }

    public boolean collideWithPoint(float x) {
        if (x < dimension[0][0]) return false;
        if (x > dimension[0][1]) return false;
        return true;
    }

    public void init ( float posZ) {
        float posX = (float)Math.floor((Math.random() * 1000.0f) - 500.0f);
        float width = (float)Math.floor((Math.random() * 20.0f) + 50.0f);
        dimension[0][0] = posX - width;
        dimension[0][1] = posX + width;
        dimension[1][0] = posZ;
        dimension[1][1] = posZ + width * 2.0f;
    }

    public void init(float posZ, int newColor) {
        init(posZ);
        color = newColor;
    }

    public boolean isBehindCamera() {
        return dimension[1][0] < 0.0;
    }

    public void shortReset(int newColor) { init(1000.0f + dimension[1][0], newColor); }

    public void reset(int newColor) {
        init(3000.0f + (dimension[1][0] % 3000), newColor);
    }

}