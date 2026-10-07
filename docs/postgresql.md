# PostgreSQL setup and data migration

1. Create a PostgreSQL database (for example, ecommerce) using pgAdmin or createdb.
2. Add DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD to your existing .env using .env.example as a reference. DATABASE_URL takes precedence when set. Existing JWT, mail, Gemini and Cloudinary settings can remain.
3. Run npm install, then npm run db:setup to create missing tables. Setup never uses force or alter and does not drop existing data. Schema changes to an existing installation need a separately reviewed migration.
4. Run npm run dev. The server starts only after PostgreSQL authenticates successfully.

## Storage and API compatibility

Users, categories, coupons, products and orders have separate SQL tables with typed columns, unique constraints and foreign keys from products/orders to users. Prices use DECIMAL(18,2). Reviews, order item snapshots, shipping addresses and payment results use PostgreSQL JSONB; coupon categories use a text array. Product categories remain names to preserve the current API. IDs remain 24-character strings and responses retain _id. Category references and product IDs inside order snapshots are not SQL foreign keys. PostgreSQL prevents deleting a user referenced by products or orders.

Placing an order and deducting stock share a transaction with row locks. Cancellation and restocking also share a transaction. Sample-data import is destructive: npm run data:import replaces all shop data with the sample dataset. Use it only for a fresh development database. It is not a migration command.

## Preserve existing MongoDB data

Export each collection from MongoDB using mongoexport with --jsonArray: users.json, categories.json, coupons.json, products.json, orders.json. Put all five in one directory; use [] for an empty collection. Both normal and Extended JSON ObjectId/date values are accepted. Stop writes to the old application before the final export so the snapshot remains consistent.

Configure .env to point at an empty PostgreSQL database, run npm run db:setup, then:

    npm run data:migrate -- C:/path/to/exports

The import preserves IDs, timestamps and bcrypt password hashes. It imports all collections in one transaction, refuses a nonempty target and leaves source MongoDB untouched. Compare collection counts and verify the application before directing users to the PostgreSQL deployment. Export files contain personal data and password hashes; keep them out of Git.

## Integration checks

Use a dedicated disposable database whose name contains test:

    $env:TEST_DATABASE_URL='postgresql://postgres:password@localhost:5432/ecommerce_test'
    npm run test:postgres

The test recreates tables in that database. It checks authentication, password reset, CRUD, filtering, coupons, reviews, SQL statistics, transaction rollback, simultaneous orders and simultaneous cancellations. Email is stubbed during tests.
