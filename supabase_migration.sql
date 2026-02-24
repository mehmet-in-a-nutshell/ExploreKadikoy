ALTER TABLE venues ADD COLUMN rating NUMERIC(3,1) DEFAULT NULL CHECK (rating >= 1.0 AND rating <= 5.0);
