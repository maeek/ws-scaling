import chalk from 'chalk';
import { httpServer } from './httpServer';
import './socket';

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(chalk.green.bold('APP STARTED ON PORT:'), chalk.greenBright(PORT));
});
