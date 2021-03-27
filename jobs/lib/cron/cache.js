const { DB, Constants, RedisService, Models: { Agent, City,
     Resource, ArticleCategory, ResourceCategory, QuestionCategory, Config }, Validator } = require("common");
const BaseCron = require("./baseCron");

class CacheJob extends BaseCron {

    /**
    * 
    * @param {Number} page
    * @param {function} done
    */
    async runJob(page = 1, done) {
        await this.popularAgents()
        await this.ratedCities()
        await this.randomResources()

        await this.config()
        await this.articleCategory()
        await this.questionCategory()
        await this.resourceCategory()
    }

    async popularAgents() {
        const SORT = { transaction: -1, adminPremium: -1, rating: -1 }

        const count = await Agent.estimatedDocumentCount().exec();
        const random = Math.floor(Math.random() * count);

        const data = await Agent.find({ $or: [
            { isActive: { $exists: false }},
            { isActive: true }
          ]})
            .skip(random)
            .limit(4)
            .populate([
                { path: "reviewCount", select: ["rating"] },
                { path: "owner", select: ["_id", "firstName"] },
            ])
            .sort(SORT)
            .lean()
            // .sort({ rating: -1 })
            .exec();
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.POPULAR_AGENTS, JSON.stringify(data))

    }

    async ratedCities() {
        const data = await City.find({})
            .limit(64)
            .sort({ count: -1 })
            .lean()
            .exec()
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.RATED_CITIES, JSON.stringify(data))

    }

    async config() {
        const data = await Config.find({}, { _id: 0, __v: 0, slug: 0, createdAt: 0, updatedAt: 0 })
            .lean()
            .exec()
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.CONFIG, JSON.stringify(data))

    }

    async articleCategory() {
        const data = await ArticleCategory.find({})
            .sort({ priority: -1 })
            .lean()
            .exec()
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.ARTICLE_CATEGORY, JSON.stringify(data))

    }
    async questionCategory() {
        const data = await QuestionCategory.find({})
            .sort({ priority: -1 })
            .lean()
            .exec()
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.QUESTION_CATEGORY, JSON.stringify(data))

    }
    async resourceCategory() {
        const data = await ResourceCategory.find({})
            .sort({ priority: -1 })
            .lean()
            .exec()
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.RESOURCE_CATEGORY, JSON.stringify(data))

    }

    async randomResources() {
        const limit = 10
        const count = await Resource.estimatedDocumentCount().exec()
        let skip = Math.floor(Math.random() * count)

        if (count < limit - skip) skip = 0


        const data = await Resource.find({},)
            .skip(skip)
            .limit(limit)
            .populate(['sponsor', 'category'])
            .lean()
            .exec()
        if (data)
            await RedisService.save(Constants.CACHE_KEYS.RANDOM_RESOURCES, JSON.stringify(data))

    }




}

module.exports = new CacheJob()