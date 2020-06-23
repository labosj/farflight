package com.starjack.farflight;

import android.graphics.Color;

import java.util.Vector;

/**
 * Created by edwin on 24-07-15.
 */
public class ScreenThemes extends Vector<ScreenTheme> {

    ScreenTheme titleTheme;
    ScreenTheme gameOverTheme;

    static BasicScreenTheme c(String name, String bg, String sh, String t){
        return new BasicScreenTheme(name, Color.parseColor(bg), Color.parseColor(sh), Color.parseColor(t));
    }
    static BasicScreenTheme c(String name, String bg, String sh) {
        return c(name, bg, sh, sh);
    }

    public void init() {
        titleTheme = new TitleScreenTheme("", Color.parseColor("#000000") , Color.parseColor("#FFFF00"));
        gameOverTheme = new TitleScreenTheme("", Color.parseColor("#770000") , Color.parseColor("#FFFF00"));

        add(c("Forest", "#003300" , "#FFFF00", "#FF8800"));
        add(c("Sea", "#000022", "#FFFF00", "#5555FF"));
        add(c("Snow", "#FFFFFF" , "#000000", "#005500"));
        add(c("Night", "#000033" , "#FFFF00"));
        add(c("Rock", "#222222" , "#FFFF00", "#888888"));
        add(c("Matrix", "#000000", "#00FF00", "#008800"));
        add(c("Volcano", "#550000", "#FFFF00"));
        add(c("Halloween", "#000000" , "#00AA00", "#FF5500"));
        add(c("Sky", "#0000FF" , "#FFFF00", "#FFFFFF"));
        add(c("Hell", "#FF0000" , "#FFFF00", "#000000"));
        add(c("Beach", "#33EEEE" , "#FFFF00", "#FF9933"));
        add(c("Superman", "#0000FF" , "#FFFF00", "#FF0000"));
        add(c("Hulk", "#00AA00", "#00FF00", "#000000"));
        add(c("Spiderman", "#FF0000" , "#000000", "#0000FF"));
        add(c("Honey", "#FFCC33" , "#FFFF00", "#CC9933"));
        add(c("Transylvania", "#FF0000" , "#000000", "#0000FF"));
    }
}
