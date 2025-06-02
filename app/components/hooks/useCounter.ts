import { useCallback, useState } from "react"

export function useCounter() {
    const [count, setCount] = useState<number>(0)
    const add = useCallback(() => {
        setCount((prev) => prev+1)
    }, [])
    return [count, add] as const
}