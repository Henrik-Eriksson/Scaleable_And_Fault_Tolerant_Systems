const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../models/mongo_api/server/.env') });
const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("DB");
  });

  afterAll(async () => {
    const users = db.collection('users');
    await users.deleteOne({_id: '666'}); // Remove the user after test   
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {_id: '666', name: 'Poop'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: '666'});
    expect(insertedUser).toEqual(mockUser);
  });
});