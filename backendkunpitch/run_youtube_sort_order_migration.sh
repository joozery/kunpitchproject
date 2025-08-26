#!/bin/bash

# Run YouTube sort_order migration on Heroku
echo "Running YouTube sort_order migration..."

# Get Heroku database URL
DB_URL=$(heroku config:get DATABASE_URL -a kunpitch-backend-new)

if [ -z "$DB_URL" ]; then
    echo "Error: Could not get DATABASE_URL from Heroku"
    exit 1
fi

# Extract connection details from DATABASE_URL
# Format: mysql://user:password@host:port/database
DB_URL_WITHOUT_PROTOCOL=${DB_URL#mysql://}
DB_USER_PASS=${DB_URL_WITHOUT_PROTOCOL%%@*}
DB_USER=${DB_USER_PASS%%:*}
DB_PASS=${DB_USER_PASS#*:}
DB_HOST_PORT=${DB_URL_WITHOUT_PROTOCOL#*@}
DB_HOST=${DB_HOST_PORT%%:*}
DB_PORT=${DB_HOST_PORT#*:}
DB_PORT=${DB_PORT%%/*}
DB_NAME=${DB_HOST_PORT#*/}

echo "Connecting to database: $DB_NAME on $DB_HOST:$DB_PORT"

# Run the migration
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" << EOF
-- Add sort_order column
ALTER TABLE youtube_videos ADD COLUMN sort_order INT DEFAULT 0;

-- Update existing records with sort_order based on id
UPDATE youtube_videos SET sort_order = id WHERE sort_order = 0;

-- Add index for better performance
CREATE INDEX idx_youtube_videos_sort_order ON youtube_videos(sort_order);

-- Show the updated table structure
DESCRIBE youtube_videos;
EOF

echo "Migration completed successfully!"
