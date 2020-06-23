package com.starjack.farflight;

/**
 * Created by edwin on 24-07-15.
 */
public class SplashMessage {
    public String text = "";
    public float duration = 0.0f;
    public float time = 0.0f;

    public SplashMessage() {
        this.duration = 0.0f;
        this.text = "";
        this.time = 0.0f;
    }

    public void advance(float time) {
        this.time -= time;
    }

    public float getAlpha() {
        return this.time / this.duration;
    }

    public void setMessage(String text, float duration) {
        this.text = text;
        this.duration = duration;
        this.time = duration;
    }


}
