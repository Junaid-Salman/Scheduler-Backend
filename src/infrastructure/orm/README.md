# ORM layer (TypeORM)

This folder is the **schema / persistence** layer. It is the TypeORM equivalent of a single Prisma `schema.prisma` file.

## Where to define “tables” (entities)

| Prisma              | TypeORM (this project) |
|---------------------|-------------------------|
| Single `schema.prisma` with all models | **`entities/`** – one file per table, all registered in **`entities/index.ts`** |

- **`entities/`** – Define each collection/table as a separate entity file (e.g. `user.orm-entity.ts`, `shift.orm-entity.ts`).
- **`entities/index.ts`** – Central entry point: imports all entities and exports the **`ormEntities`** array. This is the single place that lists “all schema tables”, similar to opening `schema.prisma` in Prisma.
- **`repositories/`** – Repository implementations that use these entities and map to domain models.

## Adding a new table

1. Create **`entities/<name>.orm-entity.ts`** with your `@Entity()` class.
2. In **`entities/index.ts`**:
   - Add: `import { YourOrmEntity } from './<name>.orm-entity';`
   - Export it: `export { YourOrmEntity } from './<name>.orm-entity';`
   - Add it to the array: `export const ormEntities = [..., YourOrmEntity];`
3. Create a repository in **`repositories/`** and register it in **`repositories.module.ts`** (domain interface, token, and provider).

TypeORM does not use a single schema DSL like Prisma; **entities in `entities/` + `entities/index.ts`** together play the role of your schema file.
