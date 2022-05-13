import { Button } from '../';
import { useRouter } from 'next/router'

const Center = ({ price, discountPrice, title, link }) => {
  const router = useRouter()
  function navigate() {
    router.push(link)
  }
  return (
    <div>
      <p className="text-4xl xl:text-5xl font-bold tracking-widest leading-none">{title}</p>
      {!discountPrice && <p className="py-6 tracking-wide">FROM <span>${price}</span></p>}
      {discountPrice && <div>
        <p className="pt-6 tracking-wide">FROM <span className='line-through'>${price}</span><span className='text-lg mx-2'>${price * .75}</span></p>
        <p className="pt-2 pb-4 tracking-wide"><span className='text-lg bg-red-400'>25% Off</span></p>
      </div>}
      <Button
        onClick={navigate}
        title="Shop Now"
      />
    </div>
  )
}

export default Center