import  {Sequelize} from 'sequelize'

const db = new Sequelize(
    'amwhiz',
    'root',
    'john1234',
     {
       host: '127.0.0.1',
       port:3308,
       dialect: 'mysql'
     }
   );
   export default db