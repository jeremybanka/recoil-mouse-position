import { atomFamily, useSetRecoilState } from "recoil"
import { useRef, useEffect, MutableRefObject } from "react"
import { IPoint2d } from "./types"

export const scrollPositionAtomFam = atomFamily<IPoint2d, string>({
  key: `scroll`,
  default: { x: 0, y: 0 },
})

export const useScrollPosition = <T extends HTMLElement>(
  key: string
): MutableRefObject<T | null> => {
  const nodeRef = useRef<T | null>(null)
  const setScrollPosition = useSetRecoilState(scrollPositionAtomFam(key))

  useEffect(() => {
    const setFromEvent = () => {
      if (nodeRef.current) {
        const { scrollLeft: x, scrollTop: y } = nodeRef.current || {
          scrollTop: 0,
          scrollLeft: 0,
        }
        setScrollPosition({ x, y })
      }
    }
    const { current } = nodeRef
    if (nodeRef.current) nodeRef.current.addEventListener(`scroll`, setFromEvent)

    return () => {
      if (current) current.removeEventListener(`scroll`, setFromEvent)
    }
  }, [setScrollPosition])

  return nodeRef
}
