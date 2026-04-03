-- Migration: Add IsDeleted column to menu_items table
-- Run this SQL in your MySQL database

ALTER TABLE menu_items 
ADD COLUMN IsDeleted BOOLEAN NOT NULL DEFAULT FALSE;
