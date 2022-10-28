-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "home_score" INTEGER NOT NULL,
    "away_score" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
