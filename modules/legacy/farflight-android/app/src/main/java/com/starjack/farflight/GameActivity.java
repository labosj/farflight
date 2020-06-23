package com.starjack.farflight;

import android.app.Activity;
import android.graphics.Typeface;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.TextView;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;


public class GameActivity extends Activity {

    public MediaPlayer mPlayer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_game);


        final View titleControlsView = findViewById(R.id.title_controls_view);
        final View gameOverControlsView = findViewById(R.id.gameover_controls_view);
        final View gameControlsView = findViewById(R.id.game_controls_view);
        final View gameInfoView = findViewById(R.id.game_info_view);
        final GameView contentView = (GameView)findViewById(R.id.fullscreen_content);

        AdView mAdView = (AdView) findViewById(R.id.adView);
        AdRequest adRequest = new AdRequest.Builder().build();
        mAdView.loadAd(adRequest);


        contentView.setActivity(this);
        contentView.setTitleControls(titleControlsView);
        contentView.setGameOverControls(gameOverControlsView);
        contentView.setGameControls(gameControlsView);
        contentView.setGameInfo(gameInfoView);

        titleControlsView.setVisibility(View.VISIBLE);
        gameOverControlsView.setVisibility(View.INVISIBLE);
        gameControlsView.setVisibility(View.INVISIBLE);
        gameInfoView.setVisibility(View.INVISIBLE);

        contentView.setGameTitle();


        Typeface tf = Typeface.createFromAsset(getAssets(), "fonts/joystix.ttf");
        contentView.setTypeface(tf);


        int resId = getResources().getIdentifier("raw/unnamed_master_6", "raw", getPackageName());
        mPlayer =  MediaPlayer.create(this, resId);
        mPlayer.setLooping(true);
    }

    @Override
    protected void onStop(){
        super.onStop();
        final GameView contentView = (GameView)findViewById(R.id.fullscreen_content);
        contentView.save();
        mPlayer.pause();

    }

    protected void onResume() {
        super.onResume();
        mPlayer.start();
    }



}
