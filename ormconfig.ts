import { DataSource, DataSourceOptions } from "typeorm"

const dataSoucreOption: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "bounty-ticket",
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migration/*{.ts,.js}'],
}

const dataSoucre = new DataSource(dataSoucreOption)

export { dataSoucre, dataSoucreOption } 