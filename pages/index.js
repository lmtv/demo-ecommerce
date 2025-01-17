import Head from 'next/head'
import { Center, Footer, Tag, Showcase, DisplaySmall, DisplayMedium } from '../components'
import { titleIfy, slugify } from '../utils/helpers'
import { fetchInventory } from '../utils/inventoryProvider'
import CartLink from '../components/CartLink'
import { getStatus } from '../services/RemoteFlagsApi';
import { useState, useEffect } from 'react'

const heroSofas = {
  default : 2,
  brown : 6,
  grey : 0,
}

const Home = ({ inventoryData = [], categories: categoryData = [] }) => {
  const [discountPrice, setDiscountPrice] = useState(null)
  const [newSofas, setNewSofas] = useState(true)
  const [heroSofa, setHeroSofa] = useState(null)
  const [renderClientSideComponent, setRenderClientSideComponent] = useState(false)

  const inventory = inventoryData
  const categories = categoryData.slice(0, 2)

//  function fetchNewSofas() {
//    getStatus(
//      {
//        token: "CjwMyo3AT3HDXL9lW3TMX5ZPc_FVlQp5",
//        ownerId: "2288cb5f-d03f-457b-8eb2-afb0efd9081d",
//        flagId: "927f9ce1-34f2-43aa-830d-6549e69ec7e1",
//      },
//      (response) => {
//        setNewSofas(response.value == "On")
//      },
//      () => {
//        setNewSofas(false)
//      });
//  }

  function fetchDiscountPrice() {
    getStatus(
      {
        token: "CjwMyo3AT3HDXL9lW3TMX5ZPc_FVlQp5",
        ownerId: "2288cb5f-d03f-457b-8eb2-afb0efd9081d",
        flagId: "03b2accb-4a2b-4e8f-8173-d5e6e2c11177",
      },
      (response) => {
        setDiscountPrice(response.value == "On")
      },
      () => {
        setDiscountPrice(false)
      });
  }

    function fetchHeroSofa() {
      getStatus(
        {
          token: "CjwMyo3AT3HDXL9lW3TMX5ZPc_FVlQp5",
          ownerId: "2288cb5f-d03f-457b-8eb2-afb0efd9081d",
          flagId: "e7f1691f-1c3a-4967-bbbd-13f90fa2f354",
        },
        (response) => {
          setHeroSofa(heroSofas[response.value]);
        },
        () => {
          heroSofas["default"];
        });
    }

  useEffect(() => {
    fetchHeroSofa()
    fetchDiscountPrice()
    //fetchNewSofas()
  }, [])

  return (
    <>
      <CartLink />
      <div className="w-full">
        <Head>
          <title>Not a Sofa store</title>
          <meta name="description" content="Not a Sofa - RemoteFlags demo for a sample e-commerce platform based on Jamstack Ecommerce using Next.js." />
          <meta property="og:title" content="Not a Sofa store" key="title" />
        </Head>
        <div className="bg-blue-300 p-6 pb-10 smpb-6 flex lg:flex-row flex-col">
          <div className="pt-4 pl-2 sm:pt-12 sm:pl-12 flex flex-col">
            <Tag
              year="2022"
              category="SOFAS"
            />
            { heroSofa != null &&
              <Center
                price={inventory[heroSofa].price}
                discountPrice={discountPrice}
                title={inventory[heroSofa].name}
                link={`/product/${slugify(inventory[heroSofa].name)}`}
              />
            }
            <Footer
              designer="Jason Bourne"
            />
          </div>
          <div className="flex flex-1 justify-center items-center relative">
            { heroSofa != null &&
              <Showcase
                imageSrc={inventory[heroSofa].image}
              />
            }
            <div className="absolute
              w-48 h-48 sm:w-72 sm:h-72 xl:w-88 xl:h-88
              bg-white z-0 rounded-full" />
          </div>
        </div>
      </div>
      <div className="
        lg:my-8 lg:grid-cols-2
        grid-cols-1
        grid gap-4 my-4 
      ">
        <DisplayMedium
          imageSrc={categories[0].image}
          subtitle={`${categories[0].itemCount} items`}
          title={titleIfy(categories[0].name)}
          link={`/category/${slugify(categories[0].name)}`}
        />
        {newSofas && <DisplayMedium
          imageSrc={categories[1].image}
          subtitle={`${categories[1].itemCount} items`}
          title={titleIfy(categories[1].name)}
          link={`/category/${slugify(categories[1].name)}`}
        />
        }
      </div>
      <div className="pt-10 pb-6 flex flex-col items-center">
        <h2 className="text-4xl mb-3">Trending Now</h2>
        <p className="text-gray-600 text-sm">Find the perfect piece or accessory to finish off your favorite room in the house.</p>
      </div>
      <div className="my-8 flex flex-col lg:flex-row justify-between">
        <DisplaySmall
          imageSrc={inventory[0].image}
          title={inventory[0].name}
          subtitle={inventory[0].categories[0]}
          link={`/product/${slugify(inventory[0].name)}`}
        />

        <DisplaySmall
          imageSrc={inventory[1].image}
          title={inventory[1].name}
          subtitle={inventory[1].categories[0]}
          link={`/product/${slugify(inventory[1].name)}`}
        />

        <DisplaySmall
          imageSrc={inventory[2].image}
          title={inventory[2].name}
          subtitle={inventory[2].categories[0]}
          link={`/product/${slugify(inventory[2].name)}`}
        />

        <DisplaySmall
          imageSrc={inventory[3].image}
          title={inventory[3].name}
          subtitle={inventory[3].categories[0]}
          link={`/product/${slugify(inventory[3].name)}`}
        />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const inventory = await fetchInventory()

  const inventoryCategorized = inventory.reduce((acc, next) => {
    const categories = next.categories
    categories.forEach(c => {
      const index = acc.findIndex(item => item.name === c)
      if (index !== -1) {
        const item = acc[index]
        item.itemCount = item.itemCount + 1
        acc[index] = item
      } else {
        const item = {
          name: c,
          image: next.image,
          itemCount: 1
        }
        acc.push(item)
      }
    })
    return acc
  }, [])

  return {
    props: {
      inventoryData: inventory,
      categories: inventoryCategorized,
    }
  }
}

export default Home
