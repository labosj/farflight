package com.starjack.farflight;

import android.app.Activity;
import android.content.Context;

import android.content.SharedPreferences;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.os.Handler;
import android.support.v4.view.MotionEventCompat;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.widget.Button;
import android.widget.TextView;

public class GameView extends SurfaceView implements
        SurfaceHolder.Callback {
    private SurfaceHolder holder;
    private GameLoopThread thread;
    private Shape shapes[] = new Shape[20];
    private GameCanvas gameCanvas;
    private GameValues values = new GameValues();
    static public int TITLE = 0, GAME = 1, GAMEOVER = 2;
    private int gameState;
    private Camera camera = new Camera();
    private int levelCounter = 0;
    private float touchX;
    private float touchY;
    private ScreenThemes levelThemes = new ScreenThemes();
    private ScreenTheme currentTheme;
    View titleControlsView;
    View gameOverControlsView;
    View gameControlsView;
    View gameInfoView;
    TextView splashMessage;
    boolean bestDistanceBeated;
    AlphaAnimation splashMessageAnimation;
    Activity activity;

    public void setActivity(Activity activity) {
        this.activity = activity;
        SharedPreferences settings = activity.getSharedPreferences("Preferences", 0);
        values.bestDistance = settings.getLong("bestDistance", 0);
    }

    public void save() {
        // We need an Editor object to make preference changes.
        // All objects are from android.context.Context
        SharedPreferences settings = activity.getSharedPreferences("Preferences", 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putLong("bestDistance", values.bestDistance);

        // Commit the edits!
        editor.commit();

    }

    public void setTitleControls(View titleControlsView) {
        this.titleControlsView = titleControlsView;
        Button startButton = (Button)titleControlsView.findViewById(R.id.startButton);
        startButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                setGameStart();
            }
        });
    }

    public void setGameOverControls(View gameOverControlsView) {
        this.gameOverControlsView = gameOverControlsView;
        Button retryButton = (Button)gameOverControlsView.findViewById(R.id.retryButton);
        retryButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                setGameStart();
            }
        });

        Button backButton = (Button)gameOverControlsView.findViewById(R.id.backButton);
        backButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                setGameTitle();
            }
        });
    }

    public void setGameControls(View gameControlsView) {
        this.gameControlsView = gameControlsView;
        Button speedUpButton = (Button)gameControlsView.findViewById(R.id.speedUpButton);
        speedUpButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                accel();
            }
        });
    }

    public void setGameInfo(View gameInfoView) {
        this.gameInfoView = gameInfoView;
        splashMessage = (TextView)gameInfoView.findViewById(R.id.splash_message_text);
        splashMessageAnimation = new AlphaAnimation(1f, 0f);
        splashMessageAnimation.setDuration(1500);
        splashMessageAnimation.setFillAfter(true);
        splashMessageAnimation.setFillBefore(true);
        setScreenTheme(levelThemes.titleTheme);
    }

    public GameView(Context context) {
        super(context);
        init();
    }

    public GameView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    public GameView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    private Handler handler = new Handler();

    private void init() {
        gameCanvas = new GameCanvas(camera);
        holder = getHolder();
        holder.addCallback(this);
        setWillNotDraw(false);
        initScreens();
        initShapes();

    }

    private void initShapes() {
        float step = 3000.0f / 20f;
        for ( int i = 0 ; i < shapes.length ; i++ ) {
            Shape shape = new Shape();
            shape.init((float) Math.floor(3000.0 - (step * i)), Color.RED);
            shapes[i] = shape;
        }
    }

    private void initScreens() {
        levelThemes.init();
    }

    private int getShapeColor () { return currentTheme.getShapeColor(); }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        boolean retry = true;
        thread.setRunning(false);
        while (retry) {
            try {
                thread.join();
                retry = false;
            } catch (InterruptedException e) {
                Log.d(getClass().getSimpleName(), "Interrupted Exception", e);
            }
        }
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        thread = new GameLoopThread(this, holder);
        thread.setRunning(true);
        thread.start();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format,
                               int width, int height) {
        gameCanvas.setSize(width, height);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        gameCanvas.setCanvas(canvas);
        gameCanvas.clearBackground();
        for (int i = 0 ; i < shapes.length; i++) {
            gameCanvas.drawShape(shapes[i]);

            if (gameState == GAME) {
                //gameCanvas.drawSplashMessage(this.drawTimer.delta);
            }
            //this.canvas.drawAchievementMessage(this.drawTimer.delta);
        }

    }

    private void accel() {
        values.currentSpeed += 10.0f;
        showSplashMessage("Speed up", 500);
    }

    public void advance(long delta) {
        float timeRatio = delta / 10.0f;
        float currentSpeed = values.currentSpeed * timeRatio;
        for (int i = 0 ; i < shapes.length; i++) {
            Shape shape = shapes[i];
            shape.advance(currentSpeed);
            if ( shape.isBehindCamera() ) {
                if ( gameState == GAME && shape.collideWithPoint(camera.position[0]) ) {
                    setGameOver();
                }
                shape.reset(getShapeColor());
            }
        }


        if ( gameState == GAME ) {
            /*
            if ( gameValues.currentSpeed <= 10.0f ) {
                if ( this.tutorialCounter == 2 && this.values.currentTime > 700.0 ) {
                    this.canvas.showSplashMessage(words[13], 1500);
                    this.tutorialCounter++;
                } else if ( this.tutorialCounter == 1 && this.values.currentTime > 400.0 ) {
                    this.canvas.showSplashMessage(words[14], 1500);
                    this.tutorialCounter++;
                } else if ( this.tutorialCounter == 0 && this.values.currentTime > 100.0 ) {
                    this.canvas.showSplashMessage(words[15], 1500);
                    this.tutorialCounter++;
                }
            }
            if ( this.values.currentTime <= 1000.0 )
                this.checkAchievements(this.speedStartAchievements);
            */
            if ( this.values.currentSpeed < 70.0 && this.values.currentTime / 300.0 > this.values.currentSpeed ) {
                //this.checkAchievements(this.calmAchievements);
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        accel();
                    }
                });
            }
            /*

            this.checkAchievements(this.currentDistanceAchievements);
            this.checkAchievements(this.currentTimeAchievements);
            this.checkAchievements(this.totalDistanceAchievements);
            this.checkAchievements(this.totalTimeAchievements);
            */
            if ( this.values.bestDistance > 0.0 && !this.bestDistanceBeated && this.values.currentDistance > this.values.bestDistance) {
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        showSplashMessage("New record", 1500);
                    }
                });

                this.bestDistanceBeated = true;
            }
            if ( (levelCounter + 1) * 200000 < values.currentDistance ) {
                levelCounter++;
                setLevelScreenTheme(levelCounter);
            }
            values.currentDistance += currentSpeed;
            values.totalDistance += currentSpeed;
            values.currentTime += timeRatio;
            values.totalTime += timeRatio;
        }
    }

    private void setGameOver() {
        gameState = 2;

        bestDistanceBeated = false;
        /*
        window.localStorage.setItem("ff-values-total-distance", this.values.totalDistance);
        window.localStorage.setItem("ff-values-total-time", this.values.totalTime);
        */
        values.totalDeaths++;
        /*
        window.localStorage.setItem("ff-values-total-deaths", this.values.totalDeaths);
        */
        if ( this.values.currentDistance > this.values.bestDistance ) {
            this.values.bestDistance = this.values.currentDistance;
            //window.localStorage.setItem("ff-values-best-score", this.values.bestDistance);
        }
        /*
        this.checkAchievements(this.gameOverAchievements);
        */
        setScreenTheme(levelThemes.gameOverTheme);
    }

    private void setGameStart() {
        titleControlsView.setVisibility(INVISIBLE);
        gameOverControlsView.setVisibility(INVISIBLE);
        gameControlsView.setVisibility(VISIBLE);
        gameInfoView.setVisibility(VISIBLE);
        gameState = GAME;
        values.currentDistance = 0;
        values.currentTime = 0;
        values.currentSpeed = 10.0f;
        values.currentLevel = -1;
        levelCounter = 0;


        final TextView distance = (TextView)gameInfoView.findViewById(R.id.distance_text);
        final TextView speed = (TextView)gameInfoView.findViewById(R.id.speed_text);
        final TextView time = (TextView)gameInfoView.findViewById(R.id.time_text);

        distance.setText(String.valueOf(values.getCurrentDistanceInMeters()));
        speed.setText(String.valueOf((int) (values.currentSpeed)));
        time.setText(String.valueOf(values.getCurrentTimeInSecs()));

        //tutorialCounter = 0;

        setLevelScreenTheme(0);
        for (
                int i = 0;
                i < shapes.length; i++)
            shapes[i].shortReset(currentTheme.getShapeColor());

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                distance.setText(String.valueOf(values.getCurrentDistanceInMeters()) + " m");
                speed.setText(String.valueOf((int) (values.currentSpeed)) + " m/s");
                time.setText(String.valueOf(values.getCurrentTimeInSecs()) + " s");


                if (gameState == GAMEOVER) {
                    gameControlsView.setVisibility(INVISIBLE);
                    gameOverControlsView.setVisibility(VISIBLE);
                    TextView t = (TextView) (activity.findViewById(R.id.gameover_resume_text));
                    t.setText(values.getResumeString());
                    handler.removeCallbacksAndMessages(null);
                } else {
                    handler.postDelayed(this, 100);
                }
            }
        }, 100);
        showSplashMessage("Start", 1500);
    }

    public void setGameTitle() {
        titleControlsView.setVisibility(VISIBLE);
        gameControlsView.setVisibility(INVISIBLE);
        gameOverControlsView.setVisibility(INVISIBLE);
        gameInfoView.setVisibility(INVISIBLE);
        gameState = TITLE;
        values.currentSpeed = 10.0f;
        setScreenTheme(levelThemes.titleTheme);
        TextView t = (TextView)activity.findViewById(R.id.max_distance_text);
        t.setText("Best distance: " + values.getBestDistanceInMeters() + " m");
    }

    private void setTextColor(int id) {
      TextView t = (TextView)activity.findViewById(id);
      t.setTextColor(currentTheme.textColor);
    }

    public void setTypeface(Typeface tf) {
        setTextTypeface(R.id.distance_text, tf);
        setTextTypeface(R.id.speed_text,tf);
        setTextTypeface(R.id.time_text,tf);
        setTextTypeface(R.id.speed_label,tf);
        setTextTypeface(R.id.distance_label,tf);
        setTextTypeface(R.id.splash_message_text,tf);
        setTextTypeface(R.id.farflight_label,tf);
        setTextTypeface(R.id.gameover_label,tf);
        setTextTypeface(R.id.time_label,tf);
        setTextTypeface(R.id.cross_hair_text,tf);
        setTextTypeface(R.id.gameover_resume_text,tf);
        setTextTypeface(R.id.gameover_crash_label,tf);
        setTextTypeface(R.id.max_distance_text,tf);
        setTextTypeface(R.id.starjack_label,tf);
        setTextTypeface(R.id.music_mordi, tf);


        setButtonTypeface(R.id.startButton,tf);
        setButtonTypeface(R.id.speedUpButton,tf);
        setButtonTypeface(R.id.backButton,tf);
        setButtonTypeface(R.id.retryButton,tf);
    }

    public void setTextTypeface(int id, Typeface tf) {
        TextView t = (TextView)activity.findViewById(id);
        t.setTypeface(tf);
    }

    public void setButtonTypeface(int id, Typeface tf) {
        Button b = (Button)activity.findViewById(id);
        b.setTypeface(tf);
    }

    private void setButtonColor(int id) {
        Button b = (Button)activity.findViewById(id);
        b.setTextColor(currentTheme.backgroundColor);

        b.getBackground().setColorFilter(currentTheme.textColor, PorterDuff.Mode.MULTIPLY);
        b.getBackground().setAlpha(255);
    }

    private void setScreenTheme(final ScreenTheme theme) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                gameCanvas.setTheme(theme);
                showSplashMessage(theme.title, 1500);
                currentTheme = theme;
                for (
                        int i = 0;
                        i < shapes.length; i++)
                    shapes[i].color = theme.getShapeColor();


                setTextColor(R.id.distance_text);
                setTextColor(R.id.speed_text);
                setTextColor(R.id.time_text);
                setTextColor(R.id.speed_label);
                setTextColor(R.id.distance_label);
                setTextColor(R.id.splash_message_text);
                setTextColor(R.id.farflight_label);
                setTextColor(R.id.gameover_label);
                setTextColor(R.id.time_label);
                setTextColor(R.id.cross_hair_text);
                setTextColor(R.id.gameover_resume_text);
                setTextColor(R.id.gameover_crash_label);
                setTextColor(R.id.max_distance_text);
                setTextColor(R.id.starjack_label);


                setButtonColor(R.id.startButton);
                setButtonColor(R.id.speedUpButton);
                setButtonColor(R.id.backButton);
                setButtonColor(R.id.retryButton);
            }
        });
    }

    private void setLevelScreenTheme(int level) {
        if ( values.currentLevel == level ) level++;
        values.currentLevel = level;
        setScreenTheme(levelThemes.elementAt(level % this.levelThemes.size()));
    }
    /*
    FF_Game.prototype.checkAchievements = function(array) {
        for ( var i = 0 ; i < array.length ; i++ )
            if ( array[i].isAchieved(this.values) ) {
                array[i].achieve();
                this.canvas.showAchievementMessage(array[i].name, 2500);
            }
    }
*/

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int action = MotionEventCompat.getActionMasked(event);
        switch (action) {

            case MotionEvent.ACTION_DOWN:
                touchX = event.getX();
                touchY = event.getY();
                return true;

            case MotionEvent.ACTION_MOVE:
                float deltaX = event.getX() - touchX;
                float deltaY = event.getY() - touchY;
                gameCanvas.moveCameraPosition(deltaX * 2.0f, deltaY * 2.0f);
                touchX = event.getX();
                touchY = event.getY();
                return true;
        }
        return super.onTouchEvent(event);
    }

    public void showSplashMessage(String message, long duration) {
        splashMessage.setText(message);
        splashMessage.setAlpha(1);
        splashMessageAnimation.setDuration(duration);
        splashMessage.startAnimation(splashMessageAnimation);
    }

    private void resetStats() {
        /*
        FF_Achievement.reset(this.currentDistanceAchievements);
        FF_Achievement.reset(this.currentTimeAchievements);
        FF_Achievement.reset(this.totalDistanceAchievements);
        FF_Achievement.reset(this.totalTimeAchievements);
        FF_Achievement.reset(this.speedStartAchievements);
        FF_Achievement.reset(this.gameOverAchievements);
        FF_Achievement.reset(this.calmAchievements);
        this.values.reset();
        */
    }

}
