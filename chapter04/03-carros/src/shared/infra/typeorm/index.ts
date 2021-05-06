import { Connection, createConnection, getConnectionOptions } from "typeorm";

// interface IOptions {
//   host: string;
// }

// getConnectionOptions().then((options) => {
//   const newOptions = options as IOptions;
//   // Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
//   newOptions.host = "database_ignite_carros";
//   createConnection({
//     ...options,
//   });
// });

export default async (host = "database_ignite_carros"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host,
    })
  );
};
