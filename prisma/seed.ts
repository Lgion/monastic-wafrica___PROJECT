import { prisma } from '@/lib/prisma'

const monasteries = [
  {
    name: 'Monastère de Kokrobite',
    location: 'Kokrobite, Abidjan',
    description: 'Monastère bénédictin fondé en 1965, spécialisé dans la production de miel et de confitures artisanales.',
    phone: '+225 07 12 34 56',
    email: 'kokrobite@monastic.ci',
  },
  {
    name: 'Abbaye de Bouaké',
    location: 'Bouaké, Côte d\'Ivoire',
    description: 'Abbaye cistercienne réputée pour ses tisanes médicinales et ses cosmétiques naturels.',
    phone: '+225 05 67 89 01',
    email: 'bouake@monastic.ci',
  },
  {
    name: 'Monastère Sainte Marie',
    location: 'Cocody, Abidjan',
    description: 'Monastère dominicain produisant des épices et des miels de haute qualité.',
    phone: '+225 01 23 45 67',
    email: 'ste-marie@monastic.ci',
  },
]

const products = [
  {
    name: 'Miel Sauvage de la Forêt',
    description: 'Miel pur et naturel récolté dans les forêts de la région d\'Abidjan. Saveur délicate et notes florales.',
    price: 5000,
    stock: 25,
    category: 'MIEL',
    images: '/placeholder.jpg',
    featured: true,
    monasteryIndex: 0,
  },
  {
    name: 'Confiture de Mangue',
    description: 'Confiture artisanale préparée avec des mangues bio mûries au soleil. Sans conservateurs.',
    price: 3500,
    stock: 40,
    category: 'CONFITURE',
    images: '/placeholder.jpg',
    featured: true,
    monasteryIndex: 0,
  },
  {
    name: 'Tisane Digestive',
    description: 'Mélange de plantes médicinales pour faciliter la digestion. Menthe, gingembre, citronnelle.',
    price: 2500,
    stock: 60,
    category: 'TISANE',
    images: '/placeholder.jpg',
    featured: true,
    monasteryIndex: 1,
  },
  {
    name: 'Baume à Lèvres au Miel',
    description: 'Baume nourrissant 100% naturel à base de cire d\'abeille et de miel.',
    price: 1500,
    stock: 35,
    category: 'COSMETIQUE',
    images: '/placeholder.jpg',
    featured: true,
    monasteryIndex: 1,
  },
  {
    name: 'Miel de Néré (Kapok)',
    description: 'Miel rare aux propriétés exceptionnelles, récolté des fleurs du néré.',
    price: 7000,
    stock: 15,
    category: 'MIEL',
    images: '/placeholder.jpg',
    featured: false,
    monasteryIndex: 2,
  },
  {
    name: 'Mélange d\'Épices Yassa',
    description: 'Mélange traditionnel d\'épices pour marinades yassa. Format familial.',
    price: 2000,
    stock: 50,
    category: 'EPICE',
    images: '/placeholder.jpg',
    featured: false,
    monasteryIndex: 2,
  },
  {
    name: 'Savon Noir Africain',
    description: 'Savon traditionnel noir au beurre de karité. Nettoie en douceur.',
    price: 1800,
    stock: 45,
    category: 'COSMETIQUE',
    images: '/placeholder.jpg',
    featured: false,
    monasteryIndex: 1,
  },
  {
    name: 'Confiture d\'Ananas Épicé',
    description: 'Confiture d\'ananas avec une touche de gingembre et de piment doux.',
    price: 3800,
    stock: 30,
    category: 'CONFITURE',
    images: '/placeholder.jpg',
    featured: false,
    monasteryIndex: 0,
  },
]

async function main() {
  console.log('Start seeding...')

  // Create monasteries
  const createdMonasteries = []
  for (const monastery of monasteries) {
    const created = await prisma.monastery.create({
      data: monastery,
    })
    createdMonasteries.push(created)
    console.log(`Created monastery: ${created.name}`)
  }

  // Create products
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        images: product.images,
        featured: product.featured,
        monasteryId: createdMonasteries[product.monasteryIndex].id,
      },
    })
    console.log(`Created product: ${created.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
