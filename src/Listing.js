import React from 'react'

const Listing = props => {

    const {
        direction,
        files,
        newSince,
    } = props

    /* overrides for small devices */
    const styleFlexMain = direction === 'column' ? { flexDirection: 'column'} : {}
    const classColCentred = direction === 'column' ? 'colCentred' : ''

    return (
        <section className={'listing'} style={{...styleFlexMain}}>
            <div className={'colSpacer'}/>
            <div className={'listingContainer'} style={{...styleFlexMain}}>

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

                    return (
                        <div className={'rowOuter'} key={'item-' + i}>
                            {i === 0 ? <h3>Most recent:</h3> : null}

                            <div className={'rowInner'} style={{...styleFlexMain}}>
                                <div className={'col1 ' + classColCentred}>
                                    {dHighlight}
                                    {dHighlight && <br/>}
                                    {d}
                                </div>
                                <h2 className={'col2'}>{title}</h2>
                                <h3 className={'col3'}>
                                    <a
                                        href={'./' + file}
                                        className={highlight ? 'hottest hottestL' : ''}
                                    >Download</a>
                                    <span className={highlight ? 'hottest hottestR' : ''}>
                                        {highlight ? ' <<< new!' : null}
                                    </span>
                                </h3>
                            </div>

                            {i === 0
                                ? (
                                    <div className={'rowOlderOuter'}>
                                        <div className={'colSpacer'}/>
                                        <div className={'rowOlderInner'}>
                                            <h4>Older releases:</h4>
                                        </div>
                                        <div className={'colSpacer'}/>
                                    </div>
                                )
                                : null
                            }
                        </div>
                    )
                })}
            </div>
            <div className={'colSpacer'}/>
        </section>
    )
}

export default Listing
