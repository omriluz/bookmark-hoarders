import type { ComponentPropsWithoutRef } from "react"
import placeHolderImage from "data-base64:~assets/placeholder.png"

type Bookmark = {
    url: string
    images: string[]
    id: number
    title: string
    description: string
}

interface Props extends ComponentPropsWithoutRef<'a'> {
    index: number
    bookmark: Bookmark
    deleteBookmark: (event: any, id: number) => void
}

const Card = ({ index, bookmark, deleteBookmark }: Props) => {
    const { url, images, description, id, title } = bookmark || {}
    const image = (images && images.length) ? images[0] : placeHolderImage
    return (
        <a key={url + index} id={`${id}`}
            // onClick={() => goToHrefAndDeleteBookmark(bookmark?.id, bookmark?.url)}
            href={url}
            className="mb-2.5 block break-inside-avoid relative">
            {(images && images.length > 0) || <p className="absolute -left-4 text-base z-50">{JSON.stringify(bookmark)}</p>}
            <button type="button" className="text-base absolute top-2 left-2 bg-white font-bold p-2 rounded-lg" onClick={(event) => deleteBookmark(event, id)}>delete</button>
            <img className="w-full min-h-[10rem] min-w-[10rem] rounded-t-lg" src={image} alt="" />
            <div className="bg-white space-y-2 rounded-b-lg text-sm font-bold py-6 px-4">
                <p className="text-lg font-bold line-clamp-2">{title}</p>
                <p className="line-clamp-3">{description}</p>
            </div>
        </a>
    )
}
export default Card