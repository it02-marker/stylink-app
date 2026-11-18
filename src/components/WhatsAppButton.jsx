import React, { useEffect, useRef, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

const VIEWPORT_PADDING = 8;
const DRAG_THRESHOLD = 5;

function snapToNearestEdge(left, top, width, height) {
  const maxLeft = window.innerWidth - width - VIEWPORT_PADDING;
  const maxTop = window.innerHeight - height - VIEWPORT_PADDING;
  const distances = [
    { edge: 'left', distance: left - VIEWPORT_PADDING },
    { edge: 'right', distance: maxLeft - left },
    { edge: 'top', distance: top - VIEWPORT_PADDING },
    { edge: 'bottom', distance: maxTop - top },
  ];
  const nearest = distances.reduce((current, candidate) => (
    candidate.distance < current.distance ? candidate : current
  ));

  if (nearest.edge === 'left') return { left: VIEWPORT_PADDING, top };
  if (nearest.edge === 'right') return { left: maxLeft, top };
  if (nearest.edge === 'top') return { left, top: VIEWPORT_PADDING };
  return { left, top: maxTop };
}

export default function WhatsAppButton() {
  const { contactInfo } = useSiteData();
  const buttonRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [position, setPosition] = useState(null);

  function clampPosition(left, top) {
    const rect = buttonRef.current?.getBoundingClientRect();
    const width = rect?.width || 180;
    const height = rect?.height || 44;
    return {
      left: Math.max(VIEWPORT_PADDING, Math.min(left, window.innerWidth - width - VIEWPORT_PADDING)),
      top: Math.max(VIEWPORT_PADDING, Math.min(top, window.innerHeight - height - VIEWPORT_PADDING)),
    };
  }

  function savePosition(nextPosition) {
    const clamped = clampPosition(nextPosition.left, nextPosition.top);
    const rect = buttonRef.current?.getBoundingClientRect();
    const snapped = snapToNearestEdge(clamped.left, clamped.top, rect?.width || 180, rect?.height || 44);
    setPosition(snapped);
  }

  useEffect(() => {
    if (!position) return undefined;
    const keepInViewport = () => {
      if (dragRef.current) return;
      const clamped = clampPosition(position.left, position.top);
      const rect = buttonRef.current?.getBoundingClientRect();
      const snapped = snapToNearestEdge(clamped.left, clamped.top, rect?.width || 180, rect?.height || 44);
      if (snapped.left !== position.left || snapped.top !== position.top) savePosition(snapped);
    };
    keepInViewport();
    window.addEventListener('resize', keepInViewport);
    return () => window.removeEventListener('resize', keepInViewport);
  }, [position]);

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    const rect = buttonRef.current.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      currentPosition: { left: rect.left, top: rect.top },
      moved: false,
    };
    buttonRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return;

    drag.moved = true;
    event.preventDefault();
    const nextPosition = clampPosition(drag.left + deltaX, drag.top + deltaY);
    drag.currentPosition = nextPosition;
    setPosition(nextPosition);
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      suppressClickRef.current = true;
      savePosition(drag.currentPosition);
    }
    dragRef.current = null;
  }

  function handleClick(event) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    suppressClickRef.current = false;
  }

  function handleKeyDown(event) {
    const offsets = {
      ArrowLeft: [-20, 0],
      ArrowRight: [20, 0],
      ArrowUp: [0, -20],
      ArrowDown: [0, 20],
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    const rect = buttonRef.current.getBoundingClientRect();
    savePosition({ left: rect.left + offset[0], top: rect.top + offset[1] });
  }

  return (
    <a
      ref={buttonRef}
      href={contactInfo.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      aria-description="Drag to move this button along the screen edges. Its label appears on hover or keyboard focus. Use the arrow keys to reposition it."
      draggable="false"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(event) => event.preventDefault()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        ...(position ? { left: position.left, top: position.top } : {}),
        touchAction: 'none',
        cursor: dragRef.current?.moved ? 'grabbing' : 'grab',
      }}
      className={`group fixed z-50 flex h-11 w-11 select-none items-center justify-center rounded-full bg-green-600 text-white shadow-xl transition-colors duration-300 hover:bg-green-700 ${
        position ? '' : 'bottom-4 right-4'
      }`}
    >
      <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
      <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-green-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Chat Spares Desk
      </span>
    </a>
  );
}
