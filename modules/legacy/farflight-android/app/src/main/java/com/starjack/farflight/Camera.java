package com.starjack.farflight;

/**
 * Created by edwin on 23-07-15.
 */
public class Camera {
    private float far = 500.0f;
    public float[] position = {0.0f, 100.0f};
    public float[][] projectedCoords = {{0.0f, 0.0f, 0.0f, 0.0f}, {0.0f, 0.0f, 0.0f, 0.0f}};

    public void project(Shape shape) {
        projectedCoords[0][0] = projectedCoords[0][1] = shape.dimension[0][0] - position[0];
        projectedCoords[0][2] = projectedCoords[0][3] = shape.dimension[0][1] - position[0];

        projectedCoords[1][0] = projectedCoords[1][1] = -position[1];
        projectedCoords[1][2] = projectedCoords[1][3] = shape.height - position[1];

        float scalar = far / shape.dimension[1][0];

        projectedCoords[0][0] *=  scalar;
        projectedCoords[0][2] *=  scalar;
        projectedCoords[1][0] *= -scalar;
        projectedCoords[1][2] *= -scalar;

        scalar = far / shape.dimension[1][1];

        projectedCoords[0][1] *=  scalar;
        projectedCoords[0][3] *=  scalar;
        projectedCoords[1][1] *= -scalar;
        projectedCoords[1][3] *= -scalar;
    }

    public void setRatio(float ratio) {
        far = 500.0f * ratio;
    }

}
