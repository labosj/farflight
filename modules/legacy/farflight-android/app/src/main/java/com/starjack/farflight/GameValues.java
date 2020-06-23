package com.starjack.farflight;

/**
 * Created by edwin on 24-07-15.
 */
public class GameValues {
    public long bestDistance = 0;//parseInt(window.localStorage.getItem("ff-values-best-score")) || 0;
    public long currentDistance = 0;
    public float currentTime = 0.0f;
    public float currentSpeed = 10.0f;
    public long currentLevel = 0;
    public float totalDistance = 0.0f;//parseFloat(window.localStorage.getItem("ff-values-total-distance")) || 0;
    public float totalTime = 0.0f;//parseFloat(window.localStorage.getItem("ff-values-total-time")) || 0;
    public long totalDeaths = 0;//parseInt(window.localStorage.getItem("ff-values-total-deaths")) || 0;


    public int getCurrentTimeInSecs() {
        return (int)(currentTime / 100.0f);
    }

    public long getCurrentDistanceInMeters() {
        return currentDistance / 100;
    }

    public long getBestDistanceInMeters() {
        return bestDistance / 100;
    }

    public String getResumeString() { return String.valueOf(getCurrentDistanceInMeters())
            + " meters in " + String.valueOf(getCurrentTimeInSecs()) + " seconds"; }
}
