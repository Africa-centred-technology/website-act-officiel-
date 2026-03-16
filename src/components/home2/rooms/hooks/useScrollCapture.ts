import { useEffect, RefObject } from "react";

/**
 * Hook to capture scroll events and prevent transitioning to other rooms
 * before scrolling down the current container
 */
export function useScrollCapture(containerRef: RefObject<HTMLDivElement>) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (isHorizontal) return;

            const isAtTop = container.scrollTop <= 0;
            const isAtBottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight - 2;

            if (e.deltaY < 0 && isAtTop) return;
            if (e.deltaY > 0 && isAtBottom) return;

            e.stopPropagation();
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            const dy = touchStartY - touchEndY;

            const isAtTop = container.scrollTop <= 0;
            const isAtBottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight - 2;

            if (dy < 0 && isAtTop) return;
            if (dy > 0 && isAtBottom) return;

            e.stopPropagation();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const isAtTop = container.scrollTop <= 0;
            const isAtBottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight - 2;

            if (["ArrowUp", "PageUp"].includes(e.key)) {
                if (!isAtTop) e.stopPropagation();
            } else if (["ArrowDown", "PageDown", " "].includes(e.key)) {
                if (!isAtBottom) e.stopPropagation();
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchend", handleTouchEnd, { passive: false });
        window.addEventListener("keydown", handleKeyDown, { capture: true });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("keydown", handleKeyDown, { capture: true });
        };
    }, [containerRef]);
}
