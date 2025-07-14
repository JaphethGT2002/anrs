/**
 * Migration Script: Remove image column from foods table
 * This script removes the image column from the foods table as part of
 * removing image functionality from the food management system.
 */

const database = require('../config/mysql-database');

async function removeImageColumn() {
  try {
    console.log('Starting migration: Remove image column from foods table...');

    // Initialize database connection
    await database.connect();

    // Check if the image column exists
    const checkColumnSql = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'foods'
        AND COLUMN_NAME = 'image'
    `;

    const columnExists = await database.execute(checkColumnSql);
    
    if (!columnExists || columnExists.length === 0) {
      console.log('Image column does not exist in foods table. Migration not needed.');
      return;
    }

    console.log('Image column found. Proceeding with removal...');

    // Remove the image column
    const dropColumnSql = `ALTER TABLE foods DROP COLUMN image`;
    await database.execute(dropColumnSql);

    console.log('✅ Successfully removed image column from foods table');

    // Verify the column was removed
    const verifyRemoval = await database.execute(checkColumnSql);
    if (!verifyRemoval || verifyRemoval.length === 0) {
      console.log('✅ Verification successful: Image column has been removed');
    } else {
      console.log('⚠️  Warning: Image column still exists after removal attempt');
    }

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    // Close database connection
    await database.close();
  }
}

async function main() {
  try {
    await removeImageColumn();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { removeImageColumn };
