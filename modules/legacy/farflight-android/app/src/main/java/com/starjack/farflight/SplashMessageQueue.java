package com.starjack.farflight;

import java.util.LinkedList;

/**
 * Created by edwin on 24-07-15.
 */
public class SplashMessageQueue extends LinkedList<SplashMessage> {

    public LinkedList<SplashMessage> messages;

    public SplashMessageQueue() {
        this.messages = new LinkedList<SplashMessage>();
    }

    public void push(String text, float duration) {
        SplashMessage message = new SplashMessage();
        message.setMessage(text, duration);
        messages.push(message);
    }

    public void advance(float time) {
        if ( messages.isEmpty() ) return;
        SplashMessage message = messages.getFirst();
        message.advance(time);
        if (message.time <= 0)
            messages.remove();
    }
}