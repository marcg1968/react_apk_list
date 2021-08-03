// App.js

import './App.css'
import {useEffect, useRef, useState} from "react"
import Listing from "./Listing";
// const { REACT_APP_URL } = process.env

const URL = process.env.NODE_ENV === 'development'
    ? 'https://marcg.ddnss.org/apk/index.cgi?listing'
    : './index.cgi?listing'
// const ELAPSED = 1000 * 60 * 5

const App = () => {

    const [files, setFiles] = useState([])
    const [lastFetch, setLastFetch] = useState(null)
    const [newSince, setNewSince] = useState([])

    const mountedRef = useRef(false)
    const firstAccessRef = useRef(+new Date())

    const doFetch = () => {
        if (!mountedRef.current) return
        fetch(URL)
            .then(r => r.json())
            .then(data => {
                setLastFetch(+new Date())
                console.log(20, data, typeof data)
                data.sort((a, b) => a.ts < b.ts ? 1 : -1)
                if (mountedRef.current) {
                    setFiles(data)
                }
                // highlight if updated since first access
                if (firstAccessRef && data) {
                    // && firstAccessRef.current + ELAPSED > +new Date()
                    // const arr = data.filter(({ts}) => ts * 1000 > firstAccessRef.current)
                    // console.log(firstAccessRef.current, {arr})
                    setNewSince(data.filter(({ts}) => ts * 1000 > firstAccessRef.current))
                }
            })
    }

    useEffect(() => {
        console.log(44, newSince)
    }, [newSince])

    useEffect(() => {
        // let mounted = true
        // fetch(URL)
        //     .then(r => r.json())
        //     .then(data => {
        //         console.log(20, data, typeof data)
        //         data.sort((a, b) => a.ts < b.ts ? 1 : -1)
        //         if (mounted) {
        //             setFiles(data)
        //         }
        //     })
        mountedRef.current = true
        doFetch()
        // return () => mounted = false
        return () => mountedRef.current = false
    }, [])

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
    }, 9000)

    const { width } = useWindowSize()
    let direction = width > 1024 ? 'row' : 'column'
    let cross = width <= 1024 ? 'column' : 'row'

    return (
        <div
            className="App"
            style={{
                backgroundColor: 'rgba(128,63,63,0.5)',
                minHeight: '99vh',
            }}
        >
            <header>
                {/*<p>process.env.NODE_ENV = <code>{process.env.NODE_ENV}</code></p>*/}
                {/*<p>URL = <code>{URL}</code></p>*/}
                {/*<p>width = <code>{width}</code></p>*/}
                {/*<p>direction = <code>{direction}</code></p>*/}
                <h1><code>.apk</code> Files for Download</h1>
            </header>

            <Listing
                direction={direction}
                cross={cross}
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
