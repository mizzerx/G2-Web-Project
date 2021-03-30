const { connect } = require('mongoose');

module.exports = {
  createConnection: async () => {
    const uri = process.env.MONGO_STRING;

    try {
      const conn = await connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });

      console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  },
};
