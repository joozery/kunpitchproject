-- Migration: Add sort_order column to youtube_videos table
-- Date: 2024-12-19

-- Add sort_order column
ALTER TABLE youtube_videos ADD COLUMN sort_order INT DEFAULT 0;

-- Update existing records with sort_order based on created_at
UPDATE youtube_videos SET sort_order = id WHERE sort_order = 0;

-- Add index for better performance
CREATE INDEX idx_youtube_videos_sort_order ON youtube_videos(sort_order);
