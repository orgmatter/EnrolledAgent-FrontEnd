const { Models: { Sponsor, Resource, Article, ResourceCategory, ArticleCategory }, Helper } = require('common')


const createResource = async (resource, category) => {

    const sponsor = await Sponsor.findOneAndUpdate({ name: 'Dummy sponsor' },
        {
            name: 'Dummy sponsor', imageUrl: 'https://cpadirectory.nyc3.cdn.digitaloceanspaces.com/public/admin_uploads/resources/83/main-image/83_1607096042.jpg',
            link: 'https://google.com',

        }, { upsert: true }).exec()

    resource.sponsor = sponsor._id
    resource.category = category

    Resource.create(resource)
        .then()
}


const createCategory = async (category) => {
    const slug = Helper.generateSlug(category)
    console.log(slug)

    const cat = await ResourceCategory.findOneAndUpdate({ slug, },
        {
            name: category, slug,
        }, { upsert: true, new: true }).exec()
    console.log(cat)
    return cat
}


const createArticle = async (article) => {
    Article.create(article)
        .then(console.log)
}


module.exports = async () => {


}