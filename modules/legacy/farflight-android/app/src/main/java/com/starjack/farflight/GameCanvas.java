package com.starjack.farflight;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.util.Log;

/**
 * Created by edwin on 24-07-15.
 */
public class GameCanvas {

    private Canvas canvas;
    private Camera camera;
    private float offsetX;
    private float offsetY;
    private float width;
    private float height;
    private Paint shapePaint;
    private Paint textPaint;
    private float blockBuffer[] = new float[12 * 4];
    private float screenX = -1.0f;
    private float screenY = -1.0f;
    private float ratio;
    private int backgroundColor;

    public GameCanvas(Camera camera) {
        this.camera = camera;
        this.shapePaint = new Paint();
        this.textPaint = new Paint();
        shapePaint.setStrokeWidth(3);
    }

    public void setSize(int width, int height) {
        this.width = width;
        this.height = height;
        offsetX = width / 2.0f;
        offsetY = height / 2.0f;
        ratio = width / 800.0f;
        camera.setRatio(ratio);
        if ( screenX < 0.0 ) {
            screenX = offsetX;
            screenY = offsetY;
        }
    }

    public void setCanvas(Canvas canvas) {
        this.canvas = canvas;
    }

    public void setTheme(ScreenTheme theme) {
        textPaint.setColor(theme.textColor);
        backgroundColor = theme.backgroundColor;
    }

    private void drawLine(int x1, int y1, int x2, int y2, Paint painter) {
        canvas.drawLine(camera.projectedCoords[0][x1] + offsetX, camera.projectedCoords[1][y1] + offsetY,
                camera.projectedCoords[0][x2] + offsetX, camera.projectedCoords[1][y2] + offsetY, painter);
    }

    private void blockBufferWrite(int index, int x1, int y1, int x2, int y2) {
        blockBuffer[index]     = camera.projectedCoords[0][x1] + offsetX;
        blockBuffer[index + 1] = camera.projectedCoords[1][y1] + offsetY;
        blockBuffer[index + 2] = camera.projectedCoords[0][x2] + offsetX;
        blockBuffer[index + 3] = camera.projectedCoords[1][y2] + offsetY;
    }

    public void drawShape(Shape shape) {
        camera.project(shape);

        float alpha = (3000.0f - shape.dimension[1][0]) / 3000.0f;
        if (shape.dimension[1][0] > 3000.0f) alpha = 0.0f;

        shapePaint.setColor(shape.color);
        shapePaint.setAlpha((int) (alpha * 255));

        blockBufferWrite(0, 0, 2, 1, 3);
        blockBufferWrite(4, 0, 2, 0, 0);
        blockBufferWrite(8, 0, 2, 2, 2);

        blockBufferWrite(12, 2, 0, 3, 1);
        blockBufferWrite(16, 2, 0, 0, 0);
        blockBufferWrite(20, 2, 0, 2, 2);

        blockBufferWrite(24, 3, 3, 1, 3);
        blockBufferWrite(28, 3, 3, 3, 1);
        blockBufferWrite(32, 3, 3, 2, 2);

        blockBufferWrite(36, 1, 1, 1, 3);
        blockBufferWrite(40, 1, 1, 3, 1);
        blockBufferWrite(44, 1, 1, 0, 0);
        canvas.drawLines(blockBuffer, shapePaint);
    }

    public void drawText(String text, float x, float y) {
        canvas.drawText(text, transform(x), transform(y), textPaint);
    }

    public float transform(float coord) {
        return ratio * coord;
    }

    public void moveCameraPosition(float x, float y) {
        screenX += x;
        screenY += y;
        setCameraPosition();
   }

   public void setCameraPosition() {
        if      ( screenX < 0 )     screenX = 0 ;
        else if ( screenX > width ) screenX = width;
        camera.position[0] = (screenX - offsetX) / ratio;

        if      ( screenY < 0 )      screenY = 0 ;
        else if ( screenY > height ) screenY = height;
        camera.position[1] = (height - screenY) / ratio;
    }

    public void clearBackground() {
        canvas.drawColor(backgroundColor);
    }
}
