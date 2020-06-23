package com.starjack.farflight;
import android.graphics.Canvas;
import android.view.SurfaceHolder;


public class GameLoopThread extends Thread {
    private SurfaceHolder holder;
    private GameView view;
    private boolean running = false;
    private Timer timer;

    public GameLoopThread(GameView view, SurfaceHolder holder) { this.holder = holder; this.view = view; this.timer = new Timer(0); }
    public void setRunning(boolean run) { running = run; }

    @Override
    public void run() {
        Canvas canvas = null;
        while (running) {
            try {
                canvas = holder.lockCanvas();
                synchronized (holder) {
                    timer.advance();
                    view.advance(timer.delta);
                    view.postInvalidate();
                }

            } finally {
                if (canvas != null) {
                    holder.unlockCanvasAndPost(canvas);
                }
            }

        }

    }

}