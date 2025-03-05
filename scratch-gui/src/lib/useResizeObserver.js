import { useEffect, useRef, useState } from 'react'
const useResizeObserver = () => {
    let [size, setSize] = useState({ width: 0, height: 0 });
    let elementRef = useRef();
    let [trigger, setTrigger] = useState(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        })

        if (elementRef.current) {
            resizeObserver.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                resizeObserver.unobserve(elementRef.current);
                resizeObserver.disconnect();
            }
        }
    }, [trigger])


    return [elementRef, size, setTrigger];
}
export default useResizeObserver;