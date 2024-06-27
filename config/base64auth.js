
const user = 'SADQI2';
const pass = '@piAcess02024';

const token = Buffer.from(`${user}:${pass}`, 'utf-8').toString('base64');

const auth = {
  headers: {
    'Authorization': `Basic ${token}`,
    'apiKey': '6171e5dee4b14866b92f662384190af5'
  }
}

module.exports = auth;
