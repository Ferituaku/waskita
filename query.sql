ALTER TABLE `hasil_kuis`
ADD COLUMN `user_id` INT NULL AFTER `id_judul`,
ADD INDEX `fk_hasil_user_idx` (`user_id` ASC),
ADD CONSTRAINT `fk_hasil_user`
  FOREIGN KEY (`user_id`)
  REFERENCES `users` (`id`)
  ON DELETE SET NULL;