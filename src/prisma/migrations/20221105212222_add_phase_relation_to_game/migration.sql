-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "Phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
