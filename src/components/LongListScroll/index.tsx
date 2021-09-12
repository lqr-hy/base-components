import React, { useState, useEffect, useRef } from 'react'

export interface ILongListScrollProps {
  /** 当前显示的位置 */
  activeIndex?: number
  /**  数据源 */
  listData: Array<any>
  /** 每次需要加载的数据 */
  rendNum?: number
  /** 高度 */
  height?: number
  /** 单项高度 */
  countHeight: number
  /** render需要渲染的数据 */
  render: <T>(style: IStyleProp, list: Array<T>) => React.ReactNode
}

// export interface IListData<T> {
//   /**  数据源 */
//   listData: Array<T>
// }

export interface IStyleProp {
  height: string
  lineHeight: string
}

const LongListScroll: React.FC<ILongListScrollProps> = (props) => {
  const {
    activeIndex,
    listData,
    rendNum,
    height,
    countHeight,
    render
  } = props
  const [listHeight, setListHeight] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const [renderData, setRenderData] = useState([''])
  const [renderSection, setRenderSection] = useState({
    start: 0,
    end: 15
  })
  // const classes = classNames('',{})
  const container = useRef<HTMLDivElement | null>(null)
  const scrollEvent = () => {
    // 当前滚动的距离
    const scrollTop = (container.current as HTMLDivElement).scrollTop
    //此时的开始索引
    const start = Math.floor(scrollTop / countHeight)
    //此时的结束索引
    const end = start + (rendNum as number)
    setRenderSection({ start, end })
    // 此时的偏移量
    const Offset = scrollTop - (scrollTop % countHeight)

    setStartOffset(Offset)
  }

  useEffect(() => {
    const listHeight = listData.length * countHeight
    setListHeight(listHeight)
  }, [countHeight, listData])

  useEffect(() => {
    setRenderSection({
      start: activeIndex as number,
      end: (activeIndex as number) + 15
    })
  }, [activeIndex])

  useEffect(() => {
    const renderData = listData.slice(
      renderSection.start,
      Math.min(renderSection.end, listData.length)
    )
    setRenderData(renderData)
  }, [renderSection, listData])

  const styles = {
    height: countHeight + 'px',
    lineHeight: countHeight + 'px'
  }

  return (
    <div
      ref={container}
      className="l-list-container"
      onScroll={scrollEvent}
      style={{
        height: height + 'px'
      }}
      data-testid="test-long"
    >
      <div
        className="l-list-phantom"
        style={{ height: listHeight + 'px' }}
      ></div>
      <div
        className="l-list"
        style={{ transform: `translate3d(0,${startOffset}px,0)` }}
      >
        {render(styles, renderData)}
        {/* {renderData &&
          renderData.map((item, index) => {
            return (
              <div
                className="l-list-item"
                key={index}
                style={{
                  height: countHeight + 'px',
                  lineHeight: countHeight + 'px'
                }}
              >
                {item}
              </div>
            )
          })} */}
      </div>
    </div>
  )
}

LongListScroll.defaultProps = {
  height: 500,
  activeIndex: 0
}

export default LongListScroll
