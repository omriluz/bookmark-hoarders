import { sendToBackground } from "@plasmohq/messaging";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import autoAnimate from '@formkit/auto-animate'

import "~style.css";
import Loader from "~components/Loader";
import Card from "~components/Card";


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

    const deleteBookmark = async (event: MouseEvent, id: number) => {
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
            {loading ? (
                <div className="max-w-7xl mx-auto flex justify-center items-center">
                    <Loader />
                </div>)
                : (
                    <div ref={parent} className="max-w-7xl mx-auto rounded-lg columns-2 lg:columns-3">
                        {!!bookmarks && !!bookmarks.length && bookmarks.map((bookmark, index) => <Card deleteBookmark={deleteBookmark} bookmark={bookmark} index={index} />)}
                    </div>
                )}
        </div>
    )
}
export default newtab