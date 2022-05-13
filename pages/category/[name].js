import Head from 'next/head'
import ListItem from '../../components/ListItem'
import { titleIfy, slugify } from '../../utils/helpers'
import fetchCategories from '../../utils/categoryProvider'
import inventoryForCategory from '../../utils/inventoryForCategory'
import CartLink from '../../components/CartLink'
import { getStatus } from '../../services/RemoteFlagsApi';
import { useState, useEffect } from 'react'

const Category = (props) => {
  const { inventory, title } = props
  const [viewHeight, setViewHeight] = useState(false)
  const [renderClientSideComponent, setRenderClientSideComponent] = useState(false)

  useEffect(() => {
    setRenderClientSideComponent(false)
    getStatus(
      {
        token: "CjwMyo3AT3HDXL9lW3TMX5ZPc_FVlQp5",
        ownerId: "2288cb5f-d03f-457b-8eb2-afb0efd9081d",
        flagId: "976d63b4-6961-4052-a68f-5a59bad58eef",
        segment: title,
        key: title
      },
      (response) => {
        setViewHeight(response.value)
        setRenderClientSideComponent(true)
      },
      () => {
        setViewHeight("72")
        setRenderClientSideComponent(true)
      }
    );
  }, [title])

  return (
    <>
      <CartLink />
      <Head>
        <title>Jamstack ECommerce - {title}</title>
        <meta name="description" content={`Jamstack ECommerce - ${title}`} />
        <meta property="og:title" content={`Jamstack ECommerce - ${title}`} key="title" />
      </Head>
      <div className="flex flex-col items-center">
        <div className="max-w-fw flex flex-col w-full">
          <div className="pt-4 sm:pt-10 pb-8">
            <h1 className="text-5xl font-light">{titleIfy(title)}</h1>
          </div>

          <div>
            <div className="flex flex-1 flex-wrap flex-row">
              { renderClientSideComponent &&
                inventory.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      viewHeight={viewHeight}
                      link={`/product/${slugify(item.name)}`}
                      title={item.name}
                      price={item.price}
                      imageSrc={item.image}
                    />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

async function getCategoryImageSize(category) {
  try {
    const result = await getStatusPromise(
      {
        token: "CjwMyo3AT3HDXL9lW3TMX5ZPc_FVlQp5",
        ownerId: "2288cb5f-d03f-457b-8eb2-afb0efd9081d",
        flagId: "976d63b4-6961-4052-a68f-5a59bad58eef",
        segment: category,
        key: category
      });

    return result.value;
  }
  catch (e) {
    return "72";
  }
}

export async function getStaticPaths() {
  const categories = await fetchCategories()
  const paths = categories.map(category => {
    return { params: { name: slugify(category) } }
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const category = params.name.replace(/-/g, " ")
  const inventory = await inventoryForCategory(category)

  return {
    props: {
      inventory,
      title: category
    }
  }
}

export default Category