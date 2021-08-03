// App.js

import './App.css'
import {useCallback, useEffect, useRef, useState} from "react"
import Listing from "./Listing";
// const { REACT_APP_URL } = process.env

const URL = process.env.NODE_ENV === 'development'
    ? 'https://marcg.ddnss.org/apk/index.cgi?listing'
    : './index.cgi?listing'
// const INTERVAL = 1.5 * 1000 * 60 /* update interval in msecs, e.g. every 1.5 minutes */
const INTERVAL = 9 * 1000

const App = () => {

    const [files, setFiles] = useState([])
    const [lastFetch, setLastFetch] = useState(null)
    const [newSince, setNewSince] = useState([])

    const mountedRef = useRef(false)
    const firstAccessRef = useRef(+new Date())

    // const tellNewLoc = useCallback((i, {x, y}, stack, posReached) => {
    const doFetch = useCallback(() => {
        if (!mountedRef.current) return
        fetch(URL)
            .then(r => r.json())
            .then(data => {
                // console.log(29, data)
                setLastFetch(+new Date())
                data.sort((a, b) => a.ts < b.ts ? 1 : -1)
                if (mountedRef.current) {
                    setFiles(data)
                }
                // /* highlight if updated since first access */
                // /* NOTE: this will continually update the newSince state var and thus cause a re-render */
                // if (firstAccessRef && data) {
                //     let _newSince = data.filter(({ts}) => ts * 1000 > firstAccessRef.current)
                //     if (_newSince.length) {
                //         setNewSince(_newSince)
                //     }
                // }

                /* only update newSince arr if ts changed */
                if (firstAccessRef && data) {
                    let _newSince = data.filter(({ts}) => ts * 1000 > firstAccessRef.current)
                    if (_newSince.length && newSince.length === 0) {
                        return setNewSince(_newSince)
                    }
                    _newSince.map(({ts, file}) => {
                        return setNewSince(prev => {
                            let i
                            /* if exact match skip out without updating */
                            i = prev.findIndex(e => e.ts === ts && e.file === file)
                            // console.log(62, {i})
                            if (i >= 0) return prev
                            /* if time diff - update existing */
                            i = prev.findIndex(e => e.ts !== ts && e.file === file)
                            // console.log(67, {i})
                            if (i >= 0) {
                                prev = prev.splice(i, 1) /* create new element to force reload */
                                return [...prev, {ts, file}]
                            }
                            /* reached here the items is hitherto unknown and must be added */
                            // console.log(73, {i})
                            return prev.concat({ts, file})
                        })
                    })
                }
            })
    }, [newSince])

    useEffect(() => {
        // console.log(44, newSince)
        const plural = newSince.length > 1
        const isAre = plural ? 'are' : 'is'
        if (newSince.length) {
            console.log(`There ${isAre} ${newSince.length} new or updated `
                + `file${plural ? 's' : ''} since page was loaded:`)
            console.table(newSince)
        }

    }, [newSince])

    useEffect(() => {
        mountedRef.current = true
        doFetch()
        // return () => mounted = false
        return () => mountedRef.current = false
    }, [doFetch])

    const useWindowSize = () => { /* cf https://usehooks.com/useWindowSize/ */
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined,
        });
        useEffect(() => {
            // Handler to call on window resize
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
            window.addEventListener("resize", handleResize);
            // Call handler right away so state gets updated with initial window size
            handleResize();
            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }, []); // Empty array ensures that effect is only run on mount
        return windowSize;
    }

    const useInterval = (callback, delay) => { /* https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
        const savedCallback = useRef()

        useEffect(() => { // Remember the latest callback
            savedCallback.current = callback
        }, [callback])

        useEffect(() => { // Set up the interval
            const tick = () => {
                savedCallback.current()
            }
            if (delay !== null) {
                let id = setInterval(tick, delay)
                return () => clearInterval(id)
            }
        }, [delay])
    }

    useInterval(() => {
        doFetch()
    }, INTERVAL)

    const { width } = useWindowSize()
    let direction = width > 1024 ? 'row' : 'column' /* small devices: main direction column */

    return (
        <div
            className="App"
            style={{
                backgroundColor: 'rgba(128,63,63,0.5)',
                minHeight: '99vh',
            }}
        >
            {/*{(new Date(firstAccessRef.current)).toISOString()}*/}
            {/*<pre>{JSON.stringify(newSince, null, 2)}</pre>*/}
            <header>
                <h1><code>.apk</code> Files for Download</h1>
            </header>

            <Listing
                direction={direction}
                files={files}
                newSince={newSince}
            />

            <footer>
                <p>last checked = <code>{(new Date(lastFetch)).toISOString()}</code></p>
            </footer>
        </div>
    )
}

export default App
