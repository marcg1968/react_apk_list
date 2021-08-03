import React from 'react'

const Listing = props => {

    const {
        direction,
        cross,
        files,
        newSince,
    } = props

    return (
        <section>
            <div
                style={{
                    display: 'flex', flexDirection: direction, alignItems: 'center',
                    // backgroundColor: 'rgba(128,63,63,0.66)',
                    paddingBottom: '3rem',
                    // marginBottom: '3rem',
                }}>
                <div
                    style={{
                        flex: 1,
                        // border: '10px solid green',
                    }}>&nbsp;</div>
                <div
                    style={{
                        flex: 6,
                        border: '10px solid rgba(128,63,63,0.66)',
                        flexDirection: cross,
                        backgroundColor: '#fefefe',
                        paddingBottom: '3rem',
                    }}>

                    {files.length && files.map(({file, ts}, i, self) => {

                        const foundNewSince = newSince.find(e => e.file === file)
                        const highlight = foundNewSince ? foundNewSince.file === file : false

                        let d = new Date(ts * 1000)
                            .toISOString()
                            .substr(0, 16)
                            // .replace('T', ' @ ')
                            .replace('T', ' ')
                            .replace(':', 'h')
                        let dHighlight = highlight
                            ? 'New since last access:'
                            : null
                        let title = file.replace(/\.apk$/i, '')
                        // direction = 'column' // force

                        return (
                            <div
                                key={'item-' + i}
                                style={{
                                    flex: 1,
                                    // border: '5px solid yellow'
                                }}
                            >
                                {i === 0 ? <h3>Most recent:</h3> : null}

                                <div
                                    style={{
                                        display: 'flex', flexDirection: direction, alignItems: 'center'
                                    }}
                                >
                                    <div style={{ flex: 2, textAlign: 'right', }}
                                    >
                                        {dHighlight}
                                        {dHighlight && <br/>}
                                        {d}
                                    </div>
                                    <h2 style={{ flex: 3 }}>{title}</h2>
                                    <h3
                                        style={{ flex: 2, textAlign: 'left', }}
                                    >
                                        <a
                                            href={'./' + file}
                                            className={highlight ? 'hottest hottestL' : ''}
                                        >Download</a>
                                        <span
                                            className={highlight ? 'hottest hottestR' : ''}
                                        >
                                            {highlight ? ' <<< new!' : null}
                                        </span>
                                    </h3>
                                </div>

                                {i === 0
                                    ? (
                                        <div
                                            style={{
                                                display: 'flex', flexDirection: direction,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>&nbsp;</div>
                                            <div
                                                style={{
                                                    flex: 3,
                                                    // border: '5px solid crimson',
                                                    borderTop: '1px solid #282c34',
                                                    paddingTop: '0.67rem',
                                                    marginTop: '2rem',
                                                }}
                                            >
                                                <h4
                                                    style={{
                                                        // borderTop: '1px solid #282c34'
                                                    }}
                                                >Older releases:</h4>
                                            </div>
                                            <div style={{ flex: 1 }}>&nbsp;</div>
                                        </div>
                                    )
                                    : null
                                }
                            </div>
                        )
                    })}
                </div>
                <div style={{ flex: 1 }}>&nbsp;</div>
            </div>
        </section>
    )
}

export default Listing
