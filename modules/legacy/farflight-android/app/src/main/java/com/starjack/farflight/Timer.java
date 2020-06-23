package com.starjack.farflight;

/**
 * Created by edwin on 24-07-15.
 */
public class Timer {
    private long now;
    private long then;
    public long delta;

    public Timer(long interval) {
        now = System.currentTimeMillis();
        then = now;
        delta = 0;
    }

    public void advance() {
        now = System.currentTimeMillis();
        delta = now - then;
        then = now;
    }
}