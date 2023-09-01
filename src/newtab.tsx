import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import autoAnimate from '@formkit/auto-animate'


import "~style.css";
import Loader from "~components/Loader";


const newtab = () => {
    const [loading, setLoading] = useState(true)
    const [bookmarks, setBookmarks] = useState([])
    const parent = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getBookmarks()
    }, [])

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent])



    const getBookmarks = async () => {

        try {
            const resp = await sendToBackground({
                name: 'bookmarks',
                body: {
                    message: 'get'
                }
            })
            if (!resp || !resp.length) {
                // here i need to initialize new bookmarks
                console.log('%chere i need to initialize new bookmarks', 'background-color:firebrick;color:magenta;font-size:2rem;');
                // initBookmarks()  
            }

            setLoading(false)
            setBookmarks(resp)

        } catch (err) {
            console.log('fdasfds');
        }


    }

    const deleteBookmark = async (event: MouseEvent, id: string) => {
        event.preventDefault()
        //CHECK delete bookmark in actual chrome bookmarks
        //CHECK update the state
        // Remove from storage 
        const resp = await sendToBackground({
            name: 'bookmarks',
            body: {
                message: 'delete',
                id
            }
        })

        console.log(resp);


        if (resp === 'success') {
            const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== id)
            setBookmarks(filteredBookmarks)
        }


    }


    const getUserSettings = async () => {
        const resp = await sendToBackground({
            name: "userSettings",
            body: {
                message: `get`
            }
        })

    }

    // const goToHrefAndDeleteBookmark = async (id: string, url: string) => {
    //     await deleteBookmark(id)
    //     window.location.href = url;
    // }

    return (
        <div className="bg-gray-200 text-4xl py-20 px-4 lg:px-8">
            <div>{loading ? 'loading...' : 'done loading'}</div>
            <button onClick={getBookmarks}>get bookmarks</button>
            {loading ? (<div className="max-w-7xl mx-auto flex justify-center items-center"><Loader /></div>)
                : (<div ref={parent} className="max-w-7xl mx-auto rounded-lg columns-2 lg:columns-3">
                    {!!bookmarks && !!bookmarks.length && bookmarks.filter(bookmark => bookmark && bookmark?.images && bookmark?.images?.length > 0).map((bookmark, index) => (
                        <a key={bookmark.url + index} id={bookmark.id}
                            // onClick={() => goToHrefAndDeleteBookmark(bookmark?.id, bookmark?.url)}
                            href={bookmark.url}
                            className="mb-2.5 block break-inside-avoid relative">
                            <button type="button" className="text-base absolute top-2 left-2 bg-white font-bold p-2 rounded-lg" onClick={(event) => deleteBookmark(event, bookmark?.id)}>
                                delete
                            </button>
                            <img className="w-full min-h-[10rem] min-w-[10rem] rounded-t-lg" src={bookmark && bookmark?.images && bookmark?.images?.length > 0 ? bookmark?.images[0] : `https://unsplash.it/612/428?${index}`} alt="" />
                            <div className="bg-white space-y-2 rounded-b-lg text-sm font-bold py-6 px-4">
                                <p className="text-lg font-bold line-clamp-2">{bookmark.title}</p>
                                <p className="line-clamp-3">{bookmark.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
                )}
        </div>
    )
}
export default newtab