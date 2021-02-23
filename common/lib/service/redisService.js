const redis = require("redis")
const client = redis.createClient();

class RedisService {
    /**
     * @param  {string} key
     * @param  {object} value
     */
    static save(key, value) {
        return new Promise((resolve, reject) => {
            client.set(key, value, (err, res) => {
                // console.log(err, res)
                if (err) return reject(err)
                resolve(res)
            })
        });
    }

    /**
     * @param  {string} key
     */
    static get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, res) => {
                // console.log(err, res)
                if (err) return reject(err)
                resolve(res)
            })
        });
    }

}

module.exports =  RedisService