import { atomFamily, selectorFamily, useSetRecoilState } from "recoil"
import { useRef, useEffect, MutableRefObject } from "react"
import { scrollPositionAtomFam } from "./useScrollPosition"
import { IPoint2d } from "./types"

export const mousePositionAtomFam = atomFamily<IPoint2d, string>({
  key: `mousePosition`,
  default: { x: 0, y: 0 },
})

export const offsetMouseSelectorFam = selectorFamily<IPoint2d, string[]>({
  key: `offsetMouse`,
  get:
    ([mousePosKey, ...scrollPosKeys]) =>
    ({ get }) => {
      const mousePosition = get(mousePositionAtomFam(mousePosKey))
      const offsets = scrollPosKeys.map(key => get(scrollPositionAtomFam(key)))
      const totalOffset = offsets.reduce((tally, offset) => ({
        x: tally.x + offset.x,
        y: tally.y + offset.y,
      }))
      const x = mousePosition.x + totalOffset.x
      const y = mousePosition.y + totalOffset.y
      return { x, y }
    },
})

export const useSetMousePosition = <T extends HTMLElement>(
  key: string
): MutableRefObject<T | null> => {
  const nodeRef = useRef<T | null>(null)
  const setPosition = useSetRecoilState(mousePositionAtomFam(key))

  useEffect(() => {
    const setFromEvent = (e: Event) => {
      if (nodeRef.current) {
        const { scrollX, scrollY } = window
        const { clientX, clientY } = e as MouseEvent
        const { offsetTop, offsetLeft } = nodeRef.current || {
          offsetTop: 0,
          offsetLeft: 0,
        }
        const x = clientX - offsetLeft + scrollX
        const y = clientY - offsetTop + scrollY
        setPosition({ x, y })
      }
    }
    window.addEventListener(`mousemove`, setFromEvent)

    return () => {
      window.removeEventListener(`mousemove`, setFromEvent)
    }
  }, [setPosition])

  return nodeRef
}
